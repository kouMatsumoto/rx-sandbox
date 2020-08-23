import { TestScheduler } from 'rxjs/testing';
import { runRepeatedly } from './run-repeatedly';

describe('runRepeatedly', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  test('should run once if minimum runtime is under execution time', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const stream = cold('10ms (a|)');
      const expected = '10ms (b|)';
      const expectedValue = { b: { data: 'a', executionTime: 10, waitTime: 0, totalCount: 1 } };

      expectObservable(stream.pipe(runRepeatedly(0, 3, 0, scheduler))).toBe(expected, expectedValue);
    });
  });

  test('should noop if execution count is 0', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const stream = cold('10ms (a|)');
      const expected = '|';

      expectObservable(stream.pipe(runRepeatedly(0, 0, 0, scheduler))).toBe(expected);
    });
  });

  test('should complete by runtime over', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const stream = cold('100ms (a|)');
      const expected = '100ms b 99ms b 99ms (b|)';
      const expectedValue = { b: { data: 'a', executionTime: 100, waitTime: 0 } };

      expectObservable(stream.pipe(runRepeatedly(100, 10, 300, scheduler))).toBe(expected, expectedValue);
    });
  });

  test('should complete by retry count', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const stream = cold('100ms (a|)');
      const expected = '100ms b 99ms (b|)';
      const expectedValue = { b: { data: 'a', executionTime: 100, waitTime: 0 } };

      expectObservable(stream.pipe(runRepeatedly(100, 2, 300, scheduler))).toBe(expected, expectedValue);
    });
  });
});
