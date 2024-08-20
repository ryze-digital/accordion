# RYZE Digital Accordion

![Run linter(s) workflow status](https://github.com/ryze-digital/accordion/actions/workflows/run-lint.yml/badge.svg)

## Install

```sh
npm i @ryze-digital/accordion
```

## Usage

### HTML

Class names can be changed if necessary, as long as you include the mixins (see Scss) correctly.

```html
<div class="accordion" data-accordion>
    <details class="item">
        <summary class="title" data-title>
            Your accordion title 1
        </summary>
        <div class="content" data-content>
            Your accordion content 1
        </div>
    </details>
    <details class="item">
        <summary class="title" data-title>
            Your accordion title 2
        </summary>
        <div class="content" data-content>
            Your accordion content 2
        </div>
    </details>
</div>
```

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
import { Accordion } from '@ryze-digital/accordion';

new Accordion({...}).init();
```

## Demos

Checkout this repository and use the [/demos](/demos) folder as document root to see a running demo in the browser. 

- [Basic use case](/demos/basic.html)
- [FAQ](/demos/faq.html)
- [Event Binding](/demos/event-binding.html)