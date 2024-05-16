import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NGX_ERRORS_DECLARATIONS } from '@ngspot/ngx-errors';

import { StrongPasswordDirective } from '../strong-password-validator/strong-password.directive';

@Component({
  selector: 'ngs-password-demo-result',
  standalone: true,
  imports: [FormsModule, NGX_ERRORS_DECLARATIONS, StrongPasswordDirective],
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
      <label for="password">Password</label>

      <div>
        <input
          #el="ngModel"
          id="password"
          name="password"
          ngsStrongPassword
          [(ngModel)]="password"
        />
      </div>

      <ng-container [ngxErrors]="el.control">
        <div *ngxError="'required'" class="error">Password is required</div>
        <div *ngxError="'minChar'" class="error">
          Password should be between 8 and 30 characters long
        </div>
        <div *ngxError="'lowerCase'" class="error">
          Password should contain at least one lowercase character
        </div>
        <div *ngxError="'upperCase'" class="error">
          Password should contain at least one uppercase character
        </div>
        <div *ngxError="'digit'" class="error">
          Password should contain at least one digit
        </div>
        <div *ngxError="'specialChar'" class="error">
          Password should contain at least one special character
        </div>
      </ng-container>
    </form>
  `,
})
export class PasswordDemoResultComponent {
  password = '';
}
