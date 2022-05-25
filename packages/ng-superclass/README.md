# ng-superclass

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> A library of classes to extend from - for simplifying writing reactive Angular components/directives and custom controls that implement ControlValueAccessor

## Features

- ✅ Simple syntax that reduces boilerplate
- ✅ SubscribeSink - for automatic managing subscriptions
- ✅ DirectiveSuperclass - for getting stream of @Input values
- ✅ FormComponentSuperclass - for creating any custom form controls
- ✅ WrappedControlSuperclass - for creating custom form controls with a single underlying AbstractControl
- ✅ WrappedFormControlSuperclass - for creating custom form controls with a single underlying FormControl

## Installation

### NPM

```sh
npm install @ngspot/ng-superclass
```

### Yarn

```sh
yarn add @ngspot/ng-superclass
```

## Overview

This library provides a set of classes that can be used to extend from when writing application components. Each class in this library actually extends from another class in this library in the following order:

> _base_ `SubscribeSink`  
> extends `DirectiveSuperclass`  
> extends `FormComponentSuperclass`  
> extends `WrappedControlSuperclass`  
> extends `WrappedFormControlSuperclass`

So if extending the component from WrappedFormControlSuperclass, the component will inherit the functionality of all of the above classes.

Choose the class to extend from based on what is needed.

Now, here is more about the unique functionality of each class:

### **SubscribeSink**

```ts
@Component({
  /* ... */
})
class MyComponent extends SubscribeSink {}
```

Class provides two methods:

#### **1. `subscribeTo`**

Use this method for hassle-free subscribing to observables. Under the hood, this class tracks the component destruction lifecycle hook and automatically unsubscribes from the observable when component destroys.

##### Usage:

```ts
class MyComponent extends SubscribeSink {
  this.subscribeTo(myObservable$);
}
```

#### **2. `createEffect`**

Creating side effects in a reactive Angular components is a common task. This method is just that - a way to create a side effect. Internally, this class will manage the subscription according to the component lifecycle.

##### Usage:

```ts
@Component({
  template: ` <button (click)="saveData({ name: 'Dima' })">Submit</button> `,
})
class MyComponent extends SubscribeSink {
  saveData = this.createEffect<MyData>((myData$) =>
    myData$.pipe(
      // your choice of flattening operator
      switchMap((myData) => this.api.saveMyData(myData))
    )
  );
}
```

### **DirectiveSuperclass**

This class is useful for enabling Reactive programming in Angular components/directives/pipes when needing to track changes to Inputs or to know if changes have run.

#### **1. `getInput$`**

Gets the value of an `@Input()` as an observable stream:

##### Usage:

```ts
class MyComponent extends DirectiveSuperclass {
  @Input() color: string;

  color$ = this.getInput$('color');
}
```

#### **2. `onChangesRan$`**

An Observable that emits when the component `ngOnChanges` lifecycle hook has run. Late subscriptions are also supported since it uses `BehaviorSubject` under the hood.

##### Usage:

```ts
class MyComponent extends DirectiveSuperclass {
  valueAfterChangesRun$ = this.onChangesRan$.pipe(switchMapTo('Dima'));
}
```

#### **3. `inputChanges$`**

Emits the set of `@Input()` property names that change during each call to `ngOnChanges()`.

##### Usage:

```ts
class MyComponent extends DirectiveSuperclass {
  @Input() color: string;

  valueAfterChangesRun$ = this.inputChanges$.pipe(
    tap((inputName) => {
      console.log(`${inputName} changed`);
    })
  );
}
```

### **FormComponentSuperclass**

Writing a custom control in Angular requires quite a bit of boilerplate. It requires a developer to implement a `ControlValueAccessor` and provide some additional metadata in the `@Component` decorator. This class takes care of all the boilerplate and frees the developer up to concentrate strictly on the handling of control values.

`FormComponentSuperclass` does not put any restrictions on the type of UI that drives the model value. For more niche use-cases, like having a single underlying input field, see `WrappedControlSuperclass` and `WrappedFormControlSuperclass`.

##### Usage:

```ts
@Component({
  template: `
    <button (click)="increment()" [disabled]="isDisabled">{{ counter }}</button>
  `,
})
class MyCounter extends FormComponentSuperclass {
  // internal component value state
  private counter = 0;

  // implement this method to handle values that come from the "outside".
  // for example, when parent component calls something like:
  // `this.myCountryControl.setValue(3)`
  handleIncomingValue(value: number) {
    this.counter = value;
  }

  increment() {
    // propagate the updated value to the parent component
    this.emitOutgoingValue(++this.counter);

    // mark component as touched
    this.onTouched();
  }
}
```

### **WrappedControlSuperclass**

Useful for writing custom Angular controls that have a single underlying `AbstractControl`.

The only hard requirement for this scenario is that the extending class needs to instantiate a control property since there are no assumptions on the type of the control. It could be `FormControl`, `FormArray`, or `FormGroup`.

If the "inside" model shape is the same as "outside" model shape, there is no need to implement any methods. Otherwise, if some transformations are needed, the developer needs to override two methods:

- `outerToInner` - this method listens to the values coming in from the parent component. Use this method to convert the incoming values to the internal model.
- `innerToOuter` - this method emits changes of internal model to the parent component. Use this method to do appropriate model to value conversions.

Both methods make use of observable streams, which gives the developer full control of the values. Instead of only controlling the value shapes, a developer can now control the timing of values being emitted or decide if a particular value should or should not be emitted all together.

##### Usage:

```ts
@Component({
  template: `
    <label></label>
    <input [formControl]="control" />
  `,
})
class MyCounter extends WrappedControlSuperclass<Date, string> {
  control = new FormControl();

  // make sure that the Date type that this custom control receives from the
  // parent is displayed as string to the user in the internal <input />
  override outerToInner(values$: Observable<Date>): Observable<string> {
    return values$.pipe(
      map((date) => date?.toLocaleDateString() ?? '');
    )
  }

  // when user types in the input, parse what they typed and emit it
  // to the parent component in the form of a Date
  override innerToOuter(values$: Observable<string>): Observable<Date> {
    return values$.pipe(
      map((dateString) => dateString ? new Date(dateString) : null)
    )
  }
}
```

In addition, the `WrappedControlSuperclass` exposes a few observables that ease the developer's job in creating the custom control using Reactive programming:

#### **1. `incomingValues$`**

Stream of values that are set on the outer control

#### **2. `innerControlValues$`**

Stream of values from the internal control (`this.control.valueChanges`)

#### **2. `latestValue$`**

Stream of values that are either incoming from the parent or outgoing to the parent

### **WrappedFormControlSuperclass**

This is a very thin wrapper of `WrappedControlSuperclass` which instantiates the internal control to the instance of `FormControl`.

## Previous Art

The library is a heavily modified version of [https://simontonsoftware.github.io/s-libs/ng-core/](@s-libs/ng-core). HUGE kudos to the authors of s-libs!

Due to business requirements, the s-libs may not include all the features and API changes that I wanted to see in the library. @ngspot/ng-superclass provides APIs that favor reactive programming with RxJS and enable less boilerplate for majority of Angular developers.

## License

MIT © [Dmitry Efimenko](mailto:dmitrief@gmail.com)
