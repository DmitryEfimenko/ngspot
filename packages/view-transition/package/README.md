# view-transition

> Easy animations in Angular using view-transition

<p align="center">
 <img width="20%" height="20%" src="https://github.com/DmitryEfimenko/ngspot/blob/main/packages/view-transition/package/assets/logo.png?raw=true">
</p>

<br />

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Table of Contents

- [Demo](#demo)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configure](#configure)
- [In-page animations](#in-page-animations)
- [Route navigation animations](#route-navigation-animations)
- [Styling](#styling)

## Demo:

https://dmitryefimenko.github.io/ngspot/view-transition

## Prerequisites

You should be familiar with the [View Transition API](https://developer.chrome.com/docs/web-platform/view-transitions?hl=en)

## Installation

### NPM

`npm install @ngspot/view-transition`

### Yarn

`yarn add @ngspot/view-transition`

## Configure

```ts
import { onViewTransitionCreated } from '@ngspot/view-transition';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withViewTransitions({ onViewTransitionCreated }), // <-- Add this
    ),
    // other providers
  ],
};
```

## In-page animations

All directives in the library has `vt` (view-transition) prefix.

### Simple use-case

View Transition API animates changes made to the DOM. However, when using Angular, all DOM changes are performed by the framework behind the scenes as a response to the change in the state.

To accommodate this, the library provides a structural directive (`*vt`) that watches for the changes in the state and starts an animation on the elements containing `view-transition-name` CSS style when a change in state is detected.

```ts
@Component({
  selector: 'ngs-vt-basic-demo',
  imports: [...VIEW_TRANSITION_DIRECTIVES],
  styleUrl: './basic-demo.component.scss',
  templateUrl: './basic-demo.component.html',
})
export class MyComponent {
  positionSignal = signal<'left' | 'right'>('left');

  toggleShape() {
    this.position.set(this.position() === 'left' ? 'right' : 'left');
  }
}
```

```html
<ng-container *vt="positionSignal(); let positionValue">
  <div
    style="view-transition-name: position-animation"
    class="{{ positionValue }}"
  >
    {{ positionValue }}
  </div>
</ng-container>
```

### `vtName` directive

To simplify assignment of the `view-transition-name` CSS style, the library provides `vtName` directive.

```html
<ng-container *vt="positionSignal(); let positionValue">
  <div
    vtName="position-animation"
    class="{{ positionValue }}"
  >
    {{ positionValue }}
  </div>
</ng-container>
```

Besides shorter syntax, using `vtName` directive provides a few additional benefits:

1. If the `vtName` directive is a child of the `*vt` directive, it only applies the `view-transition-name` CSS style when change is detected and animation is about to run. After the animation is complete, the style is removed. This assures that different animations on the page do not collide with each other.
2. It respects the `vtNameForActive` directive. More on it below.
3. It sets `view-transition-name` to `none` during the route navigation. For more information on this, see [Route navigation animations](#route-navigation-animations).


### Triggering View Transition Programmatically

Library provides `ViewTransitionService`, which has `run()` method.
Under the hood this method is called by `*vt` directive to schedule an animation.

In case you're not using the `*vt` directive, to trigger animation manually, you can call this method for a change in state that you know will result in change in DOM:

```ts
class MyComponent {
  private viewTransitionService = inject(ViewTransitionService);

  isReady = signal(false);

  setReady() {
    this.viewTransitionService.run(() => {
      this.isReady.set(true);
    });
  }
}
```

```html
@if (!isReady()) {
  <div vtName="some-animation" class="not-ready">I'm not ready!</div>
} @else {
  <div vtName="some-animation" class="ready">I'm ready!</div>
}
```

### Targeting specific elements in a for loop

A lot of the times there is a need to give an element a distinct `view-transition-name`. This scenario is common for when dealing with an array of elements that already have a `view-transition-name` assigned, but an action on one of these elements is to be performed, which would require a change in `view-transition-name` for that element only.

To handle this scenario the `ViewTransitionService` provides a method: `setTransitionActiveElementId(id: string | number)`. This goes together with `vtNameForActive` directive.

```ts
class MyComponent {
  items = signal<Item[]>([
    { id: 1, name: 'item 1', ready: false },
    { id: 2, name: 'item 2', ready: false },
    { id: 3, name: 'item 3', ready: false }
  ]);

  private viewTransitionService = inject(ViewTransitionService);

  isReady = signal(false);

  setReady() {
    this.viewTransitionService.setTransitionActiveElementId(2);
    this.items.update((items) => {
      return items.map((item) => {
        if (item.id === 2) {
          return { ...item, ready: true }
        }
        return item;
      });
    })
  }
}
```

```html
<ng-container *vt="items(); let itemsVal">
  @for (let item of itemsVal; trackBy: item.id) {
    <div
      [vtNameForPassive]="`passive-item-` + item.id"
      [vtNameForActive]="'active-item-animation'"
      [vtId]="item.id"
    >
      {{ item.name }}
    </div>
  }
</ng-container>
```
With the code above, once `setReady` method is called, the following sequence of events will happen:
- the item with id `2` will be marked as active. This will switch the `view-transition-name` for corresponding rendered element from `passive-item-2` to `active-item-animation`.
- a change in `items` signal will trigger `*vt` directive to start a new view transition.
- after the animation is complete, the active item is disabled back to the passive mode.

Note, the `vtNameForPassive` directive is the same thing as `vtName` directive. It's only encouraged to use it for readability purposes when `vtNameForActive` directive is used.


### Targeting many elements in the loop

View Transition API supports targeting multiple elements via `view-transition-class` CSS style. [See docs](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#view-transition-class).

However, in order to avoid unnecessary view transition runs, there should be a maintainable way to assign a CSS class to an element right before the animation begins and remove it it when the animation is done. This library provides such functionality via `vtClass` directive:

```html
<ng-container *vt="items(); let itemsVal">
  @for (let item of itemsVal; trackBy: item.id) {
    <div vtClass="my-item">
      {{ item.name }}
    </div>
  }
</ng-container>
```
```scss
.my-item {
  view-transition-class: my-item;
}

// other styles targeting `my-item`
```


## Route navigation animations

This library treats route navigation animations separately from the in-page animations. To achieve this, the `vtName` directive sets `view-transition-name` CSS style on the element to `none` when route navigation is in progress.

To enable animation on elements during route navigation, use `vtNameForRouting` and `vtNameForRouterLink` directives.

### `vtNameForRouting` directive

Directive sets `view-transition-name` only when router navigation is in progress.

```html
<main [vtNameForRouting]="main-content">
  <router-outlet></router-outlet>
</main>
```

### `vtNameForRouterLink` directive

Similar to `vtNameForRouting` directive, `vtNameForRouterLink` directive only has a potential of setting `view-transition-name` when router navigation is in progress.

However, in addition to that, the directive is designed to be applied to an element that also has `routerLink` directive or to an element that is a child of an element with `routerLink` directive.

The directive will apply the `view-transition-name` CSS style only if the destination URL matches the URL produced by the `routerLink` directive.

```html
<!-- Page rendering a list of images -->
@for (let img of images; trackBy: item.id) {
  <a [routerLink]="img.id">
    <img
      width="200"
      height="150"
      vtNameForRouterLink="image"
      alt="{{ img.title }}"
      [src]="img.src"
    />
  </a>
}
```
```html
<!-- Page rendering selected image details -->
<img
  width="1024"
  height="768"
  vtNameForRouting="image"
  alt="{{ image().title }}"
  [src]="image().src"
/>
```
See [Route animation demo](https://dmitryefimenko.github.io/ngspot/view-transition/route-animation) for full example.

## Styling

As of today, all styles related to styling view transitions must be global.

Please consider adding the following styles to your global style sheet:
```scss
:root {
  /* Optimization */
  view-transition-name: none;
}

@media (prefers-reduced-motion: no-preference) {
  /* Force flat mode, should the browser use layered by default */
  * {
    view-transition-capture-mode: flat;
  }

  /* Prevent mouse clicks during animations */
  html::view-transition {
    pointer-events: none;
  }
}
```

Styles for animations specific to a particular component should also be global. Use `::ng-deep` to achieve this:

```scss
::ng-deep {
  ::view-transition-old(.card):only-child {
    animation: scale-out .25s ease-out forwards;
  }
}
```

There are times when you need to add global styles, but with component-specific context. To achieve this, the library provides a `vt-style` component. Example of usage:

```ts
import { VIEW_TRANSITION_DIRECTIVES } from '@ngspot/view-transition';

@Component({
  selector: 'ngs-card',
  imports: [...VIEW_TRANSITION_DIRECTIVES],
  template: `
    <!-- Other component contents -->

    <vt-style [vtStyle]="vtStyle()" />
  `,
})
export class CardComponent {
  element = input.required<IsotopeEl>();

  vtStyle = computed(() => {
    const ix = this.element().index;
    const delay = ix * 20;
    const vtName = `card-${ix}`;

    return `
      ::view-transition-group(${vtName}) {
        animation-delay: ${delay}ms;
      }
    `;
  });
}
```

See [Isotope animation demo](https://dmitryefimenko.github.io/ngspot/view-transition/isotope) for full example.
