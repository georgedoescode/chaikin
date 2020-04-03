# CX 🎨

**A 💀 simple library created to provide a better canvas development experience.**

There are a couple of things I wish `canvas` did:

-   Scale to the DPR of the screen
-   Allow definition of custom drawing methods without having to extend prototypes

CX aims to provide both of these whilst staying out of the way and not disrupting your workflow.

## Installation

### 1. Package Manager

```bash
npm i @georgedoescode/cx
```

### 2. CDN

```html
<script src="https://unpkg.com/@georgedoescode/cx">
```

## Usage

**Browser**

The _(probably)_ easiest and quickest way of getting started with cx is to grab the library from `unpkg`, pop it in a `script` tag and start having a poke.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CX Example</title>
    </head>
    <body>
        <div class="wrapper"></div>
        <script src="https://unpkg.com/@georgedoescode/cx"></script>
        <script>
            // Create a new canvas, append to the DOM
            const { ctx } = cx.createCanvas();

            // Draw as you usually would!
            ctx.moveTo(0, 0);
            ctx.lineTo(200, 200);
        </script>
    </body>
</html>
```

**Module bundlers**

CX exports the function `createCanvas`, this can be used to build a new cx instance.

```javascript
import { createCanvas } from '@georgedoescode/cx';

// Create a new canvas, append to the DOM
const { ctx } = createCanvas();

// Draw as you usually would!
ctx.moveTo(0, 0);
ctx.lineTo(200, 200);
```

**Note:** CX provides an es module (`cx.es.js`) build which should be used by Webpack 2+ / rollup etc, for everything else there is a UMD build (`cx.min.js`).

## Documentation

### `createCanvas`

Creates a new cx instance. A cx instance has 2 parts: `element` and `context`.

```javascript
{
    ctx: {
        _base, //  CanvasRenderingContext2D (should never need to be accessed directly)
        registerCustomMethod // (fn) - register custom drawing method
    },
    element: {
        el, // <canvas> DOM element
        setPXDensity // (fn) - scale <canvas> element and context
    }
}
```

**Example**

```javascript
import { createCanvas } from '@georgedoescode/cx';

const { ctx, element } = createCanvas({
    width: 640,
    height: 480,
});

// ctx can be used in exactly the same way as a CanvasRenderingContext2D instance
ctx.lineWidth = 2;

ctx.moveTo(0, 0);
ctx.lineTo(0, 0, 200, 200);
```

**Options**

| Name     | Type          | Default                   | Description                            |
| -------- | ------------- | ------------------------- | -------------------------------------- |
| `width`  | `Integer`     | `400`                     | The width of the canvas                |
| `height` | `Integer`     | `400`                     | The height of the canvas               |
| `mount`  | `DOM Element` | `document.body`           | Where the `canvas` element is appended |
| `dpr`    | `Integer`     | `window.devicePixelRatio` | Pixel density.                         |

### `ctx.registerCustomMethod`

Register a custom drawing method to `ctx`.

**Example**

```javascript
import { createCanvas } from '@georgedoescode/cx';

const { ctx } = createCanvas({
    width: 640,
    height: 480,
});

// ctx.base is always passed as the first argument
ctx.registerCustomMethod('line', (ctx, x0, y0, x1, y1) => {
    ctx.moveTo(0, 0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
});

// tada! we can call our custom method on ctx
ctx.line(0, 0, 200, 200);
```

**Options**

| Name        | Type                       | Default     | Description                                      |
| ----------- | -------------------------- | ----------- | ------------------------------------------------ |
| `ctx`       | `CanvasRenderingContext2D` | `null`      | The native canvas context                        |
| `arguments` | `any`                      | `undefined` | Arbitrary additional arguments for custom method |
