(function(factory) {

  // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
  // We use `self` instead of `window` for `WebWorker` support.
  // 定义全局对象 root 变量，在浏览器环境下为 window，在 服务器 环境下为 global, self 指向window
  var root = (typeof self == 'object' && self.self === self && self) ||
            (typeof global == 'object' && global.global === global && global);

  // Set up Backbone appropriately for the environment. Start with AMD.
  // 支持AMD规范
  // 使用define函数定义Backbone模块, 依赖`underscore`, `jquery`, `exports`三个模块.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone = factory(root, exports, _, $);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  // 支持 commonJs 规范(NodeJS使用的规范, 主要用于服务器端, 所以jQuery非必须).
  // CommonJS规范中, exports是用于导出模块的对象.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore'), $;
    try { $ = require('jquery'); } catch (e) {}
    factory(root, exports, _, $);

  // Finally, as a browser global.
  // 以上两种情况都没有，则以最简单的执行函数方式，将函数的返回值作为全局对象Backbone
  } else {
    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
  }

})(function(root,Backbone,_,$){
    var eventSplitter = /\s+/;

    var _listening;

    var Events = Backbone.Events = {};

    var eventsApi = function(iteratee, events, name, callback, opts) {
        var i = 0 , names;
        if(name && typeof name === 'object'){
            if(callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
            for (names = Object.keys(name); i < names.length; i++) {
                events = eventsApi(iteratee, events, names[i], name[name[i]], opts);
            } 
        } else if(name && eventSplitter.test(name)) {
            for(names = name.split(eventSplitter); i < names.length; i++){
                events = iteratee(events, names[i], callback, opts)
            }
        } else {
            events = iteratee(events, name, callback, opts)
        }

        return events;
        
    }

    Events.on = function(name, callback, context) {
        this._events = eventsApi(onApi, this._events || {}, name, callback, {
            context: context,
            ctx: this,
            listening: _listening
        })

        if(_listening) {
            var listeners = this._listeners || (this._listeners = {});
            listeners[_listening.id] = _listening;
            _listening.interop = false;
        }

        return this;
    }

    var onApi = function(events, name, callback, options) {
        if(callback) {
            var handlers = events[name] || (events[name] = []);
            var context = options.context, ctx = options.ctx, listening = options.listening;
            if(listening) listening.count++;
            handlers.push({callback: callback , context: context, ctx: context || ctx ,
            listening: listening})
        }
        return events;
    }
})



