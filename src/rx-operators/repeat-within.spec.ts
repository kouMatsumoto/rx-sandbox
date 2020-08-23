import { defer } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { repeatWithin } from './repeat-within';

describe('repeatWithin', () => {
  const wait = (time: number) => new Promise((resolve) => setTimeout(() => resolve(), time));
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  test('should run once if time is 0', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const stream = cold('10ms (a|)');
      const expected = '10ms (b|)';

      expectObservable(stream.pipe(repeatWithin(0, scheduler))).toBe(expected, {
        b: { value: 'a', executionCount: 1 },
      });
    });
  });

  test('should run once if time is less than 0', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const stream = cold('10ms (a|)');
      const expected = '10ms (b|)';

      expectObservable(stream.pipe(repeatWithin(-100, scheduler))).toBe(expected, {
        b: { value: 'a', executionCount: 1 },
      });
    });
  });

  test('should repeat until after time (just time)', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const stream = cold('10ms (a|)');
      const expected = '10ms b 9ms (c|)';

      expectObservable(stream.pipe(repeatWithin(20, scheduler))).toBe(expected, {
        b: { value: 'a', executionCount: 1 },
        c: { value: 'a', executionCount: 2 },
      });
    });
  });

  test('should repeat until after time (odd time)', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const stream = cold('10ms (a|)');
      const expected = '10ms b 9ms (c|)';

      expectObservable(stream.pipe(repeatWithin(15, scheduler))).toBe(expected, {
        b: { value: 'a', executionCount: 1 },
        c: { value: 'a', executionCount: 2 },
      });
    });
  });

  // TODO: spy Observable.subscribe to check count
  test('should call source by expected count', async () => {
    const fn = jest.fn(() => wait(10));
    defer(fn).pipe(repeatWithin(15)).subscribe();

    await wait(20);
    expect(fn).toBeCalledTimes(2);
  });
});
