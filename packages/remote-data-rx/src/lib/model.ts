import { RemoteData } from '@ngspot/remote-data';
import { Subject } from 'rxjs';

import { PreviousValueCache } from './builders';

export interface TrackRemoteDataOpts<T, E = Error> {
  /**
   * A subject to which the remote data will be tracked.
   */
  subject?: Subject<RemoteData<T, E>>;

  /**
   * Whether to keep the previous value during loading.
   */
  keepPreviousValue?: PreviousValueCache<T>;
}
