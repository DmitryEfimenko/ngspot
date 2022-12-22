/* eslint-disable @angular-eslint/no-host-metadata-property */
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ExpIconActionDirective } from './exp-icon-action.directive';
import { ExpIconCloseDirective } from './exp-icon-close.directive';
import { ExpIconOpenDirective } from './exp-icon-open.directive';
import { ExpInputDirective } from './exp-input.directive';
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  rotateActionIcon,
  slideInOut,
  swapIcons,
} from './expandable-input.animations';
import { FocusableDirective } from './focusable.directive';
import { InputsManagerService } from './inputs-manager.service';

export class ExpInputError extends Error {
  constructor(message: string) {
    super(`Error in ngs-expandable-input: ${message}`);
  }
}

/**
 * Example usage:
 * <ngs-expandable-input>
 *   <input type="text" ngsExpInput />
 *   <i ngsExpIconOpen>open</i>
 *   <i ngsExpIconClose>close</i>
 * </ngs-expandable-input>
 */
@Component({
  selector: 'ngs-expandable-input',
  templateUrl: 'expandable-input.component.html',
  styleUrls: ['./expandable-input.component.scss'],
  standalone: true,
  imports: [CommonModule, FocusableDirective],
  animations: [slideInOut, swapIcons, rotateActionIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandableInputComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  /**
   * If multiple components use the same value for "group" input, only one
   * component with that group value can be expanded at a time
   */
  @Input() group: string | undefined;

  /**
   * When true, input looses focus if Esc is pressed
   */
  @Input() blurInputOnEsc = true;

  /**
   * When set to KeyboardEvent.key, input will expand when that key is pressed
   */
  @Input() openOnKey: string | undefined;

  /**
   * How long it takes for input to expand
   */
  @Input() animationDuration = `${ANIMATION_DURATION}ms`;

  /**
   * The easing function for input expansion animation
   */
  @Input() animationEasing = ANIMATION_EASING;

  @Output() opened = new EventEmitter<void>();

  @Output() closed = new EventEmitter<void>();

  isOpen = false;

  @ContentChild(ExpInputDirective, { read: ElementRef, static: false })
  set inputElRef(val: ElementRef<HTMLElement>) {
    if (val) {
      this.inputEl =
        val.nativeElement.tagName.toLowerCase() === 'input'
          ? val.nativeElement
          : val.nativeElement.querySelector('input');
    }
  }
  inputEl: HTMLElement | null;

  @ContentChild(ExpIconOpenDirective, { read: ElementRef, static: false })
  iconOpen: ElementRef;

  @ContentChild(ExpIconCloseDirective, { read: ElementRef, static: false })
  iconClose: ElementRef;

  @ContentChild(ExpIconActionDirective, { read: ElementRef, static: false })
  iconAction: ElementRef;

  @ViewChild('iconOpenWrapper', { static: false })
  iconOpenWrapper: ElementRef;

  @ViewChild('iconCloseWrapper', { static: false })
  iconCloseWrapper: ElementRef;

  @ViewChild('iconActionWrapper', { static: false })
  iconActionWrapper: ElementRef;

  @HostListener('document:keyup.escape')
  onEsc() {
    this.blurOnInput();
  }

  @HostListener('document:keydown', ['$event'])
  keydown(ev: KeyboardEvent) {
    if (
      this.openOnKey !== undefined &&
      ev.key === this.openOnKey &&
      !this.isInputFocused()
    ) {
      ev.preventDefault();
      this.open();
    }
  }

  constructor(
    private inputsManager: InputsManagerService,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit() {
    this.inputsManager.registerComponent(this);
  }

  ngAfterViewInit() {
    this.sanityCheck();
  }

  ngOnDestroy() {
    this.inputsManager.deregisterComponent(this);
  }

  open() {
    this.isOpen = true;
    this.opened.emit();
    this.focusOnInput();
    this.inputsManager.onOpen(this);
  }

  close() {
    this.isOpen = false;
    this.closed.emit();
    this.cdr.detectChanges();
  }

  private focusOnInput() {
    if (this.inputEl) {
      this.inputEl.focus();
    }
  }

  private blurOnInput() {
    if (this.blurInputOnEsc) {
      // input might have other keyup.escape handler associated with it
      // setTimeout to push blur call at the end of the event loop
      setTimeout(() => {
        if (this.inputEl) {
          this.inputEl.blur();
        }
      });
    }
  }

  private isInputFocused() {
    const el: HTMLElement = this.document.activeElement;
    if (!el) {
      return false;
    }
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      return true;
    }
    return false;
  }

  private sanityCheck() {
    if (!this.inputEl) {
      throw new ExpInputError(
        'You need to include an element with attribute ngsExpInput'
      );
    }

    if (!this.iconOpen) {
      throw new ExpInputError(
        'You need to include an element with attribute ngsExpIconOpen'
      );
    }

    if (!this.iconClose) {
      throw new ExpInputError(
        'You need to include an element with attribute ngsExpIconClose'
      );
    }
  }
}
