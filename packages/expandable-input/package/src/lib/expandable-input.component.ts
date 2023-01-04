/* eslint-disable @angular-eslint/no-host-metadata-property */
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ExpIconActionDirective } from './exp-icon-action.directive';
import { ExpIconCloseDirective } from './exp-icon-close.directive';
import { ExpIconOpenDirective } from './exp-icon-open.directive';
import { ExpInputDirective } from './exp-input.directive';
import { ExpandableInputBase } from './expandable-input-base';
import {
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
  imports: [CommonModule, FocusableDirective],
  animations: [slideInOut, swapIcons, rotateActionIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandableInputComponent
  extends ExpandableInputBase
  implements OnInit, AfterContentInit, OnDestroy
{
  private inputsManager = inject(InputsManagerService);
  private cdr = inject(ChangeDetectorRef);
  private document = inject(DOCUMENT);

  @ContentChild(ExpInputDirective, { static: true })
  protected expInputDirective: ExpInputDirective;

  @ContentChild(ExpIconOpenDirective, { static: true })
  protected iconOpenDirective: ExpIconOpenDirective;

  @ContentChild(ExpIconCloseDirective, { static: true })
  protected iconCloseDirective: ExpIconCloseDirective;

  @ContentChild(ExpIconActionDirective, { static: true })
  protected expIconActionDirective: ExpIconActionDirective;

  @ViewChild('inputElWrapper', { static: true })
  inputElWrapper: ElementRef<HTMLElement>;

  isOpen = false;

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

  ngAfterContentInit() {
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

  private sanityCheck() {
    if (!this.expInputDirective) {
      throw new ExpInputError(
        'You need to include an element with *ngsExpInput structural directive'
      );
    }

    if (!this.iconOpenDirective) {
      throw new ExpInputError(
        'You need to include an element with *ngsExpIconOpen structural directive'
      );
    }

    if (!this.iconCloseDirective) {
      throw new ExpInputError(
        'You need to include an element with *ngsExpIconClose structural directive'
      );
    }
  }
}
