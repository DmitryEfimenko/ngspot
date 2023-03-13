import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { createHostFactory } from '@ngneat/spectator';
import { tap } from 'rxjs/operators';

import { OneInputComponent } from './one-input.component';
import { OneInputHarness } from './one-input.harness';

describe(OneInputComponent.name, () => {
  describe('GIVEN: with component using ngControl in the template directly', () => {
    const createHost = createHostFactory<OneInputComponent>({
      component: OneInputComponent,
      imports: [ReactiveFormsModule, FormsModule],
    });

    async function setup<T extends { [key: string]: any }>(
      template: string,
      hostProps: T
    ) {
      const spectator = createHost<T>(template, { hostProps });

      const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
      const harness = await loader.getHarness(OneInputHarness);

      return { spectator, harness };
    }

    describe('GIVEN: with reactive forms binding', () => {
      const template = `<ngs-one-input [formControl]="control"></ngs-one-input>`;

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
        expect(receivedValues).toEqual(['', 't', 'te', 'tes', 'test']);
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

      it('invalid outer control should sync to inner control', async () => {
        const control = new FormControl('', Validators.required);
        const { harness } = await setup(template, { control });

        expect(await harness.isMarkedAs('invalid')).toBe(true);
      });

      it('setting outer control to invalid value should sync to inner control', async () => {
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

    describe('GIVEN: with template-driven binding', () => {
      const template = `<ngs-one-input [(ngModel)]="value"></ngs-one-input>`;
      const templateRequired = `<ngs-one-input [(ngModel)]="value" required></ngs-one-input>`;

      it('should build', async () => {
        const { spectator } = await setup(template, { value: '' });

        expect(spectator.component).toBeTruthy();
      });

      it('setting value from the outside should update input value', async () => {
        const { harness, spectator } = await setup(template, { value: '' });

        spectator.setHostInput({ value: 'test' });

        expect(await harness.value()).toBe('test');
        expect(await harness.isMarkedAs('dirty')).toBe(false);
        expect(await harness.isMarkedAs('touched')).toBe(false);
      });

      it('typing value in the input should propagate to the outer control', async () => {
        const { harness, spectator } = await setup(template, { value: '' });

        await harness.setValue('test');

        // first empty string is the result of clear() call
        expect(spectator.hostComponent.value).toBe('test');
        expect(await harness.isMarkedAs('dirty')).toBe(true);
      });

      it('should mark elements as touched', async () => {
        const { harness } = await setup(template, { value: '' });
        await harness.touch();

        expect(await harness.isMarkedAs('touched')).toBe(true);
      });

      it('invalid outer control should sync to inner control', async () => {
        const { harness } = await setup(templateRequired, { value: '' });

        expect(await harness.isMarkedAs('invalid')).toBe(true);
      });

      it('setting outer control to invalid value should sync to inner control', async () => {
        const { harness, spectator } = await setup(templateRequired, {
          value: 'a',
        });
        spectator.setHostInput({ value: '' });

        expect(await harness.isMarkedAs('invalid')).toBe(true);
      });

      it('setting inner control to invalid value should sync to outer control', async () => {
        const { harness } = await setup(templateRequired, { value: 'a' });

        await harness.setValue('');

        expect(await harness.isMarkedAs('invalid')).toBe(true);
      });
    });

    describe('TEST: built-in validation', () => {
      const template = `<ngs-one-input [formControl]="control"></ngs-one-input>`;

      it('should be invalid if external validators are set', async () => {
        const { harness } = await setup(template, {
          control: new FormControl('', Validators.required),
        });

        expect(await harness.isMarkedAs('invalid')).toBeTruthy();
      });

      describe('GIVEN: outer control is initialized with invalid value', () => {
        it('should be invalid if built-in validator does not pass', async () => {
          const { harness } = await setup(template, {
            control: new FormControl('1'),
          });

          expect(await harness.isMarkedAs('invalid')).toBeTruthy();
        });

        it('setting outer control to valid value should clear up invalid state', async () => {
          const control = new FormControl('1');
          const { harness } = await setup(template, { control });

          control.setValue('12345');

          expect(await harness.isMarkedAs('valid')).toBeTruthy();
        });

        it('typing in the inner control a valid value should clear up invalid state', async () => {
          const control = new FormControl('wrong');
          const { harness } = await setup(template, { control });

          await harness.setValue('right');

          expect(await harness.isMarkedAs('valid')).toBeTruthy();
        });
      });
    });
  });
});
