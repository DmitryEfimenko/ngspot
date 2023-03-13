import { Observable } from 'rxjs';

export function resizeObserver(el: HTMLElement) {
  return new Observable<ResizeObserverEntry[]>((subscriber) => {
    const ro = new ResizeObserver((entries) => {
      subscriber.next(entries);
    });

    ro.observe(el);

    return () => {
      ro.unobserve(el);
      ro.disconnect();
    };
  });
}
