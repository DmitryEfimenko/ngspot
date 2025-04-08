import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { createHostFactory } from '@ngneat/spectator';

import { ClassForPassiveViewTransition } from '../class-for-passive.directive';
import { VIEW_TRANSITION_DECLARATIONS } from '../view-transition.module';
import { ViewTransitionService } from '../view-transition.service';

import {
  createTestHostComponentTemplate,
  mockStartViewTransition,
  TestHostComponent,
  TestHarnessComponent,
  TestComponentHarness,
} from './utils.test';

describe(ClassForPassiveViewTransition.name, () => {
  const createHost = createHostFactory({
    component: TestHarnessComponent,
    providers: [ViewTransitionService],
    imports: [...VIEW_TRANSITION_DECLARATIONS],
    host: TestHostComponent,
  });

  async function setup(template: string) {
    const spectator = createHost(createTestHostComponentTemplate(template));

    const { flushVT, runVT, viewTransitionService } =
      mockStartViewTransition(spectator);

    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);

    const hostHarness = await loader.getHarness(TestComponentHarness);

    async function expectVtClass(klass: string) {
      const hasClass = await hostHarness.hasClass(klass);

      if (!hasClass) {
        const actualClass = await hostHarness.getClass();

        throw new Error(`Expected class "${klass}" but got "${actualClass}"`);
      }

      expect(hasClass).toBe(true);
    }

    async function expectNoVtClass(klass: string) {
      const hasNoClass = await hostHarness.hasNoClass(klass);

      if (!hasNoClass) {
        throw new Error(`Expected class "${klass}" not to be present`);
      }

      expect(hasNoClass).toBe(true);
    }

    return {
      spectator,
      hostHarness,
      viewTransitionService,
      flushVT,
      runVT,
      expectVtClass,
      expectNoVtClass,
    };
  }

  describe('GIVEN: without *vt context', () => {
    it('GIVEN: only vtClassForPassive directive; SHOULD apply provided class name', async () => {
      const template = `<div vtClassForPassive="passive-class">El</div>`;

      const { expectVtClass, runVT, flushVT } = await setup(template);

      await expectVtClass('passive-class');

      await runVT();

      await expectVtClass('passive-class');

      await flushVT();

      await expectVtClass('passive-class');
    });

    it('GIVEN: vtClassForPassive, vtClassForActive and vtName directives; SHOULD apply provided class name', async () => {
      const template = `<div vtName="dima" vtClassForPassive="passive-class" vtClassForActive="active-class">El</div>`;

      const { expectVtClass, runVT, flushVT, viewTransitionService } =
        await setup(template);

      await expectVtClass('passive-class');

      viewTransitionService.setActiveViewTransitionNames('dima');

      await expectVtClass('active-class');

      await runVT();

      await expectVtClass('active-class');

      await flushVT();

      await expectVtClass('passive-class');
    });

    it('GIVEN: vtClassForPassive, vtClassForActive and vtActiveGroupId directives; SHOULD apply provided class name', async () => {
      const template = `<div vtActiveGroupId="dima" vtClassForPassive="passive-class" vtClassForActive="active-class">El</div>`;

      const { expectVtClass, runVT, flushVT, viewTransitionService } =
        await setup(template);

      await expectVtClass('passive-class');

      viewTransitionService.setActiveViewTransitionNames('dima');

      await expectVtClass('active-class');

      await runVT();

      await expectVtClass('active-class');

      await flushVT();

      await expectVtClass('passive-class');
    });
  });

  describe('GIVEN: with *vt context', () => {
    const template = `
      <ng-container *vt="isOn(); let isOn">
        <div vtClassForPassive="passive-class">{{ isOn }}</div>
      </ng-container>
    `;

    it('should apply no class names when NOT running VT', async () => {
      const { expectVtClass, expectNoVtClass, spectator, flushVT } =
        await setup(template);

      await expectNoVtClass('passive-class');

      spectator.hostComponent.isOn.set(true);

      await expectVtClass('passive-class');

      await flushVT();

      await expectNoVtClass('passive-class');
    });

    it('should apply provided class name when vt is running and activeGroupId is set', async () => {
      const template = `
      <ng-container *vt="isOn(); let isOn">
        <div vtClassForPassive="passive-class" vtClassForActive="active-class" vtActiveGroupId="groupId">El</div>
      </ng-container>
      `;

      const {
        expectVtClass,
        expectNoVtClass,
        spectator,
        flushVT,
        viewTransitionService,
      } = await setup(template);

      await expectNoVtClass('passive-class');
      await expectNoVtClass('active-class');

      viewTransitionService.setActiveViewTransitionNames('groupId');

      await expectVtClass('active-class');
      await expectNoVtClass('passive-class');

      spectator.hostComponent.isOn.set(true);

      await expectNoVtClass('passive-class');
      await expectVtClass('active-class');

      await flushVT();

      await expectNoVtClass('passive-class');
      await expectNoVtClass('active-class');
    });
  });
});
