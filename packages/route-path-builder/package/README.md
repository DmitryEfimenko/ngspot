<p align="center">
 <img width="20%" height="20%" src="https://github.com/DmitryEfimenko/ngspot/blob/main/packages/route-path-builder/package/assets/logo.png?raw=true">
</p>

<br />

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
[![spectator](https://img.shields.io/badge/tested%20with-spectator-2196F3.svg?style=flat-square)]()
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> Declarative Route Path Management in Angular Apps

This library consists of a single abstract class: `RoutePathBuilder`. See [this article](#) to learn how to use it!

## Features

- ✅ < 3kb bundle size
- ✅ A single source of truth for each path in the application
- ✅ Strong typings
- ✅ Access to Angular's dependency injection
- ✅ Use of absolute links (meaning, the generated links are absolute)
- ✅ Modularity
- ✅ Use of property chaining to reflect the nested nature of the routes
- ✅ Use of relative URL parts for the assembly of the URLs.
- ✅ Flexible return type

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [FAQ](#faq)

## Installation

### NPM

`npm install @ngspot/route-path-builder --save`

### Yarn

`yarn add @ngspot/route-path-builder`

## Usage

1. Define your routes

```ts
// app-routes.ts
import { RoutePathBuilder } from '@ngspot/route-path-builder';

@Injectable({ providedIn: 'any' })
export class AppRoutes extends RoutePathBuilder {
  products = this.childRoutes('products', RoutesForProducts);

  about() {
    return this.url('about');
  }

  contact() {
    return this.url('contact');
  }
}

// routes-for-products.ts
@Injectable({ providedIn: 'any' })
export class RoutesForProducts extends RoutePathBuilder {
  orders() {
    return this.url('orders');
  }
}
```

2. Use the `AppRoutes`:

```ts
class MyComponent {
  constructor(private appRoutes: AppRoutes) {}

  someMethod() {
    const aboutUrl = this.appRoutes.about().url;

    this.appRoutes.products.orders().navigate();
  }
}
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/DmitryEfimenko/"><img src="https://avatars.githubusercontent.com/u/2098175?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dmitry A. Efimenko</b></sub></a><br /><a href="#blog-DmitryEfimenko" title="Blogposts">📝</a> <a href="https://github.com/@ngspot/route-path-builder/commits?author=DmitryEfimenko" title="Code">💻</a> <a href="#design-DmitryEfimenko" title="Design">🎨</a> <a href="https://github.com/@ngspot/route-path-builder/commits?author=DmitryEfimenko" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/AnaBoca"><img src="https://avatars.githubusercontent.com/u/17017510?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ana Boca</b></sub></a><br /><a href="#blog-AnaBoca" title="Blogposts">📝</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

Also, thanks to [Netanel Basal](https://netbasal.medium.com/) for inspiring me to come up with this solution.

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

<div>Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
