import { async, Observable, timer } from 'rxjs';
import { delayWhen, map, tap, timeInterval } from 'rxjs/operators';

export const waitIfProcessTimeIsUnder = (minimumProcessTime: number, scheduler = async) => {
  return (source: Observable<any>) => {
    let result: any;

    return source.pipe(
      timeInterval(scheduler),
      tap((time) => {
        const remainTime = minimumProcessTime - time.interval;
        result = {
          data: time.value,
          processTime: time.interval,
          waitTime: 0 < remainTime ? minimumProcessTime - time.interval : 0,
        };
      }),
      delayWhen(() => timer(result.waitTime, scheduler)),
      map(() => result),
    );
  };
};
