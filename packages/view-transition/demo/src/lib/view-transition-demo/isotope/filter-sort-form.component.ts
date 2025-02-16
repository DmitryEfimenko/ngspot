import { afterNextRender, Component, output, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { injectDestroySink } from '@ngspot/common/inject-destroy-sink';
import { tap } from 'rxjs';

import { initialQueryRules } from './data';
import { QueryRules } from './model';

@Component({
  selector: 'ngs-filter-sort-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter-sort-form.component.html',
  styleUrl: './filter-sort-form.component.scss',
})
export class FilterSortFormComponent {
  private form = viewChild.required(NgForm);
  private sink = injectDestroySink();

  vm: QueryRules = initialQueryRules;

  queryChanged = output<QueryRules>();

  #watchFormValueChanges = afterNextRender(() => {
    const form = this.form();
    if (!form.valueChanges) {
      throw new Error('Impossible case');
    }
    const $ = form.valueChanges.pipe(tap((val) => this.queryChanged.emit(val)));
    this.sink.subscribeTo($);
  });
}
