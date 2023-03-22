import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { createHostFactory } from '@ngneat/spectator';
import { tap } from 'rxjs/operators';

import { CounterComponent } from './counter.component';
import { CounterHarness } from './counter.harness';

describe(CounterComponent.name, () => {
  describe('GIVEN: with component using viewModel in the template', () => {
    const createHost = createHostFactory<CounterComponent>({
      component: CounterComponent,
      imports: [ReactiveFormsModule, FormsModule],
    });

    async function setup<T extends { [key: string]: any }>(
      template: string,
      hostProps: T
    ) {
      const spectator = createHost<T>(template, { hostProps });

      const setViewModelSpy = spyOn(
        spectator.component.viewModel,
        'setValue'
      ).and.callThrough();

      const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
      const harness = await loader.getHarness(CounterHarness);

      return { spectator, harness, setViewModelSpy };
    }

    describe('GIVEN: with reactive forms binding', () => {
      const template = `<ngs-counter [formControl]="control"></ngs-counter>`;

      it('should build', async () => {
        const { spectator } = await setup(template, {
          control: new FormControl(),
        });

        expect(spectator.component).toBeTruthy();
      });

      it('setting value from the outside should update host value', async () => {
        const control = new FormControl();
        const { harness } = await setup(template, { control });

        control.setValue(3);

        expect(await harness.value()).toBe('3');
        expect(await harness.isHostMarkedAs('touched')).toBe(false);
      });

      it('typing value in the input should propagate to the outer control', async () => {
        const control = new FormControl();
        const receivedValues: number[] = [];
        control.valueChanges
          .pipe(
            tap((val) => {
              receivedValues.push(val);
            })
          )
          .subscribe();

        const { harness } = await setup(template, { control });

        await harness.increment();

        expect(receivedValues).toEqual([1]);
        expect(control.value).toBe(1);
        expect(await harness.isHostMarkedAs('dirty')).toBe(true);
      });

      it('focusing and then un-focusing on the element should mark host as touched', async () => {
        const control = new FormControl();
        const { harness } = await setup(template, { control });
        await harness.visitButton();

        expect(await harness.isHostMarkedAs('touched')).toBe(true);
      });

      it('marking outer control as touched should sync to inner control', async () => {
        const control = new FormControl();
        const { harness } = await setup(template, { control });

        control.markAsTouched();

        expect(await harness.isHostMarkedAs('touched')).toBe(true);
      });

      it('invalid outer control should sync to inner control', async () => {
        const control = new FormControl(null, Validators.required);
        const { harness } = await setup(template, { control });

        expect(await harness.isHostMarkedAs('invalid')).toBe(true);
      });

      it('outer control has value during init', async () => {
        const control = new FormControl(4);
        const { harness } = await setup(template, { control });

        expect(await harness.value()).toBe('4');
      });

      it('should set viewModel only once - to the initial value', async () => {
        const control = new FormControl(4);
        const { setViewModelSpy } = await setup(template, { control });

        expect(setViewModelSpy).toHaveBeenCalledTimes(1);
        expect(setViewModelSpy).toHaveBeenCalledWith(4, jasmine.any(Object));
      });
    });

    describe('GIVEN: with template-driven forms', () => {
      const template = `<ngs-counter [(ngModel)]="count"></ngs-counter>`;

      it('should build', async () => {
        const { spectator } = await setup(template, { count: 0 });

        expect(spectator.component).toBeTruthy();
      });

      it('should set viewModel only once - to the initial value', async () => {
        const { setViewModelSpy } = await setup(template, { count: 5 });

        expect(setViewModelSpy).toHaveBeenCalledTimes(1);
        expect(setViewModelSpy).toHaveBeenCalledWith(5, jasmine.any(Object));
      });
    });

    describe('TEST: built-in validation', () => {
      const template = `<ngs-counter [formControl]="control"></ngs-counter>`;

      it('should be valid if external validators are not set', async () => {
        const { harness } = await setup(template, {
          control: new FormControl(),
        });

        expect(await harness.isHostMarkedAs('valid')).toBeTruthy();
      });

      it('should be invalid if external validators are set', async () => {
        const { harness } = await setup(template, {
          control: new FormControl('', Validators.required),
        });

        expect(await harness.isHostMarkedAs('invalid')).toBeTruthy();
      });

      describe('GIVEN: outer control is initialized with invalid value', () => {
        it('should be invalid if built-in validator does not pass', async () => {
          const { harness } = await setup(template, {
            control: new FormControl(2),
          });

          expect(await harness.isHostMarkedAs('invalid')).toBeTruthy();
        });

        it('setting outer control to valid value should clear up invalid state', async () => {
          const control = new FormControl(2);
          const { harness } = await setup(template, { control });

          control.setValue(3);

          expect(await harness.isHostMarkedAs('valid')).toBeTruthy();
        });

        it('changing the inner control value to a valid value should clear up invalid state', async () => {
          const control = new FormControl(2);
          const { harness } = await setup(template, { control });

          await harness.increment();

          expect(await harness.isHostMarkedAs('valid')).toBeTruthy();
        });
      });
    });
  });
});
