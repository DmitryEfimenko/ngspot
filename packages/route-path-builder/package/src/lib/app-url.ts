import { NavigationBehaviorOptions, Router, UrlTree } from '@angular/router';

/**
 * Data structure returned by the .url() and .urlFromCommands() methods.
 * Provides easy access to either the URL as string, the UrlTree or a `.navigate()` method.
 */
export class AppUrl {
  /**
   * Resolved absolute URL
   */
  url: string;

  constructor(
    /**
     * UrlTree of the route
     */
    public urlTree: UrlTree,
    private router: Router,
  ) {
    this.url = this.urlTree.toString();
  }

  /**
   * Navigate to this URL
   */
  navigate(extras?: NavigationBehaviorOptions) {
    this.router.navigateByUrl(this.url, extras);
  }
}
