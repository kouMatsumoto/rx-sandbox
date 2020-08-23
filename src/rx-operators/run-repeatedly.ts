import { async, defer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ObservableInput } from 'rxjs/src/internal/types';
import { minInterval } from './min-interval';
import { repeatWithCount } from './repeat-with-count';
import { repeatWithinTime } from './repeat-within-time';

// either executionCount or minExecutionTime is required
type Param =
  | { minInterval?: number; executionCount: number; minExecutionTime?: never }
  | { minInterval?: number; executionCount?: never; minExecutionTime: number };

export const runRepeatedly = <T>(options: Param, scheduler = async) => {
  return (source: Observable<T>) => {
    const s1 = source.pipe(minInterval(options.minInterval || 0, scheduler));
    const s2 =
      options.executionCount !== undefined
        ? s1.pipe(repeatWithCount(options.executionCount))
        : s1.pipe(repeatWithinTime(options.minExecutionTime, scheduler));

    return s2.pipe(map((v) => ({ executionResult: v.value, totalExecutionCount: v.count })));
  };
};

export const runTaskRepeatedly = <T>(fn: () => ObservableInput<T>, options: Param, scheduler = async) => {
  return defer(fn).pipe(runRepeatedly<T>(options, scheduler)).toPromise();
};
