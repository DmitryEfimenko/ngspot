import { notAskedState, RemoteData } from '@ngspot/remote-data';
import { BehaviorSubject } from 'rxjs';

export function trackingRemoteDataSubject<T, E = Error>() {
  return new BehaviorSubject<RemoteData<T, E>>(notAskedState());
}

export class PreviousValueCache<T> {
  cache: T | undefined;
}
