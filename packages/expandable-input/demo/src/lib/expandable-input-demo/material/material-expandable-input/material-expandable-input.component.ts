import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ExpandableInputBase,
  EXPANDABLE_INPUT_DIRECTIVES,
} from '@ngspot/expandable-input';

import { iconCloseAnimation, iconOpenAnimation } from '../icon-animations';

@Component({
  selector: 'ngs-material-expandable-input',
  templateUrl: './material-expandable-input.component.html',
  styleUrls: ['./material-expandable-input.component.scss'],
  standalone: true,
  imports: [CommonModule, EXPANDABLE_INPUT_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialExpandableInputComponent extends ExpandableInputBase {
  override iconOpenAnimation = iconOpenAnimation;
  override iconCloseAnimation = iconCloseAnimation;
}
