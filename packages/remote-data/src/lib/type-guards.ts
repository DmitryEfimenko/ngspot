import {
  ErrorState,
  LoadingState,
  NotAskedState,
  RemoteData,
  SuccessState,
} from './model';

export function isNotAskedState<T>(
  data: RemoteData<T> | undefined | null
): data is NotAskedState<T> {
  return data?.state === 'notAsked';
}

export function isLoadingState<T>(
  data: RemoteData<T> | undefined | null
): data is LoadingState<T> {
  return data?.state === 'loading';
}

export function isSuccessState<T>(
  data: RemoteData<T> | undefined | null
): data is SuccessState<T> {
  return data?.state === 'success';
}

export function isErrorState<T, E>(
  data: RemoteData<T, E> | undefined | null
): data is ErrorState<T, E> {
  return data?.state === 'error';
}
