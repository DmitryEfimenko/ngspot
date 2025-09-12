import { Injectable } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { RoutePathBuilder } from './route-path-builder';

@Injectable()
export class AppRoutes extends RoutePathBuilder {
  child1 = this.childRoutes('child1', Child1Routes);

  url1() {
    return this.url('url1');
  }

  complexUrl(commands: (string | number | undefined)[]) {
    return this.urlFromCommands(commands);
  }
}

@Injectable()
export class Child1Routes extends RoutePathBuilder {
  child2 = this.childRoutes('child2', Child2Routes);

  url1() {
    return this.url('child1Url');
  }
}

@Injectable()
export class Child2Routes extends RoutePathBuilder {
  url1() {
    return this.url('child2Url');
  }
}

describe('RoutePathBuilder', () => {
  let spectator: SpectatorService<AppRoutes>;
  let appRoutes: AppRoutes;

  const createService = createServiceFactory({
    service: AppRoutes,
    providers: [Child1Routes, Child2Routes],
    imports: [RouterTestingModule.withRoutes([])],
  });

  beforeEach(() => {
    spectator = createService();
    appRoutes = spectator.service;
  });

  it('should create', () => {
    expect(appRoutes.root().url).toBe('/');
  });

  describe('METHOD: url', () => {
    it('should resolve /url1', () => {
      expect(appRoutes.url1().url).toBe('/url1');
    });
  });

  describe('METHOD: urlFromCommands', () => {
    it('should resolve from commands', () => {
      expect(appRoutes.complexUrl(['url2', 2]).url).toBe('/url2/2');
    });

    it('should filter out undefined value', () => {
      expect(appRoutes.complexUrl(['url3', undefined]).url).toBe('/url3');
    });
  });

  describe('METHOD: childRoutes', () => {
    it('should work with childRoutes', () => {
      expect(appRoutes.child1.url1().url).toBe('/child1/child1Url');
    });

    it('works with sub-child routes', () => {
      expect(appRoutes.child1.child2.url1().url).toBe(
        '/child1/child2/child2Url',
      );
    });
  });
});
