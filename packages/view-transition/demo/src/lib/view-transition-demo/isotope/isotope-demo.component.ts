import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { VIEW_TRANSITION_DECLARATIONS } from '@ngspot/view-transition';

import { CardComponent } from './card.component';
import { elements, initialQueryRules } from './data';
import { FilterSortFormComponent } from './filter-sort-form.component';
import { QueryRules } from './model';

@Component({
  selector: 'ngs-vt-isotope-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ...VIEW_TRANSITION_DECLARATIONS,
    FilterSortFormComponent,
    CardComponent,
  ],
  styleUrls: [
    './isotope-demo.component-base-styles.scss',
    './isotope-demo.component-animations.scss',
  ],
  templateUrl: './isotope-demo.component.html',
})
export class ViewTransitionIsotopeDemoComponent {
  query = signal<QueryRules>(initialQueryRules);

  private filter = computed(() => this.query().filter);
  private sort = computed(() => this.query().sort);

  private filteredElements = computed(() => {
    const filter = this.filter();
    if (filter === 'all') {
      return elements;
    }
    return elements.filter((el) => el.tags.includes(filter));
  });

  filteredAndSortedElements = computed(() => {
    const sort = this.sort();
    const filteredElements = this.filteredElements();

    const sortedElements = [...filteredElements].sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'number':
          return a.number.localeCompare(b.number);
        case 'symbol':
          return a.abbr.localeCompare(b.abbr);
        default:
          throw new Error(`Unknown sort: ${sort}`);
      }
    });

    return sortedElements;
  });
}
