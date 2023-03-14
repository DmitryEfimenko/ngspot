/* eslint-disable @angular-eslint/no-input-rename */
import {
  AnimationAnimateMetadata,
  AnimationAnimateRefMetadata,
  AnimationBuilder,
  AnimationFactory,
  AnimationGroupMetadata,
  AnimationKeyframesSequenceMetadata,
  AnimationMetadata,
  AnimationMetadataType,
  AnimationOptions,
  AnimationPlayer,
  AnimationQueryMetadata,
  AnimationReferenceMetadata,
  AnimationSequenceMetadata,
  AnimationStaggerMetadata,
  AnimationStateMetadata,
  AnimationTransitionMetadata,
  AnimationTriggerMetadata,
} from '@angular/animations';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Directive,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { Observable, skip, Subject, Subscription, switchMap, tap } from 'rxjs';

import { NgChanges } from './model';

/**
 * Directive that targets an element that will be expanded/collapsed.
 * It can be either the <input /> element itself or its parent.
 */
@Directive({
  selector: '[ngsIfAnimated]',
  standalone: true,
})
export class IfAnimatedDirective
  implements AfterContentInit, OnChanges, OnDestroy
{
  private animationBuilder = inject(AnimationBuilder);
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);
  private cdr = inject(ChangeDetectorRef);

  private animateElRef: HTMLElement | undefined;

  private player: AnimationPlayer | undefined;

  private value$$ = new Subject<boolean>();

  /**
   * If custom animationEnter or animationLeave is provided, it may target a
   * child elements for animation. During the init state we parse these out
   * and store in this properties so that if we need to reverse the animation
   * we not only reverse it for the host element, but also for these children.
   */
  private animateChildElSelectorsEnter: string[] = [];
  private animateChildElSelectorsLeave: string[] = [];

  @Input()
  ngsIfAnimated: boolean;

  @Input('ngsIfAnimatedEnter')
  animationEnter: AnimationMetadata | AnimationMetadata[];

  @Input('ngsIfAnimatedEnterOptions')
  animationEnterOptions: AnimationOptions | undefined;

  @Input('ngsIfAnimatedLeave')
  animationLeave: AnimationMetadata | AnimationMetadata[];

  @Input('ngsIfAnimatedLeaveOptions')
  animationLeaveOptions: AnimationOptions | undefined;

  private enterFactory: AnimationFactory;
  private leaveFactory: AnimationFactory;
  private subs = new Subscription();
  private interruptedAt = 0;

  ngAfterContentInit() {
    this.buildAnimationFactories();
    this.determineChildElSelectors();

    const obs$ = this.value$$.pipe(
      tap((val) => {
        if (val && !this.animateElRef) {
          this.setAnimateElRef();
        }
      }),
      skip(1),
      switchMap((val) => this.createPlayerAndPlay$(val))
    );

    this.subs.add(obs$.subscribe());

    this.value$$.next(this.ngsIfAnimated);
  }

  ngOnChanges(changes: NgChanges<IfAnimatedDirective>) {
    if (changes.ngsIfAnimated) {
      this.value$$.next(changes.ngsIfAnimated.currentValue);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private createPlayerAndPlay$(val: boolean) {
    const playing$ = new Observable<boolean>((sub) => {
      if (this.interruptedAt > 0) {
        // previous animation was interrupted by a new value
        // Angular's animation player does not support reversing animations
        // fall back to Web Animations API:
        this.interruptedAt = 0;
        this.reverseAnimations();
      } else {
        this.player = this.createPlayer(val);
        this.player.play();
        this.player.onDone(() => {
          if (this.interruptedAt === 0) {
            this.player?.destroy();
            this.player = undefined;
            sub.complete();
          }
          if (!this.ngsIfAnimated) {
            this.viewContainerRef.clear();
            this.animateElRef = undefined;
            this.interruptedAt = 0;
          }
          this.player = undefined;
        });
      }

      return () => {
        if (this.player) {
          if (this.player.hasStarted()) {
            this.interruptedAt = this.getPosition(this.player);
          } else {
            this.player.destroy();
            this.player = undefined;
          }
        }
      };
    });

    return playing$;
  }

  private createPlayer(isEnter: boolean) {
    return isEnter
      ? this.enterFactory.create(this.animateElRef, this.animationEnterOptions)
      : this.leaveFactory.create(this.animateElRef, this.animationLeaveOptions);
  }

  private getPosition(player: any) {
    // workaround for the issue where player.getPosition() always returns 0
    const actualPlayer = player._renderer.engine.players[0];
    return actualPlayer?.getPosition() ?? 0;
  }

  private reverseAnimations() {
    this.reverseElementAnimation(this.animateElRef);
    if (this.ngsIfAnimated) {
      if (this.animateChildElSelectorsEnter.length) {
        for (const selector of this.animateChildElSelectorsEnter) {
          const childEl =
            this.animateElRef?.querySelector<HTMLElement>(selector);
          this.reverseElementAnimation(childEl);
        }
      }
    } else {
      if (this.animateChildElSelectorsLeave.length) {
        for (const selector of this.animateChildElSelectorsLeave) {
          const childEl =
            this.animateElRef?.querySelector<HTMLElement>(selector);
          this.reverseElementAnimation(childEl);
        }
      }
    }
  }

  private reverseElementAnimation(el: HTMLElement | undefined | null) {
    const animations = el?.getAnimations();
    if (animations?.length) {
      animations[0].reverse();
    }
  }

  private buildAnimationFactories() {
    this.enterFactory = this.animationBuilder.build(this.animationEnter);
    this.leaveFactory = this.animationBuilder.build(this.animationLeave);
  }

  private determineChildElSelectors() {
    this.walkAnimationMetadata(
      this.animationEnter,
      this.animateChildElSelectorsEnter
    );
    this.walkAnimationMetadata(
      this.animationLeave,
      this.animateChildElSelectorsLeave
    );
  }

  private walkAnimationMetadata(
    metadata: AnimationMetadata | AnimationMetadata[],
    selectorsArray: string[]
  ) {
    const arr = Array.isArray(metadata) ? metadata : [metadata];
    for (const metadata of arr) {
      let current: AnimationMetadata | AnimationMetadata[] | undefined =
        metadata;

      while (current !== undefined) {
        const currArr = Array.isArray(current) ? current : [current];
        for (const c of currArr) {
          current = this.visitMetadata(c, selectorsArray);
        }
      }
    }
  }

  private visitMetadata(
    metadata: AnimationMetadata,
    selectorsArray: string[]
  ): AnimationMetadata | AnimationMetadata[] | undefined {
    switch (metadata.type) {
      case AnimationMetadataType.Query:
        selectorsArray.push((metadata as AnimationQueryMetadata).selector);
        return (metadata as AnimationQueryMetadata).animation;

      case AnimationMetadataType.Trigger:
        return (metadata as AnimationTriggerMetadata).definitions;

      case AnimationMetadataType.State:
        return (metadata as AnimationStateMetadata).styles;

      case AnimationMetadataType.Transition:
        return (metadata as AnimationTransitionMetadata).animation;

      case AnimationMetadataType.Sequence:
        return (metadata as AnimationSequenceMetadata).steps;

      case AnimationMetadataType.Group:
        return (metadata as AnimationGroupMetadata).steps;

      case AnimationMetadataType.Animate:
        return (metadata as AnimationAnimateMetadata).styles ?? undefined;

      case AnimationMetadataType.Keyframes:
        return (metadata as AnimationKeyframesSequenceMetadata).steps;

      case AnimationMetadataType.Style:
        return undefined;

      case AnimationMetadataType.Reference:
        return (metadata as AnimationReferenceMetadata).animation;

      case AnimationMetadataType.AnimateChild:
        return undefined;

      case AnimationMetadataType.AnimateRef:
        return (metadata as AnimationAnimateRefMetadata).animation;

      case AnimationMetadataType.Stagger:
        return (metadata as AnimationStaggerMetadata).animation;

      default:
        return undefined;
    }
  }

  private setAnimateElRef() {
    const embeddedViewRef = this.viewContainerRef.createEmbeddedView(
      this.templateRef
    );

    // make sure to render all elements inside of the embedded view ref.
    // otherwise custom animation child selectors might not resolve.
    this.cdr.detectChanges();

    this.animateElRef = embeddedViewRef.rootNodes[0] as HTMLElement;
  }
}
