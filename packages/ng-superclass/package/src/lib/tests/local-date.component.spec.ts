import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { createHostFactory } from '@ngneat/spectator';

import { LocalDateComponent } from './local-date.component';
import { LocalDateHarness } from './local-date.harness';

const prohibitedDate = new Date('09/16/2022');

describe(LocalDateComponent.name, () => {
  describe('GIVEN: with component implementing outer-to-inner value transforms', () => {
    const createHost = createHostFactory<LocalDateComponent>({
      component: LocalDateComponent,
      imports: [ReactiveFormsModule],
    });

    async function setup<T extends { [key: string]: any }>(
      template: string,
      hostProps: T
    ) {
      const spectator = createHost<T>(template, { hostProps });

      const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
      const harness = await loader.getHarness(LocalDateHarness);

      return { spectator, harness };
    }

    const dateString = '09/15/2022';
    const dateDate = new Date(dateString + 'Z');
    const dateTimeLocal = dateDate.toISOString().substr(0, 16);

    describe('GIVEN: with reactive forms binding', () => {
      const template = `<ngs-local-date [formControl]="control"></ngs-local-date>`;

      it('should build', async () => {
        const { spectator } = await setup(template, {
          control: new FormControl(),
        });

        expect(spectator.component).toBeTruthy();
      });

      it('setting value from the outside should update host value', async () => {
        const control = new FormControl();
        const { harness } = await setup(template, { control });

        control.setValue(dateDate);

        expect(await harness.value()).toBe(dateTimeLocal);
        expect(await harness.isMarkedAs('touched')).toBe(false);
      });

      it('selecting value in the input should propagate to the outer control', async () => {
        const control = new FormControl();
        const { harness, spectator } = await setup(template, { control });

        spectator.component.viewModel.setValue(dateTimeLocal);

        expect(control.value).toEqual(dateDate);
        expect(await harness.isMarkedAs('dirty')).toBe(true);
      });

      it('focusing and then un-focusing on the element should mark host as touched', async () => {
        const control = new FormControl();
        const { harness } = await setup(template, { control });
        await harness.touch();

        expect(await harness.isMarkedAs('touched')).toBe(true);
      });

      it('marking outer control as touched should sync to inner control', async () => {
        const control = new FormControl();
        const { harness } = await setup(template, { control });

        control.markAsTouched();

        expect(await harness.isMarkedAs('touched')).toBe(true);
      });

      it('invalid outer control should sync to inner control', async () => {
        const control = new FormControl('', Validators.required);
        const { harness } = await setup(template, { control });

        expect(await harness.isMarkedAs('invalid')).toBe(true);
      });
    });

    describe('TEST: built-in validation', () => {
      const template = `<ngs-local-date [formControl]="control"></ngs-local-date>`;

      it('should be valid if external validators are not set', async () => {
        const { harness } = await setup(template, {
          control: new FormControl(),
        });

        expect(await harness.isMarkedAs('valid')).toBeTruthy();
      });

      it('should be invalid if external validators are set', async () => {
        const { harness } = await setup(template, {
          control: new FormControl('', Validators.required),
        });

        expect(await harness.isMarkedAs('invalid')).toBeTruthy();
      });

      describe('GIVEN: outer control is initialized with invalid value', () => {
        it('should be invalid if built-in validator does not pass', async () => {
          const { harness } = await setup(template, {
            control: new FormControl(prohibitedDate),
          });

          expect(await harness.isMarkedAs('invalid')).toBeTruthy();
        });

        it('setting outer control to valid value should clear up invalid state', async () => {
          const control = new FormControl(prohibitedDate);
          const { harness } = await setup(template, { control });

          control.setValue(dateDate);

          expect(await harness.isMarkedAs('valid')).toBeTruthy();
        });

        it('changing the inner control value to a valid value should clear up invalid state', async () => {
          const control = new FormControl(prohibitedDate);
          const { harness, spectator } = await setup(template, { control });

          spectator.component.viewModel.setValue(dateTimeLocal);

          expect(await harness.isMarkedAs('valid')).toBeTruthy();
        });
      });
    });
  });
});
