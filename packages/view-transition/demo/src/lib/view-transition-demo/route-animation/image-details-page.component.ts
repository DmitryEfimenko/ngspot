import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { VIEW_TRANSITION_DECLARATIONS } from '@ngspot/view-transition';

import { imagesMetadata } from './data';

@Component({
  selector: 'ngs-vt-image-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgOptimizedImage, VIEW_TRANSITION_DECLARATIONS],
  template: `
    <img
      width="1024"
      height="768"
      class="mb-3"
      vtNameForRouting="image"
      alt="{{ image().title }}"
      [ngSrc]="image().src"
    />

    <div vtNameForRouting="image-details">
      <h2 class="text-3xl mb-3">{{ image().title }}</h2>

      <p>{{ image().description }}</p>
    </div>
  `,
})
export class ImageDetailsComponent {
  id = input.required<string>();

  image = computed(() => {
    const id = this.id();
    const img = imagesMetadata.find((image) => image.id === id);
    if (!img) {
      throw new Error(`Image with id ${id} not found`);
    }
    return img;
  });
}
