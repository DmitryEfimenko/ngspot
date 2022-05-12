import { Observable, of, VirtualTimeScheduler } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Share } from './share';

abstract class TestClass {
  abstract hitCount: number;
  abstract testMethod(
    arg1: string,
    arg2: number,
    scheduler: VirtualTimeScheduler
  ): Observable<any>;
}

interface Obj {
  arg1: string;
  arg2: number;
}

describe('@Share()', () => {
  let classUnderTest: TestClass;
  let call1Args: Obj;
  let call2Args: Obj;
  let call1Res: Obj;
  let call2Res: Obj;
  let when: ((...args: any[]) => boolean) | undefined;

  function setCall1Args(arg1: string, arg2: number) {
    call1Args = { arg1, arg2 };
  }

  function setCall2Args(arg1: string, arg2: number) {
    call2Args = { arg1, arg2 };
  }

  Given(() => {
    call1Args = undefined as any;
    call2Args = undefined as any;
    call1Res = undefined as any;
    call2Res = undefined as any;
    when = undefined;
  });

  When(() => {
    class TestClassConcrete extends TestClass {
      hitCount = 0;

      @Share({ when })
      testMethod(arg1: string, arg2: number, scheduler: VirtualTimeScheduler) {
        return of<Obj>({ arg1, arg2 }).pipe(
          delay(1, scheduler),
          tap(() => this.hitCount++)
        );
      }
    }
    classUnderTest = new TestClassConcrete();
  });

  describe('GIVEN: second subscribe before first one flushes', () => {
    When(() => {
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
    });

    describe('GIVEN: two subs with the same args', () => {
      Given(() => {
        setCall1Args('1', 1);
        setCall2Args('1', 1);
      });

      Then('Observable should have been called once', () => {
        expect(classUnderTest.hitCount).toBe(1);
        expect(call1Res).toBe(call2Res);
      });

      describe('GIVEN: when condition returns true', () => {
        Given(() => {
          when = (arg1: string, arg2: number) => {
            return arg1 === '1' && arg2 === 1;
          };
        });

        Then('Observable should have been called once', () => {
          expect(classUnderTest.hitCount).toBe(1);
        });
      });

      describe('GIVEN: when condition returns false', () => {
        Given(() => {
          when = (arg1: string, arg2: number) => {
            return arg1 === '1' && arg2 === 2;
          };
        });

        Then('Observable should have been called twice', () => {
          expect(classUnderTest.hitCount).toBe(2);
          expect(call1Res).toBe(call2Res);
        });
      });
    });

    describe('GIVEN: two subs with different args', () => {
      Given(() => {
        setCall1Args('1', 1);
        setCall2Args('2', 1);
      });

      Then('Observable should have been called twice', () => {
        expect(classUnderTest.hitCount).toBe(2);
      });
    });
  });

  describe('GIVEN: second subscribe after first one flushes', () => {
    When(() => {
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
    });

    describe('GIVEN: two subs with the same args', () => {
      Given(() => {
        setCall1Args('1', 1);
        setCall2Args('1', 1);
      });

      Then('Observable should have been called once', () => {
        expect(classUnderTest.hitCount).toBe(2);
      });
    });
  });
});

describe('@Share when using two instances of class', () => {
  let classUnderTest1: TestClass;
  let classUnderTest2: TestClass;
  let hitCount: number;

  Given(() => {
    classUnderTest1 = null as any;
    classUnderTest2 = null as any;
    hitCount = 0;
  });

  When(() => {
    class TestClass2Concrete extends TestClass {
      hitCount = 0;

      @Share()
      testMethod(arg1: string, arg2: number, scheduler: VirtualTimeScheduler) {
        return of<Obj>({ arg1, arg2 }).pipe(
          delay(1, scheduler),
          tap(() => hitCount++)
        );
      }
    }

    classUnderTest1 = new TestClass2Concrete();
    classUnderTest2 = new TestClass2Concrete();
  });

  Then(() => {
    const call1 = new VirtualTimeScheduler();
    const call2 = new VirtualTimeScheduler();
    classUnderTest1.testMethod('1', 2, call1).subscribe();
    classUnderTest2.testMethod('1', 2, call2).subscribe();
    call1.flush();
    call2.flush();

    expect(hitCount).toBe(2);
  });
});
