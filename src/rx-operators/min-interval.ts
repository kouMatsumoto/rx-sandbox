import { async, Observable, timer } from 'rxjs';
import { delayWhen, map, timeInterval } from 'rxjs/operators';

export const minInterval = (minimumProcessTime: number, scheduler = async) => {
  return (source: Observable<any>) => {
    let waitTime: number;

    return source.pipe(
      timeInterval(scheduler),
      delayWhen((time) => {
        const remainTime = minimumProcessTime - time.interval;
        waitTime = 0 < remainTime ? minimumProcessTime - time.interval : 0;

        return timer(waitTime, scheduler);
      }),
      map((time) => ({
        data: time.value,
        processTime: time.interval,
        waitTime,
      })),
    );
  };
};
