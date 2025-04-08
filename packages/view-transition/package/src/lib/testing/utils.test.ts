import { ComponentHarness } from '@angular/cdk/testing';
import { DOCUMENT } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

import { SpectatorHost } from '@ngneat/spectator';

import { Callback } from '../model';
import { ViewTransitionService } from '../view-transition.service';

import { ClassForPassiveHarness } from './class-for-passive.harness';
import { ViewTransitionNameForPassiveShorthandHarness } from './view-transition-name-for-passive.harness';

@Component({
  selector: 'vt-test-host',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestHostComponent {
  isOn = signal(false);
}

@Component({
  selector: 'vt-test-harness',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestHarnessComponent {}

export class TestComponentHarness extends ComponentHarness {
  static hostSelector = 'vt-test-harness';

  firstVtName = this.locatorFor(ViewTransitionNameForPassiveShorthandHarness);
  firstVtClass = this.locatorFor(ClassForPassiveHarness);

  async getViewTransitionName() {
    const vtName = await this.firstVtName();
    return await vtName.getViewTransitionName();
  }

  async hasClass(klass: string) {
    const vtClass = await this.firstVtClass();
    return await vtClass.hasClass(klass);
  }

  async hasNoClass(klass: string) {
    const vtClass = await this.firstVtClass();
    const actualKlass = await vtClass.getClass();
    if (!actualKlass) {
      return true;
    }
    return actualKlass.includes(klass) === false;
  }

  async getClass() {
    const vtClass = await this.firstVtClass();
    return await vtClass.getClass();
  }
}

export function createTestHostComponentTemplate(template: string) {
  return `<vt-test-harness>${template}</vt-test-harness>`;
}

export function mockStartViewTransition(
  spectator: SpectatorHost<TestHarnessComponent, TestHostComponent>,
) {
  const document = spectator.inject(DOCUMENT) as Document;
  const viewTransitionService = spectator.inject(
    ViewTransitionService,
  ) as ViewTransitionService;

  let flushViewTransitionResolve = () => {
    console.log('No Vt in progress');
  };

  const fakeStartViewTransition: Document['startViewTransition'] = (
    callback: Callback<void>,
  ) => {
    Promise.resolve().then(() => {
      callback();
    });
    return {
      finished: new Promise<void>((resolve) => {
        flushViewTransitionResolve = resolve;
      }),
    } as ViewTransition;
  };

  spyOn(document, 'startViewTransition').and.callFake(fakeStartViewTransition);

  async function runVT() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    viewTransitionService.run(() => {});
    // spectator.fixture.detectChanges();
    // await spectator.fixture.whenStable();
    // return await Promise.resolve();
  }

  async function flushVT() {
    flushViewTransitionResolve();
    // await spectator.fixture.whenStable();
    // return await Promise.resolve();
  }

  return { flushVT, runVT, viewTransitionService };
}
