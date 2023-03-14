import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { createHostFactory } from '@ngneat/spectator';
import { tap } from 'rxjs/operators';

import { FullNameReactiveComponent } from './full-name-form-group.component';
import { FullNameHarness } from './full-name.harness';

describe(FullNameReactiveComponent.name, () => {
  describe('GIVEN: with component using FormGroup as a viewModel', () => {
    const createHost = createHostFactory<FullNameReactiveComponent>({
      component: FullNameReactiveComponent,
      imports: [ReactiveFormsModule],
    });

    async function setup<T extends { [key: string]: any }>(hostProps: T) {
      const template = `<ngs-full-name [formControl]="control"></ngs-full-name>`;
      const spectator = createHost<T>(template, { hostProps });

      const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
      const harness = await loader.getHarness(FullNameHarness);

      return { spectator, harness };
    }

    describe('GIVEN: with reactive forms binding', () => {
      it('should build', async () => {
        const control = new FormControl();
        const { spectator } = await setup({ control });

        expect(spectator.component).toBeTruthy();
      });

      it('setting value from the outside should update input value', async () => {
        const control = new FormControl();
        const { harness } = await setup({ control });

        control.setValue('test');

        expect(await harness.value()).toBe('test');
        expect(await harness.isMarkedAs('dirty')).toBe(false);
        expect(await harness.isMarkedAs('touched')).toBe(false);
      });

      it('typing value in the input should propagate to the outer control', async () => {
        const control = new FormControl();
        const { harness } = await setup({ control });

        const receivedValues: string[] = [];
        control.valueChanges
          .pipe(
            tap((val) => {
              receivedValues.push(val);
            })
          )
          .subscribe();

        await harness.setValue('john doe');

        // first empty string is the result of clear() call
        expect(receivedValues).toEqual([
          '',
          'j',
          'jo',
          'joh',
          'john',
          'john d',
          'john do',
          'john doe',
        ]);
        expect(control.value).toBe('john doe');
        expect(await harness.isMarkedAs('dirty')).toBe(true);
      });

      it('should mark elements as touched', async () => {
        const control = new FormControl();
        const { harness } = await setup({ control });
        await harness.touch();

        expect(await harness.isMarkedAs('touched')).toBe(true);
      });

      it('marking outer control as touched should sync to inner control', async () => {
        const control = new FormControl();
        const { harness } = await setup({ control });

        control.markAsTouched();

        expect(await harness.isMarkedAs('touched')).toBe(true);
      });

      it('invalid outer control should be reflected on host', async () => {
        const control = new FormControl('', Validators.required);
        const { harness } = await setup({ control });

        expect(await harness.isMarkedAs('invalid')).toBe(true);
      });

      it('setting outer control to invalid value should be reflected on host', async () => {
        const control = new FormControl('a', Validators.required);
        const { harness } = await setup({ control });

        control.setValue('');

        expect(await harness.isMarkedAs('invalid')).toBe(true);
      });

      it('setting inner control to invalid value should be reflected on host', async () => {
        const control = new FormControl('a', Validators.required);
        const { harness } = await setup({ control });

        await harness.setValue('invalidName');

        expect(control.value).toBe('invalidName');
        expect(await harness.isMarkedAs('invalid')).toBe(true);
      });
    });
  });
});
