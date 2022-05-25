import {
  ErrorState,
  LoadingState,
  NotAskedState,
  RemoteData,
  SuccessState,
} from './model';
import {
  isErrorState,
  isLoadingState,
  isNotAskedState,
  isSuccessState,
} from './type-guards';

interface TestParams {
  function: (state?: RemoteData<unknown>) => boolean;
  NotAskedState: boolean;
  LoadingState: boolean;
  LoadedState: boolean;
  ErrorState: boolean;
}

const testMatrix: TestParams[] = [
  {
    function: isNotAskedState,
    NotAskedState: true,
    LoadingState: false,
    LoadedState: false,
    ErrorState: false,
  },
  {
    function: isLoadingState,
    NotAskedState: false,
    LoadingState: true,
    LoadedState: false,
    ErrorState: false,
  },
  {
    function: isSuccessState,
    NotAskedState: false,
    LoadingState: false,
    LoadedState: true,
    ErrorState: false,
  },
  {
    function: isErrorState,
    NotAskedState: false,
    LoadingState: false,
    LoadedState: false,
    ErrorState: true,
  },
];

const testStates = Object.freeze({
  NotAskedState: Object.freeze<NotAskedState>({
    state: 'notAsked',
    isLoading: false,
  }),
  LoadingState: Object.freeze<LoadingState<void>>({
    state: 'loading',
    isLoading: true,
  }),
  LoadedState: Object.freeze<SuccessState<void>>({
    state: 'success',
    isLoading: false,
    value: undefined,
  }),
  ErrorState: Object.freeze<ErrorState<void>>({
    state: 'error',
    isLoading: false,
    error: Error(),
  }),
});

type testStateName = keyof typeof testStates;
type testStateValue = typeof testStates[testStateName];

describe('type-guards', () => {
  testMatrix.forEach((testParams) => {
    describe(testParams.function.name, () => {
      const entries = Object.entries(testStates) as [
        testStateName,
        testStateValue
      ][];
      entries.forEach(([stateName, state]) => {
        it(`should return ${testParams[stateName]} when given a ${stateName}`, () => {
          expect(testParams.function(state)).toBe(testParams[stateName]);
        });
      });
      it('should return false if given undefined', () => {
        expect(testParams.function(undefined)).toBe(false);
      });
    });
  });
});
