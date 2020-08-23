import { TestScheduler } from 'rxjs/testing';
import { repeatWithCount } from './repeat-with-count';
import { repeatWithinTime } from './repeat-within-time';

describe('repeatWithCount', () => {
  const wait = (time: number) => new Promise((resolve) => setTimeout(() => resolve(), time));
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  test('should emit count', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const stream = cold('a|');
      const expected = 'bcd|';

      expectObservable(stream.pipe(repeatWithCount(3))).toBe(expected, {
        b: { value: 'a', count: 1 },
        c: { value: 'a', count: 2 },
        d: { value: 'a', count: 3 },
      });
    });
  });
});
