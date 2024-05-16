import { Directive, OnInit, effect, inject, signal } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput } from '@angular/material/input';

import { AllErrorsStateService } from '@ngspot/ngx-errors';

import { errorStateMatcherProvider } from './error-state-matcher.provider';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: `input[matInput], textarea[matInput], select[matNativeControl],
      input[matNativeControl], textarea[matNativeControl]`,
  standalone: true,
  providers: [errorStateMatcherProvider],
})
export class SetMatInputErrorStateMatcherDirective implements OnInit {
  private matInput = inject(MatInput, { self: true });

  private allErrorsState = inject(AllErrorsStateService);

  private defaultErrorStateMatcher = inject(ErrorStateMatcher);

  private ngOnInitRun = signal(false);

  private hasErrors = false;

  private errorStateMatcher: ErrorStateMatcher = {
    isErrorState: () => {
      return this.hasErrors;
    },
  };

  private updateErrorStateEffect = effect(() => {
    const ngOnInitRun = this.ngOnInitRun();
    if (!ngOnInitRun) {
      return;
    }

    if (!this.matInput.ngControl) {
      return;
    }

    const { control } = this.matInput.ngControl;

    if (!control) {
      throw new Error('Could not find control for matInput');
    }

    const allErrorsState = this.allErrorsState.getControlState(control);

    if (!allErrorsState) {
      return;
    }

    const errors = allErrorsState.errors();

    const hasKeys = Object.keys(errors).length > 0;

    if (hasKeys) {
      this.matInput.errorStateMatcher = this.errorStateMatcher;
      this.hasErrors = Object.values(errors).some(
        (couldBeShown) => couldBeShown,
      );
    } else {
      this.matInput.errorStateMatcher = this.defaultErrorStateMatcher;
    }

    this.matInput.updateErrorState();
  });

  ngOnInit() {
    this.ngOnInitRun.set(true);
  }
}
