# Expandable Input

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> A component consisting of a trigger element (button/icon/anything else...) and an input which shows by sliding to the left when the button is clicked.
> Both, the trigger element and the input need to be supplied allowing a lot of flexibility.

## Demo:

https://dmitryefimenko.github.io/ngspot/expandable-input

## Features

- ✅ Library does not assume any CSS
- ✅ Simple set of CSS variables that allow customizing the component for your needs
- ✅ Configurable animation properties
- ✅ Animation utilities built to work together with expandable input

## Installation

```sh
npm install @ngspot/expandable-input
```

Library provides a set of _standalone_ declarations. Add them to your _standalone_ component or to your application module:

```ts
@Component({
  selector: 'my-component',
  standalone: true,
  imports: [EXPANDABLE_INPUT_DIRECTIVES]
})
```

## Configuration

### ngs-expandable-input

Component provides the following Inputs and Outputs:

```ts
/**
 * If multiple components use the same value for "group" input, only one
 * component with that group value can be expanded at a time
 */
@Input() group: string | undefined;

/**
 * When true, input looses focus if Esc is pressed
 */
@Input() blurInputOnEsc = true;

/**
 * When set to KeyboardEvent.key, input will expand when that key is pressed
 */
@Input() openOnKey: string | undefined;

/**
 * How long it takes for input to expand
 */
@Input() animationDuration = '300ms';

/**
 * The easing function for input expansion animation
 */
@Input() animationEasing = 'cubic-bezier(.4, 0, .2, 1)';

/**
 * A set of enter and leave AnimationMetadata applied to icon "open".
 * See example of usage: https://dmitryefimenko.github.io/ngspot/expandable-input/material#as_a_reusable_component
 */
@Input() iconOpenAnimation = iconOpenAnimation;

/**
 * A set of enter and leave AnimationMetadata applied to icon "close".
 * See example of usage: https://dmitryefimenko.github.io/ngspot/expandable-input/material#as_a_reusable_component
 */
@Input() iconCloseAnimation = iconCloseAnimation;

/**
 * A set of enter and leave AnimationMetadata applied to icon "action".
 * See example of usage: https://dmitryefimenko.github.io/ngspot/expandable-input/material#as_a_reusable_component
 */
@Input() iconActionAnimation = iconCloseAnimation;

/**
 * Event emitted when input shows
 */
@Output() opened = new EventEmitter<void>();

/**
 * Event emitted when input hides
 */
@Output() closed = new EventEmitter<void>();
```

All of these Inputs and Outputs belong to the `ExpandableInputBase` class, which comes very handy in the extensibility story of this library.

### Extensibility - Creating your own custom components

Using this library as-is isn't a primary use-case. Most likely your application is using some sort of a design system (for example material). This library is designed in such a way that it's easy to create a custom reusable component with your design system in mind.
There are only a few things your custom component must do:

- Component class should extend from `ExpandableInputBase` class so that it inherits all the Inputs and Outputs that `<ngs-expandable-input>` component has.
- Component's template should use `<ngs-expandable-input>` component inside of it and bind all Inputs and Outputs to it.
- Use content projection with your choice of selectors that target corresponding elements for the input and the icons.

See full code example of the custom Material component [here](https://dmitryefimenko.github.io/ngspot/expandable-input/material#as_a_reusable_component).

### CSS

Under the hood the library uses a few CSS variables. Using these variables should be enough for most use-cases. See how these variables are used when using this library with [Angular Material](https://dmitryefimenko.github.io/ngspot/expandable-input/material) components or with [Bootstrap](https://dmitryefimenko.github.io/ngspot/expandable-input/bootstrap) components.

---

The input element and the "trigger" element are placed within a `display: flex` container. `--expandable-input-align-items` variable controls `align-items` property of that container. `--expandable-input-items-gap` variable controls the `gap` property of that container.

```css
:host {
  --expandable-input-align-items: baseline;
  --expandable-input-items-gap: 1rem;
}
```

---

In addition, the element containing "trigger" elements can be controlled via adjusting its top or bottom properties.

```css
:host {
  --expandable-input-trigger-icons-top: 0.5rem;
  --expandable-input-trigger-icons-bottom: 0.5rem;
}
```

---

The action button element has `position: absolute` applied to it. These variables allow you to adjust the corresponding `right`, `top`, or `bottom` CSS properties.

```css
:host {
  --expandable-input-action-icon-right: 0.5rem;
  --expandable-input-action-icon-top: 0.5rem;
  --expandable-input-action-icon-bottom: 0.5rem;
}
```

## Animating sibling elements

One of the common usages of the expandable input is a "search" input. You might have other navigation elements/buttons present next to the expandable input and you might want to hide these elements when expandable input expands.

This library provides couple utility animations that aid in achieving desired effect: `animateCssProperty` and `smoothHorizontalCollapse`. These two animation utilities are designed to work together due to some aspects of collapse timing.

See example below.

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  EXPANDABLE_INPUT_DIRECTIVES,
  animateCssProperty,
  smoothHorizontalCollapse,
} from '@ngspot/expandable-input';

@Component({
  selector: 'ngs-expandable-input-demo',
  standalone: true,
  imports: [EXPANDABLE_INPUT_DIRECTIVES],
  templateUrl: './hiding-sibling-element.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    smoothHorizontalCollapse({
      durationMs: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    }),
    animateCssProperty({
      propName: 'gap',
      falseValue: '1rem',
      trueValue: '0',
      durationMs: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    }),
  ],
})
export class ExpandableInputDemoComponent {}
```

```html
<div style="display: flex; align-items: center" [@gap]="expInp.isOpen">
  <i [@smoothHorizontalCollapse]="expInp.isOpen">😼</i>

  <ngs-expandable-input #expInp style="flex: 1 0 auto">
    <input type="text" *ngsExpInput />
    <i *ngsExpIconOpen>🔍</i>
    <i *ngsExpIconClose>✖️</i>
  </ngs-expandable-input>

  <button type="button" [@smoothHorizontalCollapse]="expInp.isOpen">
    Some Element
  </button>
</div>
```
