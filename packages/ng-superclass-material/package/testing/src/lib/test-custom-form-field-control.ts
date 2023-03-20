import { AbstractControl } from '@angular/forms';

import {
  JestDescribeLike,
  JestExpectLike,
  JestItLike,
  testCustomFormControl,
} from '@ngspot/ng-superclass/testing';

import { CustomFormFieldControlHarness } from './custom-form-field-control.harness';

export interface CustomFormFieldControlTestContext {
  outerControl: AbstractControl;
  harness: CustomFormFieldControlHarness<any>;
}

export function testCustomFormFieldControl(
  describe: JestDescribeLike,
  it: JestItLike,
  expect: JestExpectLike,
  resolveArgsFn: () =>
    | CustomFormFieldControlTestContext
    | Promise<CustomFormFieldControlTestContext>
) {
  testCustomFormControl(describe, it, expect, resolveArgsFn);

  // TODO: identify what tests should be included here.
  // describe('Test custom mat-form-field component common behavior', () => {
  //   async function setup() {
  //     return await Promise.resolve(resolveArgsFn());
  //   }
  // });
}
