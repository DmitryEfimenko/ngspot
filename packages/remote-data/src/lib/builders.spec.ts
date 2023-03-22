import {
  errorState,
  loadingState,
  notAskedState,
  successState,
} from './builders';
import {
  isErrorState,
  isLoadingState,
  isNotAskedState,
  isSuccessState,
} from './type-guards';

describe('builders', () => {
  describe('notAskedState', () => {
    it('should return a new NotAskedState', () => {
      const result = notAskedState();

      expect(isNotAskedState(result)).toBe(true);
    });
  });

  describe('loadingState', () => {
    it('should return a new LoadingState with the given last-known value', () => {
      const value = { foo: 42 };
      const result = loadingState(value);

      expect(isLoadingState(result)).toBe(true);
      expect(result.value).toBe(value);
    });

    it('should return a new LoadingState with no value if given undefined', () => {
      const result = loadingState();

      expect(isLoadingState(result)).toBe(true);
      expect(result.value).toBeUndefined();
    });
  });

  describe('successState', () => {
    it('should return a new SuccessState wrapping the given value', () => {
      const value = { foo: 42 };
      const result = successState(value);

      expect(isSuccessState(result)).toBe(true);
      expect(result.value).toBe(value);
    });

    it('should return a new SuccessState with no value if given undefined', () => {
      const result = successState();

      expect(isSuccessState(result)).toBe(true);
      expect(result.value).toBeUndefined();
    });
  });

  describe('errorState', () => {
    it('should return a new ErrorState wrapping the given error and last-known value', () => {
      const error = Error();
      const value = { foo: 42 };
      const result = errorState(error, value);

      expect(isErrorState(result)).toBe(true);
      expect(result.error).toBe(error);
      expect(result.value).toBe(value);
    });

    it('should return a new ErrorState wrapping the given error and with no last-known value if given only an error', () => {
      const error = Error();
      const result = errorState(error);

      expect(isErrorState(result)).toBe(true);
      expect(result.error).toBe(error);
      expect(result.value).toBeUndefined();
    });
  });
});
