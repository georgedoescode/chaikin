function createCanvasElement(width, height) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function setCanvasPxDensity(canvas, density) {
  var canvasRect = canvas.getBoundingClientRect();
  var ctx = canvas.getContext('2d');
  canvas.width = canvasRect.width * density;
  canvas.height = canvasRect.height * density;
  canvas.style.width = canvasRect.width + 'px';
  canvas.style.height = canvasRect.height + 'px';
  ctx.scale(density, density);
}

function mountCanvasToDOM(canvas, mount) {
  mount.appendChild(canvas);
}

function createCustomContext(context) {
  var customCtx = {
    _base: context
  };

  var _loop = function _loop(prop) {
    Object.defineProperty(customCtx, prop, {
      get: function get() {
        return typeof customCtx._base[prop] === 'function' ? customCtx._base[prop].bind(context) : customCtx._base[prop];
      },
      set: function set(value) {
        customCtx._base[prop] = value;
      }
    });
  };

  for (var prop in context) {
    _loop(prop);
  }

  customCtx.registerCustomMethod = function (key, value) {
    customCtx[key] = function () {
      return value.apply(void 0, [customCtx._base].concat(Array.prototype.slice.call(arguments)));
    };
  };

  return customCtx;
}

var DEFAULTS = {
  width: 640,
  height: 480,
  mount: document.body,
  dpr: window.devicePixelRatio
};
function createCanvas(opts) {
  var options = Object.assign(DEFAULTS, opts);
  var canvasEl = createCanvasElement(options.width, options.height);
  var ctx = createCustomContext(canvasEl.getContext('2d'));
  mountCanvasToDOM(canvasEl, options.mount);
  setCanvasPxDensity(canvasEl, options.dpr);
  return {
    ctx: ctx,
    element: {
      el: canvasEl,
      setPXDensity: function setPXDensity(density) {
        setCanvasPxDensity(canvasEl, density);
      }
    }
  };
}

export { createCanvas };
