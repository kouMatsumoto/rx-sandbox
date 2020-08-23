import { async, Observable, Subject, timer } from 'rxjs';
import { map, repeat, takeUntil, tap } from 'rxjs/operators';

// to continue stream
export const repeatWithin = <T>(minExecutionTime: number, scheduler = async) => {
  return (source: Observable<T>): Observable<{ value: T | undefined; executionCount: number }> => {
    let executionCount = 0;
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

    return source.pipe(
      tap({ complete: conditionComplete }),
      map((v) => ({ value: v, executionCount: ++executionCount })),
      repeat(),
      takeUntil(complete$),
    );
  };
};
