import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputModule } from '@angular/material/input';

import { createDirectiveFactory } from '@ngneat/spectator';

import {
  NGX_ERRORS_MATERIAL_DECLARATIONS,
  provideNgxErrorsConfig,
} from './ngx-errors-material.module';
import { SetMatInputErrorStateMatcherDirective } from './set-mat-input-error-state-matcher.directive';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: this.fb.control('', { validators: [Validators.required] }),
  });
}

describe(SetMatInputErrorStateMatcherDirective.name, () => {
  const createDirective = createDirectiveFactory({
    directive: SetMatInputErrorStateMatcherDirective,
    imports: [
      NGX_ERRORS_MATERIAL_DECLARATIONS,
      MatInputModule,
      MatFormFieldModule,
      ReactiveFormsModule,
    ],
    host: TestComponent,
  });

  class HarnessContext {
    constructor(private loader: HarnessLoader) {}

    async formField() {
      return await this.loader.getHarness(MatFormFieldHarness);
    }

    async formFieldControl() {
      const formField = await this.formField();
      const control = await formField.getControl();
      if (!control) {
        throw new Error('Form field control is not found');
      }
      return control;
    }

    async touchInput() {
      const control = await this.formFieldControl();
      const controlHost = await control.host();
      await controlHost.focus();
      await controlHost.blur();
    }

    async dirtyInput() {
      const control = await this.formFieldControl();
      const controlHost = await control.host();
      await controlHost.sendKeys('test');
      await controlHost.clear();
    }

    async hasMaterialErrorState() {
      const formField = await this.formField();
      const hasTextErrors = await formField.hasErrors();
      const formFieldHost = await formField.host();
      const hasInvalidClass = await formFieldHost.hasClass(
        'mat-form-field-invalid',
      );

      const result = hasTextErrors || hasInvalidClass;

      return result;
    }
  }

  interface SetupOptions {
    withTemplateShowWhenOverride?: string;
    configShowWhen?: string;
    withoutNgxErrors?: boolean;
  }

  async function setup(options: SetupOptions) {
    const templateOverride = options.withTemplateShowWhenOverride
      ? `; showWhen: '${options.withTemplateShowWhenOverride}'`
      : '';

    const ngxErrorBlock = `
      <mat-error *ngxError="'required'${templateOverride}">
        Name is required
      </mat-error>
    `;

    const template = `
      <form [formGroup]="form">
        <mat-form-field>
          <mat-label>Name</mat-label>

          <input matInput formControlName="name" />

          ${!options.withoutNgxErrors ? ngxErrorBlock : ''}
        </mat-form-field>
      </form>
    `;

    const spectator = createDirective(template, {
      providers: [
        provideNgxErrorsConfig({
          showErrorsWhenInput: options.configShowWhen ?? 'touched',
        }),
      ],
    });
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);

    const ctx = new HarnessContext(loader);

    return { spectator, ctx };
  }

  describe('GIVEN: template showWhen override and configShowWhen is "dirty"', () => {
    it('WHEN: control is touched; EXPECT: no error state', async () => {
      const { ctx } = await setup({ withTemplateShowWhenOverride: 'dirty' });

      await ctx.touchInput();

      expect(await ctx.hasMaterialErrorState()).toBe(false);
    });

    it('WHEN: control is dirtied; EXPECT: no error state', async () => {
      const { ctx } = await setup({ withTemplateShowWhenOverride: 'dirty' });

      await ctx.dirtyInput();

      expect(await ctx.hasMaterialErrorState()).toBe(true);
    });
  });

  describe('GIVEN: no template showWhen override and configShowWhen is "dirty"', () => {
    it('WHEN: control is touched; EXPECT: no error state ', async () => {
      const { ctx } = await setup({ configShowWhen: 'dirty' });

      await ctx.touchInput();

      expect(await ctx.hasMaterialErrorState()).toBe(false);
    });

    it('WHEN: control is dirtied; EXPECT: no error state ', async () => {
      const { ctx } = await setup({ configShowWhen: 'dirty' });

      await ctx.dirtyInput();

      expect(await ctx.hasMaterialErrorState()).toBe(true);
    });
  });

  describe('GIVEN: no ngxErrors directive and configShowWhen is "dirty"', () => {
    // tests provideDefaultErrorStateMatcher()
    it('WHEN: control is touched; EXPECT: no error state.', async () => {
      const { ctx } = await setup({
        configShowWhen: 'dirty',
        withoutNgxErrors: true,
      });

      await ctx.touchInput();

      expect(await ctx.hasMaterialErrorState()).toBe(false);
    });

    it('WHEN: control is dirtied; EXPECT: no error state.', async () => {
      const { ctx } = await setup({
        configShowWhen: 'dirty',
        withoutNgxErrors: true,
      });

      await ctx.dirtyInput();

      expect(await ctx.hasMaterialErrorState()).toBe(true);
    });
  });
});
