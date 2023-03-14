import { subscribeSpyTo } from '@hirez_io/observer-spy';
import {
  errorState,
  loadingState,
  notAskedState,
  RemoteData,
  successState,
} from '@ngspot/remote-data';
import { Observable, Subject, switchMap } from 'rxjs';

import { PreviousValueCache, trackingRemoteDataSubject } from './builders';
import { trackRemoteData } from './track-remote-data';

function req(num = 0, delay = 10) {
  return new Observable((subscriber) => {
    setTimeout(() => {
      num++;
      subscriber.next({ num });
      subscriber.complete();
    }, delay);
  });
}

function reqWithError(err: unknown, delay = 10) {
  return new Observable((subscriber) => {
    setTimeout(() => {
      subscriber.error(err);
    }, delay);
  });
}

describe('trackRemoteData', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('without options', () => {
    it('should emit loading, then the response body for a successful request', () => {
      const req$ = req();

      const observerSpy = subscribeSpyTo(req$.pipe(trackRemoteData()));

      expect(observerSpy.getValues()).toEqual([loadingState()]);

      jest.advanceTimersByTime(10);

      expect(observerSpy.getValues()).toEqual([
        loadingState(),
        successState({ num: 1 }),
      ]);
    });

    it('should emit loading, then the error response when source emits error', () => {
      const error = new Error('test');

      const req$ = reqWithError(error);

      const observerSpy = subscribeSpyTo(req$.pipe(trackRemoteData()));

      jest.advanceTimersByTime(10);

      expect(observerSpy.getValues()).toEqual([
        loadingState(),
        errorState(error),
      ]);
    });
  });

  describe('with a "subject" option', () => {
    it('should emit a notAsked event, then loading event, then a success status without wrapping the subject', () => {
      const subject = trackingRemoteDataSubject();
      const trackedReq$ = req().pipe(trackRemoteData({ subject }));

      const subjectSpy = subscribeSpyTo(subject);

      trackedReq$.subscribe();
      jest.advanceTimersByTime(10);

      expect(subjectSpy.getValues()).toEqual([
        notAskedState(),
        loadingState(),
        successState({ num: 1 }),
      ]);

      trackedReq$.subscribe();
      jest.advanceTimersByTime(10);

      expect(subjectSpy.getValues()).toEqual([
        notAskedState(),
        loadingState(),
        successState({ num: 1 }),
        loadingState(),
        successState({ num: 2 }),
      ]);
    });
  });

  describe('with a "keepPreviousValue" option', () => {
    it('should work given multiple subscriptions to trackedData$', () => {
      const trackedData$ = req().pipe(
        trackRemoteData({ keepPreviousValue: new PreviousValueCache() })
      );

      const emittedValues: RemoteData[] = [];

      trackedData$.subscribe((res) => emittedValues.push(res));
      jest.advanceTimersByTime(10);

      trackedData$.subscribe((res) => emittedValues.push(res));
      jest.advanceTimersByTime(10);

      expect(emittedValues).toEqual([
        loadingState(),
        successState({ num: 1 }),
        loadingState({ num: 1 }),
        successState({ num: 2 }),
      ]);
    });

    it('should work given trackedReq$ is initialized multiple times', () => {
      const source = new Subject<number>();

      const keepPreviousValue = new PreviousValueCache();

      const trackedData$ = source.pipe(
        switchMap((num) => {
          const trackedReq$ = req(num).pipe(
            trackRemoteData({ keepPreviousValue })
          );
          return trackedReq$;
        })
      );

      const emittedValues: RemoteData[] = [];
      trackedData$.subscribe((res) => emittedValues.push(res));

      source.next(0);
      jest.advanceTimersByTime(50);

      source.next(1);
      jest.advanceTimersByTime(50);

      expect(emittedValues).toEqual([
        loadingState(),
        successState({ num: 1 }),
        loadingState({ num: 1 }),
        successState({ num: 2 }),
      ]);
    });
  });
});
