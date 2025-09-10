import {
  Directive,
  Signal,
  computed,
  effect,
  inject,
  input
} from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';

import { AllErrorsStateService } from './all-errors-state.service';
import { ShowErrorWhen } from './errors-configuration';
import { NgxErrorsFormDirective } from './form.directive';

@Directive()
export abstract class NgxErrorsBase {
  private errorsState = inject(AllErrorsStateService);

  private formDirective = inject(NgxErrorsFormDirective, {
    optional: true,
    skipSelf: true,
  });

  parentControlContainer = inject(ControlContainer, {
    optional: true,
    host: true,
    skipSelf: true,
  });

  showWhen = input<ShowErrorWhen>();

  abstract resolvedControl: Signal<AbstractControl<any, any> | undefined>;

  controlState = computed(() => {
    const control = this.resolvedControl();
    if (!control) {
      return undefined;
    }

    const controlState = this.errorsState.getControlState(control);

    return controlState;
  });

  private registerResolvedControl = (() => {
    const register = () => {
      const control = this.resolvedControl();
      if (!control) {
        return;
      }
      const form = this.formDirective?.form ?? null;
      this.errorsState.registerControl(control, form);
    };

    return effect(register);
  })();
}
