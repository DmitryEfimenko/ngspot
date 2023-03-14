/* eslint-disable @angular-eslint/no-host-metadata-property */
import { AnimationOptions } from '@angular/animations';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { ExpandableInputBase } from './expandable-input-base';
import { slideInOut } from './expandable-input.animations';
import { FocusableDirective } from './focusable.directive';
import { IfAnimatedDirective } from './if-animated.directive';
import { InputsManagerService } from './inputs-manager.service';

/**
 * Example usage:
 * <ngs-expandable-input>
 *   <input type="text" *ngsExpInput />
 *   <i *ngsExpIconOpen>open</i>
 *   <i *ngsExpIconClose>close</i>
 * </ngs-expandable-input>
 */
@Component({
  selector: 'ngs-expandable-input',
  templateUrl: 'expandable-input.component.html',
  styleUrls: ['./expandable-input.component.scss'],
  standalone: true,
  imports: [CommonModule, FocusableDirective, IfAnimatedDirective],
  animations: [slideInOut],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandableInputComponent
  extends ExpandableInputBase
  implements OnInit, OnDestroy
{
  private inputsManager = inject(InputsManagerService);
  private cdr = inject(ChangeDetectorRef);
  private document = inject(DOCUMENT);

  @ViewChild('inputElWrapper', { static: true })
  inputElWrapper: ElementRef<HTMLElement>;

  isOpen = false;

  animationOptions: AnimationOptions = {
    params: {
      duration: this.animationDuration,
      easing: this.animationEasing,
    },
  };

  get inputEl() {
    return this.inputElWrapper.nativeElement.querySelector('input');
  }

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

  ngOnInit() {
    this.inputsManager.registerComponent(this);
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
    this.inputEl?.focus();
  }

  private blurOnInput() {
    if (this.blurInputOnEsc) {
      // input might have other keyup.escape handler associated with it
      // setTimeout to push blur call at the end of the event loop
      setTimeout(() => {
        this.inputEl?.blur();
      });
    }
  }

  private isInputFocused() {
    const el = this.document.activeElement;
    if (!el) {
      return false;
    }
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      return true;
    }
    return false;
  }
}
