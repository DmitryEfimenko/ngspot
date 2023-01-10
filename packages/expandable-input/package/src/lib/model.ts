import { AnimationMetadata } from '@angular/animations';

export interface IconAnimationMetadata {
  enter: AnimationMetadata[];
  leave: AnimationMetadata[];
}

export type NgChanges<Component, Props = ExcludeFunctions<Component>> = {
  [Key in keyof Props]: {
    previousValue: Props[Key];
    currentValue: Props[Key];
    firstChange: boolean;
    isFirstChange(): boolean;
  };
};

type ExcludeFunctions<T> = Pick<T, ExcludeFunctionPropertyNames<T>>;
type ExcludeFunctionPropertyNames<T> = MarkFunctionProperties<T>[keyof T];
type MarkFunctionProperties<Component> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [Key in keyof Component]: Component[Key] extends Function ? never : Key;
};
