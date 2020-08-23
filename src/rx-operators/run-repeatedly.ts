import { async, defer, Observable, Subject, timer } from 'rxjs';
import { map, repeat, takeUntil, tap } from 'rxjs/operators';
import { ObservableInput } from 'rxjs/src/internal/types';
import { minInterval } from './min-interval';

export const runRepeatedly = (minimumInterval: number, executionCount: number, minimumRuntime: number, scheduler = async) => {
  return (source: Observable<any>) => {
    let totalExecutionCount = 0;
    let isUnderRuntime = true;
    const runtimeOver = new Subject();
    const conditionRuntimeOver = () => {
      if (!isUnderRuntime) {
        runtimeOver.next();
        runtimeOver.complete();
      }
    };

    timer(minimumRuntime, scheduler).subscribe(() => (isUnderRuntime = false));

    return source.pipe(
      minInterval(minimumInterval, scheduler),
      map((res) => ({ ...res, totalCount: ++totalExecutionCount })),
      tap({ complete: conditionRuntimeOver }),
      repeat(executionCount),
      takeUntil(runtimeOver),
    );
  };
};

export const runTaskRepeatedly = (
  fn: () => ObservableInput<unknown>,
  { minimumInterval = 0, executionCount = Infinity, minimumTotalRunTime = Infinity },
) => {
  return defer(fn).pipe(runRepeatedly(minimumInterval, executionCount, minimumTotalRunTime)).toPromise();
};
