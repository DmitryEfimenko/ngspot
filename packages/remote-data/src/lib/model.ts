export type RemoteData<T = any, E = Error> =
  | NotAskedState
  | LoadingState<T>
  | SuccessState<T>
  | ErrorState<T, E>;

export type RemoteDataState = RemoteData<any>['state'];

export interface NotAskedState {
  readonly state: 'notAsked';
  readonly isLoading: false;
}

export interface LoadingState<T = any> {
  readonly state: 'loading';
  readonly isLoading: true;
  readonly value?: T;
}

export interface SuccessState<T> {
  readonly state: 'success';
  readonly isLoading: false;
  readonly value?: T;
}

export interface ErrorState<T, E = Error> {
  readonly state: 'error';
  readonly isLoading: false;
  readonly value?: T;
  readonly error: E;
}
