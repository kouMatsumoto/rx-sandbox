import { TestScheduler } from 'rxjs/testing';
import { minInterval } from './min-interval';

describe('minInterval', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  test('should wait if process time is under input', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const stream = cold('400ms (a|)');
      const expected = '1000ms (a|)';

      expectObservable(stream.pipe(minInterval(1000, scheduler))).toBe(expected, {
        a: {
          value: 'a',
          executionTime: 400,
          waitTime: 600,
        },
      });
    });
  });

  test('should not wait if process time is over input', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const stream = cold('400ms (a|)');
      const expected = '400ms (a|)';

      expectObservable(stream.pipe(minInterval(200, scheduler))).toBe(expected, {
        a: {
          value: 'a',
          executionTime: 400,
          waitTime: 0,
        },
      });
    });
  });

  test('should not wait if errored', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const stream = cold('50ms a 19ms #');
      const expected = '70ms #';

      expectObservable(stream.pipe(minInterval(100, scheduler))).toBe(expected);
    });
  });
});
