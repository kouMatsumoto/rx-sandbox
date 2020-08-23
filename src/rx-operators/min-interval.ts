import { async, Observable, timer } from 'rxjs';
import { delayWhen, map, timeInterval } from 'rxjs/operators';

export const minInterval = <T>(minimumProcessTime: number, scheduler = async) => {
  return (source: Observable<T>) => {
    let waitTime: number;

    return source.pipe(
      timeInterval(scheduler),
      delayWhen((time) => {
        const remainTime = minimumProcessTime - time.interval;
        waitTime = 0 < remainTime ? minimumProcessTime - time.interval : 0;

        return timer(waitTime, scheduler);
      }),
      map((time) => ({
        value: time.value,
        executionTime: time.interval,
        waitTime,
      })),
    );
  };
};
