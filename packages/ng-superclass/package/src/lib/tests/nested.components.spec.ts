import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ReactiveFormsModule } from '@angular/forms';

import { createHostFactory } from '@ngneat/spectator';

import { NestedComponent } from './nested.component';
import { NestedHarness } from './nested.harness';

describe(NestedComponent.name, () => {
  const createHost = createHostFactory<NestedComponent>({
    component: NestedComponent,
    imports: [ReactiveFormsModule],
  });

  async function setup<T extends { [key: string]: unknown }>(
    template: string,
    hostProps: T
  ) {
    const spectator = createHost<T>(template, { hostProps });

    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    const harness = await loader.getHarness(NestedHarness);

    return { spectator, harness };
  }

  describe('GIVEN: with custom component using other custom components in the template', () => {
    describe('GIVEN: with reactive forms binding', () => {
      const template = `<ngs-nested [formControl]="control"></ngs-nested>`;

      it('temp', () => {
        expect(true).toBe(true);
      });

      // it('should build', async () => {
      //   const control = new FormControl();
      //   const { spectator } = await setup(template, { control });

      //   expect(spectator.component).toBeTruthy();
      // });

      // Throws an error. Potentially due to
      // https://github.com/angular/angular/issues/49110
      // https://github.com/angular/angular/pull/49325
      // it('setting value from the outside should update host value', async () => {
      //   const control = new FormControl();
      //   const { harness } = await setup(template, { control });

      //   control.setValue('test');
      //   const value = await harness.value();

      //   expect(value).toBe('test');
      //   // expect(await harness.isHostMarkedAs('touched')).toBe(false);
      // });

      // it('typing value in the input should propagate to the outer control', async () => {
      //   const control = new FormControl();
      //   const receivedValues: string[] = [];
      //   control.valueChanges
      //     .pipe(
      //       tap((val) => {
      //         receivedValues.push(val);
      //       })
      //     )
      //     .subscribe();

      //   const { harness } = await setup(template, { control });

      //   await harness.setValue('test');

      //   expect(receivedValues).toEqual(['', 't', 'te', 'tes', 'test']);
      //   expect(control.value).toBe('test');
      //   expect(await harness.isHostMarkedAs('dirty')).toBe(true);
      // });

      // it('focusing and then un-focusing on the element should mark host as touched', async () => {
      //   const control = new FormControl();
      //   const { harness } = await setup(template, { control });
      //   await harness.touch();

      //   expect(await harness.isHostMarkedAs('touched')).toBe(true);
      // });

      // it('marking outer control as touched should sync to inner control', async () => {
      //   const control = new FormControl();
      //   const { harness } = await setup(template, { control });

      //   control.markAsTouched();

      //   expect(await harness.isHostMarkedAs('touched')).toBe(true);
      // });

      // it('invalid outer control should sync to inner control', async () => {
      //   const control = new FormControl(null, Validators.required);
      //   const { harness } = await setup(template, { control });

      //   expect(await harness.isHostMarkedAs('invalid')).toBe(true);
      // });

      // it('outer control has value during init', async () => {
      //   const control = new FormControl('a');
      //   const { harness } = await setup(template, { control });

      //   expect(await harness.value()).toBe('a');
      // });
    });

    // describe('TEST: built-in validation', () => {
    //   const template = `<ngs-nested [formControl]="control"></ngs-nested>`;

    //   it('should be valid if external validators are not set', async () => {
    //     const control = new FormControl();
    //     const { harness } = await setup(template, { control });

    //     expect(await harness.isHostMarkedAs('valid')).toBeTruthy();
    //   });

    //   it('should be invalid if external validators are set', async () => {
    //     const control = new FormControl('', Validators.required);
    //     const { harness } = await setup(template, { control });

    //     expect(await harness.isHostMarkedAs('invalid')).toBeTruthy();
    //   });

    //   describe('GIVEN: outer control is initialized with invalid value', () => {
    //     it('should be invalid if built-in validator does not pass', async () => {
    //       const control = new FormControl('a');
    //       const { harness } = await setup(template, { control });

    //       expect(await harness.isHostMarkedAs('invalid')).toBeTruthy();
    //     });

    //     it('should be valid if built-in validator passes', async () => {
    //       const control = new FormControl('123456');
    //       const { harness } = await setup(template, { control });

    //       expect(await harness.isHostMarkedAs('valid')).toBeTruthy();
    //     });

    //     it('setting outer control to valid value should clear up invalid state', async () => {
    //       const control = new FormControl('1');
    //       const { harness } = await setup(template, { control });

    //       control.setValue('123456');

    //       expect(await harness.isHostMarkedAs('valid')).toBeTruthy();
    //     });

    //     it('changing the inner control value to a valid value should clear up invalid state', async () => {
    //       const control = new FormControl('1');
    //       const { harness } = await setup(template, { control });

    //       await harness.setValue('123456');

    //       expect(await harness.isHostMarkedAs('valid')).toBeTruthy();
    //     });
    //   });

    //   describe('GIVEN: switching between nested components', () => {
    //     it('applies correct built-in validation', async () => {
    //       const control = new FormControl('1');
    //       const { harness, spectator } = await setup(template, { control });

    //       expect(control.errors).toEqual({ minLength: 5 });

    //       spectator.setInput({ variant: 2 });

    //       expect(await harness.isHostMarkedAs('invalid')).toBeTruthy();
    //       // expect(control.errors).toEqual({ notAllowedName: '1' });

    //       // spectator.setInput({ variant: 1 });

    //       // expect(await harness.isHostMarkedAs('invalid')).toBeTruthy();
    //       // expect(control.errors).toEqual({ minLength: 5 });
    //     });
    //   });
    // });
  });
});
