import { Observable } from 'rxjs';
import { map, repeat } from 'rxjs/operators';

// to continue stream
export const repeatWithCount = <T>(repeatCount = -1) => {
  return (source: Observable<T>) => {
    let count = 0;

    return source.pipe(
      map((v) => ({ value: v, count: ++count })),
      repeat(repeatCount),
    );
  };
};
