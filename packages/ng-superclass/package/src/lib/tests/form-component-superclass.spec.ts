import { Component, OnInit } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { createHostFactory } from '@ngneat/spectator';
import { tap, withLatestFrom } from 'rxjs';

import { FormComponentSuperclass } from '../form-component-superclass';

describe(FormComponentSuperclass.name, () => {
  describe('PROP: latestValue$', () => {
    @Component({
      selector: 'ngs-test',
      standalone: true,
      imports: [ReactiveFormsModule],
      template: `
        <input [formControl]="ngControl.control" />
        <button (click)="someAction()">Click</button>
      `,
    })
    class CustomComponent
      extends FormComponentSuperclass<string>
      implements OnInit
    {
      someAction = this.createEffect<void>((click$) =>
        click$.pipe(
          withLatestFrom(this.latestValue$),
          tap(([_, latestVal]) => {
            console.log(latestVal);
          }),
        ),
      );

      ngOnInit() {
        setTimeout(() => {
          this.ngControl.control.setValue('val');
        }, 2000);
      }
    }

    const createHost = createHostFactory<CustomComponent>({
      component: CustomComponent,
      imports: [ReactiveFormsModule, FormsModule],
    });

    function setup() {
      const template = `<ngs-test [(ngModel)]="fname" name="name"></ngs-test>`;
      const spectator = createHost(template, {
        hostProps: { control: new FormControl(), fname: '' },
      });

      return { spectator };
    }

    it('should emit latest value when consuming component does not have a vm defined and value is set from inside', fakeAsync(() => {
      const { spectator } = setup();

      let actual: string | null | undefined;

      spectator.component.latestValue$.subscribe((val) => {
        actual = val;
      });

      expect(actual).toBe(null);
      spectator.click('button');

      spectator.tick(2000);

      expect(actual).toBe('val');
    }));
  });
});
