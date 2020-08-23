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

      const stream = cold('400ms (a|)', { a: 'value' });
      const expected = '1000ms (a|)';

      expectObservable(stream.pipe(minInterval(1000, scheduler))).toBe(expected, {
        a: {
          data: 'value',
          processTime: 400,
          waitTime: 600,
        },
      });
    });
  });

  test('should not wait if process time is over input', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const stream = cold('400ms (a|)', { a: 'value' });
      const expected = '400ms (a|)';

      expectObservable(stream.pipe(minInterval(200, scheduler))).toBe(expected, {
        a: {
          data: 'value',
          processTime: 400,
          waitTime: 0,
        },
      });
    });
  });
});
