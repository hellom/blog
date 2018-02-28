"use strict";

// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

require = function (_require) {
  function require(_x, _x2, _x3) {
    return _require.apply(this, arguments);
  }

  require.toString = function () {
    return _require.toString();
  };

  return require;
}(function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      function localRequire(x) {
        return newRequire(localRequire.resolve(x));
      }

      localRequire.resolve = function (x) {
        return modules[name][1][x] || x;
      };

      var module = cache[name] = new newRequire.Module();
      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
});({4:[function(require,module,exports) {
var global = (1,eval)("this");
/*! callbacks.js - v1.0.4 - 2017-12-07
* https://github.com/simplefeel/callbacks.js
* Copyright (c) 2017 ; Licensed  */


(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.callbacks = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var optionsCache = {};
function createOptions(options) {
    var object = optionsCache[options] = {};
    options.match(/\S+/g).forEach(function (item, index) {
        object[item] = true;
    });
    return object;
}

var callbacks = function callbacks(options) {
    options = typeof options === 'string' ? optionsCache[options] || createOptions(options) : Object.assign({}, options);
    var memory,
        fired,
        firing,
        firingStart,
        firingLength,
        firingIndex,
        list = [],
        stack = !options.once && [];

    var fire = function fire(data) {
        memory = options.memory && data;
        fired = true;
        firingIndex = firingStart || 0;
        firingStart = 0;
        firingLength = list.length;
        firing = true;

        for (; list && firingIndex < firingLength; firingIndex++) {
            if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                memory = false;
                break;
            }
        }

        firing = false;
        if (list) {
            if (stack) {
                if (stack.length) {
                    fire(stack.shift());
                }
            } else if (memory) {
                console.log(memory);
                list = [];
            } else {
                self.disable();
            }
        }
    };

    var inArray = function inArray(elem, arr, i) {
        var len;
        if (arr) {
            if (arr.indexOf) {
                return arr.indexOf(elem, i);
            }

            len = arr.length;
            i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
            for (; i < len; i++) {
                if (i in arr && arr[i] === elem) {
                    return i;
                }
            }
        }

        return -1;
    };

    var self = {
        add: function add() {
            if (list) {
                var start = list.length;
                (function add(args) {
                    [].forEach.call(args, function (arg, i) {
                        var type = typeof arg === 'undefined' ? 'undefined' : _typeof(arg);
                        if (type === 'function') {
                            if (!options.unique || !self.has(arg)) {
                                list.push(arg);
                            }
                        } else if (arg && arg.length && type !== 'string') {
                            add(arg);
                        }
                    });
                })(arguments);

                if (firing) {
                    firingLength = list.length;
                } else if (memory) {
                    firingStart = start;
                    fire(memory);
                }
            }
            return this;
        },

        fire: function fire() {
            self.fireWith(this, arguments);
            return this;
        },

        fireWith: function fireWith(context, args) {
            if (list && (!fired || stack)) {
                args = args || [];
                args = [context, args.slice ? args.slice() : args];
                if (firing) {
                    stack.push(args);
                } else {
                    fire(args);
                }
            }
            return this;
        },

        disable: function disable() {
            list = stack = memory = undefined;
            return this;
        },

        has: function has(fn) {
            return fn ? inArray(fn, list) > -1 : !!(list && list.length);
        },

        remove: function remove() {
            if (list) {
                [].forEach.call(arguments, function (arg, i) {
                    var index;
                    while ((index = inArray(arg, list, index)) > -1) {
                        list.splice(index, 1);
                        if (firing) {
                            if (index <= firingLength) {
                                firingLength--;
                            }
                            if (index <= firingIndex) {
                                firingIndex--;
                            }
                        }
                    }
                });
            }
            return this;
        },

        empty: function empty() {
            list = [];
            firingLength = 0;
            return this;
        }
    };
    return self;
};

return callbacks;

})));

},{}],0:[function(require,module,exports) {
'use strict';

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function accept(fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function dispose(fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent) {
  var ws = new WebSocket('ws://localhost:57894/');
  ws.onmessage = e => {
    var data = JSON.parse(e.data);

    if (data.type === 'update') {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data.assets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let asset = _step.value;

          hmrApply(global.require, asset);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = data.assets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          let asset = _step2.value;

          if (!asset.isNew) {
            hmrAccept(global.require, asset.id);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  let parents = [];
  for (let k in modules) {
    for (let d in modules[k][1]) {
      let dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    let fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  let cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(id => hmrAccept(global.require, id));
}
},{}]},{},[0,4])