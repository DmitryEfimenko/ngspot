import { CommonModule, DOCUMENT, Location } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  filterOutNullish,
  resizeObserver,
  zoneFree,
} from '@ngspot/rxjs/operators';
import {
  combineLatest,
  fromEvent,
  OperatorFunction,
  ReplaySubject,
  Subscription,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

interface Link {
  /* id of the section*/
  id: string;

  /* header type h3/h4 */
  type: string;

  /* If the anchor is in view of the page */
  active: boolean;

  /* name of the anchor */
  name: string;

  /* top offset px of the anchor */
  top: number;
}

@Component({
  selector: 'ngs-table-of-contents',
  standalone: true,
  styleUrls: ['./table-of-contents.component.scss'],
  templateUrl: './table-of-contents.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableOfContentsComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _document = inject(DOCUMENT);
  private _ngZone = inject(NgZone);
  private location = inject(Location);

  /**
   * CSS selectors for headers. Usually tags such as 'h2, h3, h4' - which is a default.
   * The order identifies the indentation level
   */
  @Input() headers = 'h2, h3, h4';

  /**
   * CSS selector for scrollable html element that contains content with headers
   * If not provided, attempts to look for first parent scrollable element
   */
  @Input() scrollContainer: string | undefined;

  /**
   * Apply smooth scroll style to the scrollContainer
   */
  @Input() smoothScroll = true;

  /**
   * Amount of pixels to offset for scrolling. This way rather than scrolling
   * to the exact position of the target header, scroll accounts for addition
   * "comfort" spacing such as padding.
   */
  @Input() scrollOffset = 20;

  /**
   * CSS selector for html element that contains content with headers
   * If not provided - assumed to be the first child of scrollContainer
   */
  @Input() contentContainer: string;

  _rootUrl = document.location.pathname;

  private _urlFragment = '';
  private locationCleanupFn: VoidFunction;
  private subscriptions = new Subscription();

  private contentContainer$$ = new ReplaySubject<HTMLElement>(1);
  private contentContainer$ = this.contentContainer$$.asObservable();
  private contentResize$ = this.contentContainer$.pipe(
    switchMap((contentContainer) => resizeObserver(contentContainer)),
    shareReplay(1),
  );
  private links$ = this.contentResize$.pipe(
    debounceTime(10),
    withLatestFrom(this.contentContainer$),
    map(([, contentContainer]) => contentContainer),
    this.buildLinks(),
    shareReplay(1),
  );

  private scrollContainer$$ = new ReplaySubject<HTMLElement>(1);
  private scrollContainer$ = this.scrollContainer$$.asObservable();
  private scroll$ = this.scrollContainer$.pipe(
    switchMap((scrollContainer) => fromEvent(scrollContainer, 'scroll')),
    debounceTime(10),
    zoneFree(this._ngZone),
  );

  liveLinks$ = combineLatest([
    this.links$,
    this.scroll$.pipe(startWith(null)),
  ]).pipe(
    withLatestFrom(this.scrollContainer$),
    map(([[links], scrollContainer]) => ({ links, scrollContainer })),
    this.updateActiveLink(),
  );

  constructor() {
    this.locationCleanupFn = this.location.onUrlChange(() => {
      const rootUrl = document.location.pathname;
      if (rootUrl !== this._rootUrl) {
        this._rootUrl = rootUrl;
      }
    });

    const fragment$ = this.route.fragment.pipe(filterOutNullish());

    const watchFragment$ = combineLatest([fragment$, this.links$]).pipe(
      withLatestFrom(this.scrollContainer$),
      tap(([[fragment, links], scrollContainer]) => {
        this._urlFragment = fragment;
        const link = links.find((x) => x.id === fragment);
        if (link) {
          scrollContainer.scrollTo({ top: link.top });
        }
      }),
    );

    this.subscriptions.add(watchFragment$.subscribe());
  }

  ngAfterViewInit() {
    this.updateScrollPosition();

    this.defineScrollAndContentContainers();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.locationCleanupFn();
  }

  updateScrollPosition(): void {
    this._document.getElementById(this._urlFragment)?.scrollIntoView();
  }

  trackById(ix: number, link: Link) {
    return link.id;
  }

  private defineScrollAndContentContainers() {
    const scrollContainer = this.scrollContainer
      ? this._document.querySelector<HTMLElement>(this.scrollContainer)
      : getScrollParent(this.elementRef.nativeElement);

    if (!scrollContainer) {
      const text = this.scrollContainer
        ? `Could not find scroll container using CSS selector: ${this.scrollContainer}`
        : `Could not auto-detect scroll container`;
      throw new Error(text);
    }

    if (this.smoothScroll) {
      scrollContainer.style.scrollBehavior = 'smooth';
    }

    this.scrollContainer$$.next(scrollContainer as HTMLElement);

    const contentContainer = this.contentContainer
      ? this._document.querySelector<HTMLElement>(this.contentContainer)
      : scrollContainer;

    if (!contentContainer) {
      throw new Error(
        `Could not find content container using CSS selector: ${this.contentContainer}`,
      );
    }
    this.contentContainer$$.next(contentContainer);
  }

  /**
   * @returns A list of links built from querying for provided headers.
   * Only emits a new value if any of the links have changed compared to
   * the previous build
   */
  private buildLinks(): OperatorFunction<HTMLElement, Link[]> {
    return (contentContainer$) =>
      contentContainer$.pipe(
        map((contentContainer) => {
          const links: Link[] = Array.from(
            contentContainer.querySelectorAll<HTMLElement>(this.headers),
            (header, i) => {
              const name =
                header.textContent?.trim().replace(/^link/, '') ?? i.toString();

              if (!header.getAttribute('id')) {
                header.setAttribute(
                  'id',
                  name.toLowerCase().split(' ').join('_'),
                );
              }

              const top =
                header.getBoundingClientRect().top -
                contentContainer.getBoundingClientRect().top -
                this.scrollOffset;

              return {
                name,
                type: header.tagName.toLowerCase(),
                top,
                id: header.id,
                active: false,
              };
            },
          );

          return links;
        }),
        distinctUntilChanged((previous, current) => {
          if (previous.length !== current.length) {
            return false;
          }

          if (previous.length === 0) {
            return true;
          }

          const linkProps = Object.keys(
            previous[0],
          ) as unknown as (keyof Link)[];

          for (let i = 0; i < previous.length; i++) {
            for (const linkProp of linkProps) {
              if (previous[i][linkProp] !== current[i][linkProp]) {
                return false;
              }
            }
          }

          return true;
        }),
      );
  }

  /**
   * @returns List of input links with updated "active" property.
   * Only emits a new value if one of the links active status actually changed
   */
  private updateActiveLink(): OperatorFunction<
    { links: Link[]; scrollContainer: HTMLElement },
    Link[]
  > {
    return (source$) =>
      source$.pipe(
        map(({ links, scrollContainer }) => {
          const scrollOffset = this.getScrollOffset(scrollContainer);
          let hasChanged = false;

          const updatedLinks = links.map((currentLink, i) => {
            const nextLink = links[i + 1];
            const isActive =
              scrollOffset >= currentLink.top &&
              (!nextLink || nextLink.top > scrollOffset);

            if (isActive !== currentLink.active) {
              hasChanged = true;
              return { ...currentLink, active: isActive };
            } else {
              return currentLink;
            }
          });

          // if all links are somewhere below, none of them will be active.
          // in this case, on the page load change won't be detected, but
          // we still need to emit links so that they render.
          hasChanged = updatedLinks.every((x) => !x.active) || hasChanged;

          return { links: updatedLinks, hasChanged };
        }),
        filter(({ hasChanged }) => hasChanged),
        map(({ links }) => links),
      );
  }

  /** Gets the scroll offset of the scroll container */
  private getScrollOffset(container: HTMLElement | Window): number {
    // const { top } = this._element.nativeElement.getBoundingClientRect();

    if (container instanceof HTMLElement) {
      return container.scrollTop + this.scrollOffset;
    }

    if (container) {
      return container.scrollY + this.scrollOffset;
    }

    return 0;
  }
}

/**
 * Searches for the first scrollable container element of the provided target element.
 * @param node an HTML element within the potentially scrollable container
 * that needs to be found
 */
function getScrollParent(node: HTMLElement): HTMLElement | undefined {
  const regex = /(auto|scroll)/;
  const parents = (_node: HTMLElement, ps: HTMLElement[]): HTMLElement[] => {
    if (_node.parentNode === null) {
      return ps;
    }
    return parents(_node.parentNode as HTMLElement, ps.concat([_node]));
  };

  const style = (_node: HTMLElement, prop: string) =>
    getComputedStyle(_node, null).getPropertyValue(prop);
  const overflow = (_node: HTMLElement) =>
    style(_node, 'overflow') +
    style(_node, 'overflow-y') +
    style(_node, 'overflow-x');
  const scroll = (_node: HTMLElement) => regex.test(overflow(_node));

  const scrollParent = (_node: HTMLElement | SVGElement) => {
    if (
      !(_node instanceof HTMLElement || _node instanceof SVGElement) ||
      !_node.parentNode
    ) {
      return;
    }

    const ps = parents(_node.parentNode as HTMLElement, []);

    for (let i = 0; i < ps.length; i += 1) {
      if (scroll(ps[i] as HTMLElement)) {
        return ps[i];
      }
    }

    return (
      (document.scrollingElement as HTMLElement) || document.documentElement
    );
  };

  return scrollParent(node);
}
