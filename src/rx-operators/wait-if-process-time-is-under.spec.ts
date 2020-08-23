import { TestScheduler } from 'rxjs/testing';
import { waitIfProcessTimeIsUnder } from './wait-if-process-time-is-under';

describe('waitIfProcessTimeIsUnder', () => {
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

      expectObservable(stream.pipe(waitIfProcessTimeIsUnder(1000, scheduler))).toBe(expected, {
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

      expectObservable(stream.pipe(waitIfProcessTimeIsUnder(200, scheduler))).toBe(expected, {
        a: {
          data: 'value',
          processTime: 400,
          waitTime: 0,
        },
      });
    });
  });
});
