import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { createHostFactory } from '@ngneat/spectator';
import { tap } from 'rxjs/operators';

import { TwoInputsTemplateDrivenComponent } from './two-inputs-template-driven.component';
import { TwoInputsHarness } from './two-inputs.harness';

describe(TwoInputsTemplateDrivenComponent.name, () => {
  describe('GIVEN: with component using template-driven bindings to bind to a viewModel', () => {
    const createHost = createHostFactory<TwoInputsTemplateDrivenComponent>({
      component: TwoInputsTemplateDrivenComponent,
      imports: [FormsModule, ReactiveFormsModule],
    });

    async function setup<T extends { [key: string]: T[typeof key] }>(
      template: string,
      hostProps: T
    ) {
      const spectator = createHost<T>(template, { hostProps });

      const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
      const harness = await loader.getHarness(TwoInputsHarness);

      return { spectator, harness };
    }

    describe('GIVEN: with reactive forms binding', () => {
      const template = `<ngs-two-inputs [formControl]="control"></ngs-two-inputs>`;

      it('should build', async () => {
        const { spectator } = await setup(template, {
          control: new FormControl(),
        });

        expect(spectator.component).toBeTruthy();
      });

      it('setting value from the outside should update input value', async () => {
        const control = new FormControl();
        const { harness } = await setup(template, { control });

        control.setValue('test');

        expect(await harness.value()).toBe('test');
        expect(await harness.isMarkedAs('dirty')).toBe(false);
        expect(await harness.isMarkedAs('touched')).toBe(false);
      });

      it('typing value in the input should propagate to the outer control', async () => {
        const control = new FormControl();
        const { harness } = await setup(template, { control });

        const receivedValues: string[] = [];
        control.valueChanges
          .pipe(
            tap((val) => {
              receivedValues.push(val);
            })
          )
          .subscribe();

        await harness.setValue('test');

        // first empty string is the result of clear() call
        // expect(receivedValues).toEqual(['', 't', 'te', 'tes', 'test']);
        expect(control.value).toBe('test');
        expect(await harness.isMarkedAs('dirty')).toBe(true);
      });

      it('should mark elements as touched', async () => {
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

      it('invalid outer control should be reflected on host', async () => {
        const control = new FormControl('', Validators.required);
        const { harness } = await setup(template, { control });

        expect(await harness.isMarkedAs('invalid')).toBe(true);
      });

      it('setting outer control to invalid value should be reflected on host', async () => {
        const control = new FormControl('a', Validators.required);
        const { harness } = await setup(template, { control });

        control.setValue('');

        expect(await harness.isMarkedAs('invalid')).toBe(true);
      });

      it('setting inner control to invalid value should sync to outer control', async () => {
        const control = new FormControl('a', Validators.required);
        const { harness } = await setup(template, { control });

        await harness.setValue('');

        expect(await harness.isMarkedAs('invalid')).toBe(true);
      });
    });
  });
});
