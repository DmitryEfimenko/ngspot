import { ErrorState, LoadingState, NotAskedState, SuccessState } from './model';

export function notAskedState<T>(value?: T): NotAskedState<T> {
  return {
    state: 'notAsked',
    isLoading: false,
    value,
  };
}

export function loadingState<T>(value?: T): LoadingState<T> {
  return {
    state: 'loading',
    isLoading: true,
    value,
  };
}

export function successState(): SuccessState<void>;
export function successState<T>(value: T): SuccessState<T>;
export function successState<T>(value?: T): SuccessState<T | void> {
  return {
    state: 'success',
    isLoading: false,
    value,
  };
}

export function errorState<E, T>(error: E, value?: T): ErrorState<T, E> {
  return {
    state: 'error',
    isLoading: false,
    value,
    error,
  };
}
