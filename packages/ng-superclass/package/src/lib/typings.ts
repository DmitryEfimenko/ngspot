/**
 * Extract arguments of function
 */
export type ArgumentsType<F> = F extends (...args: infer A) => any ? A : never;

/**
 * Provides all object method names as strings
 */
export type MethodNames<T> = {
  [P in keyof T]: T[P] extends (...a: any) => unknown ? P : never;
}[keyof T];

/**
 * Provides the type of an object method
 */
export type TypeOfClassMethod<T, K extends keyof T> = {
  [P in keyof T]: T[P] extends (...a: any) => unknown ? T[K] : never;
}[keyof T];
