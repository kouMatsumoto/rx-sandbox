import { TestScheduler } from 'rxjs/testing';
import { runRepeatedly, runTaskRepeatedly } from './run-repeatedly';

describe('runRepeatedly', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  test('should run for specific count with minInterval', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const stream = cold('10ms (a|)');
      const expected = '30ms b 29ms c 29ms (d|)';

      expectObservable(stream.pipe(runRepeatedly({ minInterval: 30, executionCount: 3 }, scheduler))).toBe(expected, {
        b: { executionResult: { value: 'a', executionTime: 10, waitTime: 20 }, totalExecutionCount: 1 },
        c: { executionResult: { value: 'a', executionTime: 10, waitTime: 20 }, totalExecutionCount: 2 },
        d: { executionResult: { value: 'a', executionTime: 10, waitTime: 20 }, totalExecutionCount: 3 },
      });
    });
  });

  test('should run for specific time with minInterval', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const stream = cold('10ms (a|)');
      const expected = '30ms b 29ms c 29ms (d|)';

      expectObservable(stream.pipe(runRepeatedly({ minInterval: 30, minExecutionTime: 80 }, scheduler))).toBe(expected, {
        b: { executionResult: { value: 'a', executionTime: 10, waitTime: 20 }, totalExecutionCount: 1 },
        c: { executionResult: { value: 'a', executionTime: 10, waitTime: 20 }, totalExecutionCount: 2 },
        d: { executionResult: { value: 'a', executionTime: 10, waitTime: 20 }, totalExecutionCount: 3 },
      });
    });
  });

  test('runTaskRepeatedly', async () => {
    const wait = (time: number) => new Promise((resolve) => setTimeout(() => resolve(), time));
    const fn = jest.fn(() => wait(10));

    await runTaskRepeatedly(() => fn(), { minInterval: 30, minExecutionTime: 50 });
    expect(fn).toBeCalledTimes(2);
  });
});
