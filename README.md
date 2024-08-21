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

Use the provided `configure` mixin to define your accordion defaults.

```scss
@include accordion.configure(...);
```

<details>
<summary>List of available configure options</summary>

| Option                 | Type            | Default                      | Description                                                 |
|------------------------|-----------------|------------------------------|-------------------------------------------------------------|
| padding                | Map             |                              | The shared padding used for title and content               |
| padding.right          | Number          | `0`                          |                                                             |
| padding.left           | Number          | `0`                          |                                                             |
| title                  | Map             |                              | Configuration options especially for the title              |
| title.padding          | Map             |                              |                                                             |
| title.padding.top      | Number          | `scss-utilities.rem-calc(8)` |                                                             |
| title.padding.bottom   | Number          | `scss-utilities.rem-calc(8)` |                                                             |
| content                | Map             |                              | Configuration options especially for the content            |
| content.padding        | Map             |                              |                                                             |
| content.padding.top    | Number          | `scss-utilities.rem-calc(8)` |                                                             |
| content.padding.bottom | Number          | `scss-utilities.rem-calc(8)` |                                                             |
| icon                   | Map             |                              | Configure which icons from your icon font should be used    |
| icon.position          | String (Quoted) | `"after"`                    | Should the icons be inserted before or after the title      |
| icon.top               | Number          | `null`                       | Top value for absolute position                             |
| icon.closed            | String (Quoted) | `null`                       | The UTF-8 character of the icon used on a closed accordion  |
| icon.opened            | String (Quoted) | `null`                       | The UTF-8 character of the icon used on an opened accordion |
| icon.spacing           | Number          | `null`                       | The gap between icon and title                              |

Check out [the actual configure mixin](src/styles/_config.scss) for better understanding.
</details>

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

<details>
<summary>List of available parameters for Accordion class</summary>

| Option              | Type        | Default                                                                           | Description                                                               |
|---------------------|-------------|-----------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| el                  | HTMLElement | `document.querySelector('[data-accordion]')`                                      | Container to which the library should be bound                            |
| allowMultipleOpened | boolean     | `false`                                                                           | Should it be possible to have multiple accordions opened at the same time |
| allowDeepLink       | boolean     | `true`                                                                            | Open and scroll to accordion item based on URL hash                       |
| animation           | object      | <pre>{<br>&nbsp;&nbsp;duration: 400,<br>&nbsp;&nbsp;easing: 'ease-out'<br>}</pre> |                                                                           |

</details>

## Demos

Checkout this repository and use the [/demos](/demos) folder as document root to see a running demo in the browser. 

- [Basic use case](/demos/basic.html)
- [FAQ](/demos/faq.html)
- [Event Binding](/demos/event-binding.html)