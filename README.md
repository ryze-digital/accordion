# RYZE Digital Accordion

![Run linter(s) workflow status](https://github.com/ryze-digital/accordion/actions/workflows/run-lint.yml/badge.svg)

## Install

```sh
npm i @ryze-digital/accordion
```

## Usage

### Scss

```scss
@use "@ryze-digital/accordion";
```

Use the provided `configure` mixin to define your accordion defaults. A complete list of all possible configurations can
be found in [/src/styles/_config.scss](src/styles/_config.scss).

```scss
@include accordion.configure(...);
```

There is a separate mixin for each element in the accordion so styles can be applied to any markup.

```scss
.accordion {
    .item {
        @include accordion.item();
    }
    .title {
        @include accordion.title();
        @include accordion.icon-closed();
    }
    [open] {
        .title {
            @include accordion.icon-opened();
        }
    }
    .content {
        @include accordion.content();
    }
}
```




### JavaScript

```js
import {Accordion} from '@ryze-digital/accordion';

new Accordion({...}).init();
```

## Demos

Checkout this repository and use the [/demos](/demos) folder as document root to see a running demo in the browser. 

- [Basic use case](/demos/basic.html)
- [FAQ](/demos/faq.html)
- [Event Binding](/demos/event-binding.html)