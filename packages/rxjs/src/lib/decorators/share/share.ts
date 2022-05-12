import { Observable } from 'rxjs';
import { share, tap } from 'rxjs/operators';

export type MethodReturning<T> = (...args: any[]) => T;

export interface ShareOptions {
  when?: MethodReturning<boolean>;
}

export function Share(opts: ShareOptions = {}) {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<MethodReturning<Observable<any>>>
  ) => {
    if (!descriptor.value) {
      return descriptor;
    }

    const originalMethod = descriptor.value;
    const cachePropName = Symbol('cacheProp');

    descriptor.value = function (this: any) {
      const context = this;

      if (!context[cachePropName]) {
        context[cachePropName] = new Map<string, Observable<any>>();
      }

      const cache = context[cachePropName];
      const args = arguments;
      const key = `${String(propertyKey)}-${JSON.stringify([...args])}`;

      const updatedCall = (
        originalMethod.apply(context, args as any) as Observable<any>
      ).pipe(
        share(),
        tap(() => cache.delete(key))
      );

      if (!opts.when || (opts.when as any).apply(context, args)) {
        const loadingInProcess = cache.get(key);

        if (loadingInProcess) {
          return loadingInProcess;
        }

        cache.set(key, updatedCall);
      }

      return updatedCall;
    };

    return descriptor;
  };
}
