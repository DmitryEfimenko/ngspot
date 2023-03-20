import { Observable } from 'rxjs';

export function mutationObserver(
  el: HTMLElement,
  options: MutationObserverInit
) {
  return new Observable((subscriber) => {
    const observer = new MutationObserver((mutation) => {
      subscriber.next(mutation);
    });
    observer.observe(el, options);

    return () => observer.disconnect();
  });
}
