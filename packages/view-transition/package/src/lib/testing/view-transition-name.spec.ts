import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { createHostFactory } from '@ngneat/spectator';

import { ViewTransitionNameForPassiveBase } from '../view-transition-name-for-passive.directive';
import { VIEW_TRANSITION_DECLARATIONS } from '../view-transition.module';
import { ViewTransitionService } from '../view-transition.service';

import {
  createTestHostComponentTemplate,
  mockStartViewTransition,
  TestHostComponent,
  TestHarnessComponent,
  TestComponentHarness,
} from './utils.test';

describe(ViewTransitionNameForPassiveBase.name, () => {
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

    async function expectVtNames(vtNames: string) {
      const actualVtName = await hostHarness.getViewTransitionName();

      expect(actualVtName).toEqual(vtNames);
    }

    return {
      spectator,
      hostHarness,
      viewTransitionService,
      flushVT,
      runVT,
      expectVtNames,
    };
  }

  describe('GIVEN: without *vt context', () => {
    it('GIVEN: only vtName directive; SHOULD apply provided view-transition-name', async () => {
      const template = `<div vtName="dima">El</div>`;

      const { expectVtNames, runVT, flushVT } = await setup(template);

      await expectVtNames('dima');

      await runVT();

      await expectVtNames('dima');

      await flushVT();

      await expectVtNames('dima');
    });

    it('GIVEN: vtName and vtNameForActive directives; SHOULD apply provided view-transition-name', async () => {
      const template = `<div vtName="dima" vtNameForActive="activeDima">El</div>`;

      const { expectVtNames, runVT, flushVT, viewTransitionService } =
        await setup(template);

      await expectVtNames('dima');

      viewTransitionService.setActiveViewTransitionNames('dima');

      await expectVtNames('activeDima');

      await runVT();

      await expectVtNames('activeDima');

      await flushVT();

      await expectVtNames('dima');
    });

    it('GIVEN: vtName, vtNameForActive, and vtActiveGroupId directives; SHOULD apply provided view-transition-name when activeGroupId is set', async () => {
      const template = `<div vtName="dima" vtNameForActive="activeDima" vtActiveGroupId="groupId">El</div>`;

      const { expectVtNames, runVT, flushVT, viewTransitionService } =
        await setup(template);

      await expectVtNames('dima');

      viewTransitionService.setActiveViewTransitionNames('groupId');

      await expectVtNames('activeDima');

      await runVT();

      await expectVtNames('activeDima');

      await flushVT();

      await expectVtNames('dima');
    });
  });

  describe('GIVEN: with *vt context', () => {
    const template = `
      <ng-container *vt="isOn(); let isOn">
        <div vtName="dima">{{ isOn }}</div>
      </ng-container>
    `;

    it('should apply "none" view-transition-name when NOT running VT', async () => {
      const { expectVtNames, spectator, flushVT } = await setup(template);

      await expectVtNames('none');

      spectator.hostComponent.isOn.set(true);

      await expectVtNames('dima');

      await flushVT();

      await expectVtNames('none');
    });

    it('should apply provided view-transition-name when vt is running and activeGroupId is set', async () => {
      const template = `
      <ng-container *vt="isOn(); let isOn">
        <div vtName="dima" vtNameForActive="activeDima" vtActiveGroupId="groupId">El</div>
      </ng-container>
      `;

      const { expectVtNames, runVT, flushVT, viewTransitionService } =
        await setup(template);

      await expectVtNames('none');

      viewTransitionService.setActiveViewTransitionNames('groupId');

      await expectVtNames('activeDima');

      await runVT();

      await expectVtNames('activeDima');

      await flushVT();

      await expectVtNames('none');
    });
  });
});
