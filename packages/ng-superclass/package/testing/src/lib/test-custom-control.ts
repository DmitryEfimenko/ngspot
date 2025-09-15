import { AbstractControl } from '@angular/forms';

import { CustomFormControlHarness } from './custom-form-control.harness';
import { JestDescribeLike, JestExpectLike, JestItLike } from './model';

export interface CustomControlTestContext {
  outerControl: AbstractControl;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  harness: CustomFormControlHarness<any>;
}

export function testCustomFormControl(
  describe: JestDescribeLike,
  it: JestItLike,
  expect: JestExpectLike,
  resolveArgsFn: () =>
    | CustomControlTestContext
    | Promise<CustomControlTestContext>,
) {
  describe('Test custom component common behavior', () => {
    async function setup() {
      return await Promise.resolve(resolveArgsFn());
    }

    describe(`PROP: touched`, () => {
      it('initial "touched" state must be "false"', async () => {
        const { harness } = await setup();

        expect(await harness.isMarkedAs('touched')).toBe(false);
      });

      it('calling `control.markAsTouched()` should mark custom control as touched', async () => {
        const { harness, outerControl } = await setup();

        outerControl.markAsTouched();

        expect(await harness.isMarkedAs('touched')).toBe(true);
      });

      it(`touching the element should mark it as "touched"`, async () => {
        const { harness } = await setup();

        await harness.touch();

        expect(await harness.isMarkedAs('touched')).toBe(true);
      });
    });

    describe(`PROP: dirty`, () => {
      it('initial "dirty" state must be "false"', async () => {
        const { harness } = await setup();

        expect(await harness.isMarkedAs('dirty')).toBe(false);
      });

      it('calling `control.markAsDirty()` should mark custom control as dirty', async () => {
        const { harness, outerControl } = await setup();

        outerControl.markAsDirty();

        expect(await harness.isMarkedAs('dirty')).toBe(true);
      });

      it(`setting a value should mark element as "dirty"`, async () => {
        const { harness } = await setup();

        await harness.setValue('test');

        expect(await harness.isMarkedAs('dirty')).toBe(true);
      });
    });
  });
}
