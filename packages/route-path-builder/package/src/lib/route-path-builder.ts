import { Injectable, Injector, Type } from '@angular/core';
import { Router, UrlCreationOptions } from '@angular/router';

import { AppUrl } from './app-url';

/**
 * Utility abstract class that provides methods to declare
 * application routes.
 * @usageNotes
 * Declare your application routes
 * ```
 * \@Injectable({ providedIn: 'any' })
 * export class AppRoutes extends RoutePathBuilder {
 *   path = '';
 *
 *   feature1 = this.childRoutes(RoutesForFeature1);
 *
 *   admin() {
 *     return this.url('admin');
 *   }
 *
 *   orders(id?: string) {
 *     return this.urlFromCommands(['orders', id]);
 *   }
 * }
 * ```
 * Declare routes for your lazy feature module:
 * ```
 * \@Injectable({ providedIn: 'any' })
 * export class RoutesForFeature1 extends RoutePathBuilder {
 *   todo() {
 *     return this.url('todo');
 *   }
 * }
 * ```
 * Use the AppRotes in your components/services
 * ```
 * export class MyComponent {
 *   constructor(private appRoutes: AppRoutes) {}
 *
 *   navigateToFeature1() {
 *     this.appRoutes.feature1.todo().navigate();
 *   }
 * }
 * ```
 */
@Injectable()
export abstract class RoutePathBuilder {
  /**
   * Reference to the instance of parent RoutePathBuilder
   */
  private parent: RoutePathBuilder | undefined;

  /**
   * The root path of the route associated with the module.
   * Note, this path is relative.
   */
  private path = '';

  /**
   * Instance of injected Router
   */
  protected router: Router;

  private get parentCommands() {
    let parent = this.parent;
    const commands = [this.path];
    while (parent) {
      commands.unshift(parent.path);
      parent = parent.parent;
    }
    return commands;
  }

  constructor(
    /**
     * Injector associated with the Angular Module
     */
    protected injector: Injector
  ) {
    this.router = injector.get(Router);
  }

  /**
   * The root AppUrl of the route associated with the lazy feature module
   */
  root() {
    return this.urlFromCommands([]);
  }

  /**
   * Declare a route using relative URL of that route
   * @returns AppUrl
   * @usageNotes
   * ```
   * export class AppRoutes extends RoutePathBuilder {
   *   admin() {
   *     return this.url('admin');
   *   }
   * }
   * ```
   */
  protected url(url: string) {
    return this.urlFromCommands([url]);
  }

  /**
   *
   * @param commands An array of URL fragments with which to construct the new URL tree.
   * If the path is static, can be the literal URL string. For a dynamic path, pass an
   * array of path segments, followed by the parameters for each segment. The fragments
   * are applied to the current URL tree or the one provided in the relativeTo property
   * of the options object, if supplied.
   * @param navigationExtras Options that control the navigation strategy.
   * @returns AppUrl
   * @usageNotes
   *
   * ```
   * export class AppRoutes extends RoutePathBuilder {
   *   orders(id?: string) {
   *     return this.urlFromCommands(['orders', id]);
   *   }
   * }
   * ```
   */
  protected urlFromCommands(
    commands: (string | number | undefined)[],
    navigationExtras?: UrlCreationOptions
  ) {
    const sanitizedCommands = commands.filter((c) => !!c);
    const urlTree = this.router.createUrlTree(
      [...this.parentCommands, ...sanitizedCommands],
      navigationExtras
    );
    return new AppUrl(urlTree, this.router);
  }

  /**
   * Defines either child routes or routes associated with lazy feature module
   * @param path a class that extends `RoutePathBuilder`
   * @param childRoutePathBuilderClass a class that extends `RoutePathBuilder`
   * @returns The class containing routes of the lazy feature module
   * @usageNotes
   * ```
   * export class AppRoutes extends RoutePathBuilder {
   *   feature1 = this.childRoutes(RoutesForFeature1);
   * }
   * ```
   */
  protected childRoutes<T extends RoutePathBuilder>(
    path: string,
    childRoutePathBuilderClass: Type<T>
  ) {
    const pathBuilder = this.injector.get<T>(childRoutePathBuilderClass);
    pathBuilder.parent = this;
    pathBuilder.path = path;
    return pathBuilder;
  }
}
