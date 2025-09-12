import { Observable, of, VirtualTimeScheduler } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

import { MethodReturning, Share } from './share';

abstract class TestClass {
  abstract hitCount: number;
  abstract testMethod(
    arg1: string,
    arg2: number,
    scheduler: VirtualTimeScheduler,
  ): Observable<unknown>;
}

interface Obj {
  arg1: string;
  arg2: number;
}

describe('@Share()', () => {
  function setup(when?: MethodReturning<boolean>) {
    class TestClassConcrete extends TestClass {
      hitCount = 0;

      @Share({ when })
      testMethod(arg1: string, arg2: number, scheduler: VirtualTimeScheduler) {
        return of<Obj>({ arg1, arg2 }).pipe(
          delay(1, scheduler),
          tap(() => this.hitCount++),
        );
      }
    }
    const classUnderTest = new TestClassConcrete();

    return { classUnderTest };
  }

  function setCall1Args(arg1: string, arg2: number) {
    return { arg1, arg2 };
  }

  function setCall2Args(arg1: string, arg2: number) {
    return { arg1, arg2 };
  }

  describe('GIVEN: second subscribe before first one flushes', () => {
    function act(classUnderTest: TestClass, call1Args: Obj, call2Args: Obj) {
      const call1 = new VirtualTimeScheduler();
      const call2 = new VirtualTimeScheduler();

      classUnderTest
        .testMethod(call1Args.arg1, call1Args.arg2, call1)
        .subscribe();

      classUnderTest
        .testMethod(call2Args.arg1, call2Args.arg2, call2)
        .subscribe();

      call1.flush();
      call2.flush();
    }

    describe('GIVEN: two subs with the same args', () => {
      it('Observable should have been called once', () => {
        const { classUnderTest } = setup();

        act(classUnderTest, setCall1Args('1', 1), setCall2Args('1', 1));

        expect(classUnderTest.hitCount).toBe(1);
      });

      describe('GIVEN: when condition returns true', () => {
        it('Observable should have been called once', () => {
          const when = (arg1: string, arg2: number) => {
            return arg1 === '1' && arg2 === 1;
          };

          const { classUnderTest } = setup(when);

          act(classUnderTest, setCall1Args('1', 1), setCall2Args('1', 1));

          expect(classUnderTest.hitCount).toBe(1);
        });
      });

      describe('GIVEN: when condition returns false', () => {
        it('Observable should have been called twice', () => {
          const when = (arg1: string, arg2: number) => {
            return arg1 === '1' && arg2 === 2;
          };

          const { classUnderTest } = setup(when);

          act(classUnderTest, setCall1Args('1', 1), setCall2Args('1', 1));

          expect(classUnderTest.hitCount).toBe(2);
        });
      });
    });

    describe('GIVEN: two subs with different args', () => {
      it('Observable should have been called twice', () => {
        const { classUnderTest } = setup();

        act(classUnderTest, setCall1Args('1', 1), setCall2Args('2', 1));

        expect(classUnderTest.hitCount).toBe(2);
      });
    });
  });

  describe('GIVEN: second subscribe after first one flushes', () => {
    function act(classUnderTest: TestClass, call1Args: Obj, call2Args: Obj) {
      const call1 = new VirtualTimeScheduler();
      const call2 = new VirtualTimeScheduler();

      classUnderTest
        .testMethod(call1Args.arg1, call1Args.arg2, call1)
        .subscribe();
      call1.flush();

      classUnderTest
        .testMethod(call2Args.arg1, call2Args.arg2, call2)
        .subscribe();
      call2.flush();
    }

    describe('GIVEN: two subs with the same args', () => {
      it('Observable should have been called once', () => {
        const { classUnderTest } = setup();

        act(classUnderTest, setCall1Args('1', 1), setCall2Args('1', 1));

        expect(classUnderTest.hitCount).toBe(2);
      });
    });
  });
});

describe('@Share when using two instances of class', () => {
  function setup() {
    const res = {
      hitCount: 0,
    };

    class TestClass2Concrete extends TestClass {
      hitCount = 0;

      @Share()
      testMethod(arg1: string, arg2: number, scheduler: VirtualTimeScheduler) {
        return of<Obj>({ arg1, arg2 }).pipe(
          delay(1, scheduler),
          tap(() => res.hitCount++),
        );
      }
    }

    const classUnderTest1 = new TestClass2Concrete();
    const classUnderTest2 = new TestClass2Concrete();

    return { classUnderTest1, classUnderTest2, res };
  }

  it('should call twice', () => {
    const { classUnderTest1, classUnderTest2, res } = setup();

    const call1 = new VirtualTimeScheduler();
    const call2 = new VirtualTimeScheduler();
    classUnderTest1.testMethod('1', 2, call1).subscribe();
    classUnderTest2.testMethod('1', 2, call2).subscribe();
    call1.flush();
    call2.flush();

    expect(res.hitCount).toBe(2);
  });
});
