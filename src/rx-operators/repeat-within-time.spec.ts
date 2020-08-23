import { defer } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { repeatWithinTime } from './repeat-within-time';

describe('repeatWithinTime', () => {
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

      expectObservable(stream.pipe(repeatWithinTime(0, scheduler))).toBe(expected, {
        b: { value: 'a', count: 1 },
      });
    });
  });

  test('should run once if time is less than 0', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const stream = cold('10ms (a|)');
      const expected = '10ms (b|)';

      expectObservable(stream.pipe(repeatWithinTime(-100, scheduler))).toBe(expected, {
        b: { value: 'a', count: 1 },
      });
    });
  });

  test('should repeat until after time (just time)', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const stream = cold('10ms (a|)');
      const expected = '10ms b 9ms (c|)';

      expectObservable(stream.pipe(repeatWithinTime(20, scheduler))).toBe(expected, {
        b: { value: 'a', count: 1 },
        c: { value: 'a', count: 2 },
      });
    });
  });

  test('should repeat until after time (odd time)', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const stream = cold('10ms (a|)');
      const expected = '10ms b 9ms (c|)';

      expectObservable(stream.pipe(repeatWithinTime(15, scheduler))).toBe(expected, {
        b: { value: 'a', count: 1 },
        c: { value: 'a', count: 2 },
      });
    });
  });

  // TODO: spy Observable.subscribe to check count
  test('should call source by expected count', async () => {
    const fn = jest.fn(() => wait(10));
    defer(fn).pipe(repeatWithinTime(15)).subscribe();

    await wait(20);
    expect(fn).toBeCalledTimes(2);
  });
});
