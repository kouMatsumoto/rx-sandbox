import { async, Observable, Subject, timer } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { repeatWithCount } from './repeat-with-count';

// to continue stream
export const repeatWithinTime = <T>(minExecutionTime: number, scheduler = async) => {
  return (source: Observable<T>): Observable<{ value: T | undefined; count: number }> => {
    const executionCount = 0;
    let overTime = true;
    if (minExecutionTime > 0) {
      overTime = false;
      timer(minExecutionTime, scheduler).subscribe(() => (overTime = true));
    }

    const complete$ = new Subject();
    const conditionComplete = () => {
      if (overTime) {
        complete$.next();
        complete$.complete();
      }
    };

    return source.pipe(tap({ complete: conditionComplete }), repeatWithCount(), takeUntil(complete$));
  };
};
