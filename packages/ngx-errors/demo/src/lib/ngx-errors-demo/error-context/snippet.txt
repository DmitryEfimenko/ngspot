import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NGX_ERRORS_DECLARATIONS } from '@ngspot/ngx-errors';

@Component({
  selector: 'ngs-error-context-result',
  standalone: true,
  imports: [FormsModule, NGX_ERRORS_DECLARATIONS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .error {
        color: red;
      }
    `,
  ],
  template: `
    <form>
      <label>Name</label>

      <div>
        <input
          #el="ngModel"
          matInput
          minlength="3"
          name="name"
          [(ngModel)]="name"
        />
      </div>

      <ng-container [ngxErrors]="el.control">
        <div *ngxError="'minlength'; let err; showWhen: 'dirty'" class="error">
          Name should be at least {{ err.requiredLength }} characters long.
          You've typed {{ err.actualLength }} characters.
        </div>
      </ng-container>
    </form>
  `,
})
export class ErrorContextResultComponent {
  name = '';
}
