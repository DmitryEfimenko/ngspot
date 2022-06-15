export type RemoteData<T = unknown, E = Error> =
  | NotAskedState<T>
  | LoadingState<T>
  | SuccessState<T>
  | ErrorState<T, E>;

export type RemoteDataState = RemoteData['state'];

export interface NotAskedState<T> {
  readonly state: 'notAsked';
  readonly isLoading: false;
  readonly value?: T;
}

export interface LoadingState<T = unknown> {
  readonly state: 'loading';
  readonly isLoading: true;
  readonly value?: T;
}

export interface SuccessState<T> {
  readonly state: 'success';
  readonly isLoading: false;
  readonly value: T;
}

export interface ErrorState<T, E = Error> {
  readonly state: 'error';
  readonly isLoading: false;
  readonly value?: T;
  readonly error: E;
}
