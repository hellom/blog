(function(){

    var root = this;
    var previousUnderscore = root._;
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;
    var nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind         = FuncProto.bind,
        nativeCreate = Object.create;
    var Ctor = function(){};

    // 函数式编程思想 通过_()构造出一个实例对象 比如：_([1,3])
    var _ = function(obj){
        if(obj instanceof _){
            return obj;
        }
        if(!(this instanceof _)){
            return new _(obj);
        }
        this._wrapped = obj;
    };

    if(typeof exports !== 'undefined'){
        if(typeof module !== 'undefined' && module.exports){
            exports = module.exports = _;
        }
        exports._ = _;
    }else{
        root._ = _;
    }

    _.VERSION = '1.8.3';

    var optimizeCb = function(func, context, argCount){
        if(context === void 0) return func;
        switch(argCount == null ? 3 : argCount){
            case 1: return function(value){
                return func.call(context, value);
            };
            case 2: return function(value,other){
                return func.call(context,value,other);
            };
            case 3: return function(value,index,collection){
                return func.call(context,value,index,collection);
            };
            case 4: return function(accumulator,value,index,collection){
                return func.call(context,accumulator,value,index,collection);
            };
        }
        return function(){
            return func.apply(context,arguments);
        }
    };

    var cb = function(value,context,argCount){
        if(value == null) return _.identity;
        if(_.isFunction(value)) return optimizeCb(value,context,argCount);
        if(_.isObject(value)) return _.matcher(value);
        return _.property(value);
    };

    _.identity = function(value) {
      return value;
    };
    _.iteratee = function(value,context){
        return cb(value,context,Infinity);
    };

    // var createAssigner = function(keysFunc,undefinedOnly){
    //     return function(obj){
    //         var length = arguments.length;
    //         if(length < 2 || obj == null) return obj;
    //
    //         for(var index = 1; index < length; index++){
    //             var source = arguments[index],
    //                 keys = keysFunc(source),
    //                 l = keys.length;
    //
    //             for(var i=0;i<1;i++){
    //                 var key = keys[i];
    //                 if(!undefinedOnly || obj[key] === void 0){
    //                     obj[key] = source[key];
    //                 }
    //             }
    //
    //             return obj;
    //         }
    //     }
    // };

    var baseCreate = function(prototype){
        if(!_.isObject(prototype)) return {};

        if(nativeCreate) return nativeCreate(prototype);
        Ctor.prototype = prototype;
        var result = new Ctor;
        Ctor.prototype = null;
        return result;
    };

    var property = function(key){
        return function(obj){
            return obj == null ? void 0 : obj[key];
        };
    };

    var MAX_ARRAY_INDEX = Math.pow(2,53) -1;

    var getLength = property('length');

    var isArrayLike = function(collection){
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    }

    if (typeof /./ != 'function' && typeof Int8Array != 'object') {
      _.isFunction = function(obj) {
        return typeof obj == 'function' || false;
      };
    }

    _.each = _.forEach = function(obj,iteratee,context){
        iteratee = optimizeCb(iteratee,context);

        var i,length;

        if(isArrayLike(obj)) {
            for(i = 0,length = obj.length;i<length;i++){
                iteratee(obj[i],i,obj);
            }
        }else{
            var keys = _.keys(obj);
            for(i =0,length = keys.length;i < length;i++){
                iteratee(obj[keys[i]],keys[i],obj);
            }
        }

        return obj;
    }

    _.map = _.collect = function(obj,iteratee,context){
        iteratee = cb(iteratee,context);

        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            results = Array(length);
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey],currentKey,obj);
        }
        return results;
    }

    // function createAssigner(dir){
    //     function iteratee(obj,iteratee,memo,keys,index,length){
    //         for(;index>=0 && index < length; index+=dir){
    //             var currentKey = keys ? keys[index] : index;
    //             memo = iteratee(memo,obj[currentKey],currentKey,obj);
    //         }
    //         return memo;
    //     }
    // }

    function createReduce(dir){
        function iterator(obj,iteratee,memo,keys,index,length){
            for(;index>=0 && index<length;index +=dir){
                var currentKey = keys ? keys[index] : index;
                memo = iteratee(memo,obj[currentKey],currentKey,obj);
            }
            return memo;
        }

        return function(obj,iteratee,memo,context){
            iteratee = optimizeCb(iteratee,context,4);
            var keys = !isArrayLike(obj) && _.keys(obj),
                length = (keys || obj).length,
                index = dir > 0 ? 0 :length - 1;

            if(arguments.length < 3){
                memo = obj[keys ? keys[index] : index];
                index += dir;
            }

            return iterator(obj,iteratee,memo,keys,index,length);
        };
    }

    _.reduce = _.foldl = _.inject = createReduce(1);


    _.find = _.detect = function(obj,predicate,context){
        var key;
        if(isArrayLike(obj)){
            key = _.findIndex(obj,predicate,context);
        }else{
            key = _.findKey(obj,predicate,context);
        }

        if(key !== void 0 && key !== -1) return obj[key];
    };

    _.filter = _.select = function(obj,predicate,context){
        var results = [];

        predicate = cb(predicate,context);

        _.each(obj,function(value,index,list){
            if(predicate(value,index,list))
            results.push(value);
        })
        return results;
    }

    _.reject = function(obj,predicate,context){
        return _.filter(obj,_.negate(cb(predicate)),context);
    };

    _.negate = function(predicate){
        return function(){
            return !predicate.apply(this,arguments);
        }
    }

    _.every = _.all = function(obj,predicate,context){
        predicate = cb(predicate,context);

        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;

        for(var index = 0; index <length;index++){
            var currentKey = keys ? keys[index] : index;
            if (!predicate(obj[currentKey], currentKey, obj))
              return false;
        }
        return true;
    }

    _.plunk = function(obj,key){
        return _.map(obj,_.property(key));
    }

    _.property = property;

    _.matcher = _.matches = function(attrs) {
      attrs = _.extendOwn({}, attrs);
      return function(obj) {
        return _.isMatch(obj, attrs);
      };
    };

    _.isMatch = function(object, attrs) {
      // 提取 attrs 对象的所有 keys
      var keys = _.keys(attrs), length = keys.length;

      // 如果 object 为空
      // 根据 attrs 的键值对数量返回布尔值
      if (object == null) return !length;

      // 这一步有必要？
      var obj = Object(object);

      // 遍历 attrs 对象键值对
      for (var i = 0; i < length; i++) {
        var key = keys[i];

        // 如果 obj 对象没有 attrs 对象的某个 key
        // 或者对于某个 key，它们的 value 值不同
        // 则证明 object 并不拥有 attrs 的所有键值对
        // 则返回 false
        if (attrs[key] !== obj[key] || !(key in obj)) return false;
      }

      return true;
    };



    _.keys = function(obj) {
      // 容错
      // 如果传入的参数不是对象，则返回空数组
      if (!_.isObject(obj)) return [];

      // 如果浏览器支持 ES5 Object.key() 方法
      // 则优先使用该方法
      if (nativeKeys) return nativeKeys(obj);

      var keys = [];

      // own enumerable properties
      for (var key in obj)
        // hasOwnProperty
        if (_.has(obj, key)) keys.push(key);

      // Ahem, IE < 9.
      // IE < 9 下不能用 for in 来枚举某些 key 值
      // 传入 keys 数组为参数
      // 因为 JavaScript 下函数参数按值传递
      // 所以 keys 当做参数传入后会在 `collectNonEnumProps` 方法中改变值
      if (hasEnumBug) collectNonEnumProps(obj, keys);

      return keys;
    };

    _.isObject = function(obj) {
      var type = typeof obj;
      return type === 'function' || type === 'object' && !!obj;
    };





    _.findIndex = createPredicateIndexFinder(1);
    _.findLastIndex = createPredicateIndexFinder(-1);

    function createPredicateIndexFinder(dir){
        return function(array,predicate,context){
            predicate = cb(predicate,context);

            var length = getLength(array);

            var index = dir > 0 ? 0 : length - 1;
            for(; index >=0 && index < length;index += dir){
                if(predicate(array[index],index,array)){
                    return index;
                }
            }
            return -1;
        }
    }

    _.random = function(min, max) {
      if (max == null) {
        max = min;
        min = 0;
      }
      return min + Math.floor(Math.random() * (max - min + 1));
    };

    _.shuffle = function(obj){
        var set = isArrayLike(obj) ? obj : _.values(obj);
        var length = set.length;

        var shuffled = Array(length);
        for(var index = 0,rand; index < length;index++){
            rand = _.random(0,index);
            if(rand !== index) shuffled[index] = shuffled[rand];
            shuffled[rand] = set[index];
        }
        return shuffled;
    }

    _.first = _.head = _.take = function(array,n,guard){
        if(array == null) return void 0;
        if(n == null || guard) return array[0];
        return _.initial(array,array.length - n);
    };

    _.initial = function(array,n,guard){
        return slice.call(array,0,Math.max(0,array.length - (n == null || guard ? 1 : n)));
    }

    _.uniq = _.unique = function(array,isSorted,iteratee,context){
        if(!_.isBoolean(isSorted)){
            context = iteratee;
            iteratee = isSorted;
            isSorted = false;
        }
        if(iteratee != null){
            iteratee = cb(iteratee,context);
        }
        var result = [];
        var seen = [];

        for(var i=0 ,length = getLength(array);i<length;i++){
            var value = array[i],
                computed = iteratee ? iteratee(value,i,array) : value;
            if(isSorted){
                if(!i || seen !== computed) result.push(value);
                seen = computed;
            }else if(iteratee){
                if(!_.contains(seen,computed)){
                    seen.push(computed);
                    result.push(value);
                }
            }else if(!_.contains(result,value)){
                result.push(value);
            }
        }

        return result;
    }

    _.contains = _.includes = _.include = function(obj,item,fromIndex,guard){
        if(!isArrayLike(obj)) obj = _.values(obj);
        if(typeof fromIndex != 'number' || guard) fromIndex = 0;
        return _.indexOf(obj,item,fromIndex) >= 0;
    }

    _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);

    function createIndexFinder(dir, predicateFind, sortedIndex) {
      // API 调用形式
      // _.indexOf(array, value, [isSorted])
      // _.indexOf(array, value, [fromIndex])
      // _.lastIndexOf(array, value, [fromIndex])
      return function(array, item, idx) {
        var i = 0, length = getLength(array);

        // 如果 idx 为 Number 类型
        // 则规定查找位置的起始点
        // 那么第三个参数不是 [isSorted]
        // 所以不能用二分查找优化了
        // 只能遍历查找
        if (typeof idx == 'number') {
          if (dir > 0) { // 正向查找
            // 重置查找的起始位置
            i = idx >= 0 ? idx : Math.max(idx + length, i);
          } else { // 反向查找
            // 如果是反向查找，重置 length 属性值
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
          }
        } else if (sortedIndex && idx && length) {
          // 能用二分查找加速的条件
          // 有序 & idx !== 0 && length !== 0

          // 用 _.sortIndex 找到有序数组中 item 正好插入的位置
          idx = sortedIndex(array, item);

          // 如果正好插入的位置的值和 item 刚好相等
          // 说明该位置就是 item 第一次出现的位置
          // 返回下标
          // 否则即是没找到，返回 -1
          return array[idx] === item ? idx : -1;
        }

        // 特判，如果要查找的元素是 NaN 类型
        // 如果 item !== item
        // 那么 item => NaN
        if (item !== item) {
          idx = predicateFind(slice.call(array, i, length), _.isNaN);
          return idx >= 0 ? idx + i : -1;
        }

        // O(n) 遍历数组
        // 寻找和 item 相同的元素
        // 特判排除了 item 为 NaN 的情况
        // 可以放心地用 `===` 来判断是否相等了
        for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
          if (array[idx] === item) return idx;
        }

        return -1;
      };
    }

    _.sortedIndex = function(array,obj,iteratee,context){
        iteratee = cb(iteratee,context,1);
        var value = iteratee(obj);

        var low = 0,high = getLength(array);

        while(low < high){
            var mid = Math.floor((low + high) / 2);
            if(iteratee(array[mid] < value)){
                low = mid + 1;
            }else{
                high = mid;
            }
        }

        return low;
    }




    _.isBoolean = function(obj){
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    }


    _.intersection = function(array){
        var result = [];
        var argsLength = arguments.length;
        for(var i = 0,length = getLength(array);i < length ; i++){
            var item = array[i];
            if(_.contains(result,item)) continue;
            for(var j = 1;j < argsLength;j++){
                if(!_.contains(arguments[j],item)) break;
            }

            if(j === argsLength)
                result.push(item);
        }
        return result;
    }

    _.unzip = function(array) {
      var length = array && _.max(array, getLength).length || 0;
      var result = Array(length);

      for (var index = 0; index < length; index++) {
        result[index] = _.pluck(array, index);
      }
      return result;
    };

    _.zip = function() {
      return _.unzip(arguments);
    };

    _.pluck = function(obj, key) {
      return _.map(obj, _.property(key));
    };

    _.max = function(obj, iteratee, context) {
      var result = -Infinity, lastComputed = -Infinity,
          value, computed;

      // 单纯地寻找最值
      if (iteratee == null && obj != null) {
        // 如果是数组，则寻找数组中最大元素
        // 如果是对象，则寻找最大 value 值
        obj = isArrayLike(obj) ? obj : _.values(obj);

        for (var i = 0, length = obj.length; i < length; i++) {
          value = obj[i];
          if (value > result) {
            result = value;
          }
        }
      } else {  // 寻找元素经过迭代后的最值
        iteratee = cb(iteratee, context);

        // result 保存结果元素
        // lastComputed 保存计算过程中出现的最值
        // 遍历元素
        _.each(obj, function(value, index, list) {
          // 经过迭代函数后的值
          computed = iteratee(value, index, list);
          // && 的优先级高于 ||
          if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
            result = value;
            lastComputed = computed;
          }
        });
      }

      return result;
    };

    // Function (ahem) Functions
    // 函数的扩展方法
    // 共 14 个扩展方法
    // ------------------

    _.throttle = function(func,wait,options){
        var context,args,result;
        var timeout = null;

        var previous = 0;
        if(!options)
            options = {};
        var later = function(){
            previous = options.leading === false ? 0 : _.now();
            timeout = null;

            result = func.apply(context,args);

            if(!timeout)
                context = args = null;
        };

        return function(){
            var now = _.now();
            // console.log(now);

            if(!previous && options.leading === false)
                previous = now;
            // console.log(wait+"@@@");
            // console.log(now+"**");
            // console.log(previous+"^^^");
            var remaining = wait - (now -previous);
            // console.log(remaining+"~~~");
            context = this;
            args = arguments;

            if(remaining <= 0 || remaining > wait){
                if(timeout){
                    clearTimeout(timeout);
                    timeout = null;
                }

                previous = now;

                result = func.apply(context,args);
                if(!timeout)
                    context = args = null;
            }else if(!timeout && options.trailing !== false){
                timeout = setTimeout(later,remaining);
            }

            return result;
        }
    }

    _.now = Date.now || function() {
      return new Date().getTime();
    };

    _.debounce = function(func,wait,immediate){
        var timeout , args, context,timestamp,result;

        var later = function(){
            var last = _.now() - timestamp;
            if(last < wait && last >=0){
                timeout = setTimeout(later,wait - last);
            }else{
                timeout = null;

                if(!immediate){
                    result = func.apply(context,args);
                    if(!timeout)
                        context = args = null
                }
            }
        };

        return function(){
            context = this;
            args = arguments;
            timestamp = _.now();
            var callNow = immediate && !timeout;
            if(!timeout)
                timeout = setTimeout(later,wait);
            if(callNow){
                result = func.apply(context,args);
                context = args = null;
            }
            return result;
        }


    }

    _.compose = function(){
        var args = arguments;
        var start = args.length - 1;
        return function(){
            var i = start;
            var result = args[start].apply(this,arguments);
            while(i--){
                result = args[i].call(this.result);
            }
            return result;
        };
    }

    var createAssigner = function(keysFunc, undefinedOnly) {
      // 返回函数
      // 经典闭包（undefinedOnly 参数在返回的函数中被引用）
      // 返回的函数参数个数 >= 1
      // 将第二个开始的对象参数的键值对 "继承" 给第一个参数
      return function(obj) {
        var length = arguments.length;
        // 只传入了一个参数（或者 0 个？）
        // 或者传入的第一个参数是 null
        if (length < 2 || obj == null) return obj;

        // 枚举第一个参数除外的对象参数
        // 即 arguments[1], arguments[2] ...
        for (var index = 1; index < length; index++) {
          // source 即为对象参数
          var source = arguments[index],
              // 提取对象参数的 keys 值
              // keysFunc 参数表示 _.keys
              // 或者 _.allKeys
              keys = keysFunc(source),
              l = keys.length;

          // 遍历该对象的键值对
          for (var i = 0; i < l; i++) {
            var key = keys[i];
            // _.extend 和 _.extendOwn 方法
            // 没有传入 undefinedOnly 参数，即 !undefinedOnly 为 true
            // 即肯定会执行 obj[key] = source[key]
            // 后面对象的键值对直接覆盖 obj
            // ==========================================
            // _.defaults 方法，undefinedOnly 参数为 true
            // 即 !undefinedOnly 为 false
            // 那么当且仅当 obj[key] 为 undefined 时才覆盖
            // 即如果有相同的 key 值，取最早出现的 value 值
            // *defaults 中有相同 key 的也是一样取首次出现的
            if (!undefinedOnly || obj[key] === void 0)
              obj[key] = source[key];
          }
        }

        // 返回已经继承后面对象参数属性的第一个参数对象
        return obj;
      };
    };

    _.allKeys = function(obj) {
      // 容错
      // 不是对象，则返回空数组
      if (!_.isObject(obj)) return [];

      var keys = [];
      for (var key in obj) keys.push(key);

      // Ahem, IE < 9.
      // IE < 9 下的 bug，同 _.keys 方法
      if (hasEnumBug) collectNonEnumProps(obj, keys);

      return keys;
    };

    _.extend = createAssigner(_.allKeys);

    // _.extendOwn = _.assign = createAssigner(_.keys);




    var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');

    // IE < 9 下不能用 for in 来枚举的 key 值集合
    // 其实还有个 `constructor` 属性
    // 个人觉得可能是 `constructor` 和其他属性不属于一类
    // nonEnumerableProps[] 中都是方法
    // 而 constructor 表示的是对象的构造函数
    // 所以区分开来了
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                        'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

    // obj 为需要遍历键值对的对象
    // keys 为键数组
    // 利用 JavaScript 按值传递的特点
    // 传入数组作为参数，能直接改变数组的值
    function collectNonEnumProps(obj, keys) {
      var nonEnumIdx = nonEnumerableProps.length;
      var constructor = obj.constructor;

      // 获取对象的原型
      // 如果 obj 的 constructor 被重写
      // 则 proto 变量为 Object.prototype
      // 如果没有被重写
      // 则为 obj.constructor.prototype
      var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

      // Constructor is a special case.
      // `constructor` 属性需要特殊处理 (是否有必要？)
      // see https://github.com/hanzichi/underscore-analysis/issues/3
      // 如果 obj 有 `constructor` 这个 key
      // 并且该 key 没有在 keys 数组中
      // 存入 keys 数组
      var prop = 'constructor';
      if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

      // 遍历 nonEnumerableProps 数组中的 keys
      while (nonEnumIdx--) {
        prop = nonEnumerableProps[nonEnumIdx];
        // prop in obj 应该肯定返回 true 吧？是否有判断必要？
        // obj[prop] !== proto[prop] 判断该 key 是否来自于原型链
        // 即是否重写了原型链上的属性
        if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
          keys.push(prop);
        }
      }
    }

    _.clone = function(obj){
        if(!_.isObject(obj))
            return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({},obj);
    }

    _.isArray = nativeIsArray || function(obj) {
      return toString.call(obj) === '[object Array]';
    };

    var escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      // 以上四个为最常用的字符实体
      // 也是仅有的可以在所有环境下使用的实体字符（其他应该用「实体数字」，如下）
      // 浏览器也许并不支持所有实体名称（对实体数字的支持却很好）
      "'": '&#x27;',
      '`': '&#x60;'
    };

    // _.invert 方法将一个对象的键值对对调
    // unescapeMap 用于解码
    // var unescapeMap = _.invert(escapeMap);

    // Functions for escaping and unescaping strings to/from HTML interpolation.
    var createEscaper = function(map) {
        debugger
      var escaper = function(match) {
        return map[match];
      };

      // Regexes for identifying a key that needs to be escaped
      // 正则替换
      // 注意下 ?:
      var source = '(?:' + _.keys(map).join('|') + ')';

      // 正则 pattern
      var testRegexp = RegExp(source);

      // 全局替换
      var replaceRegexp = RegExp(source, 'g');
      return function(string) {
        string = string == null ? '' : '' + string;
        return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
      };
    };

    // Escapes a string for insertion into HTML, replacing &, <, >, ", `, and ' characters.
    // 编码，防止被 XSS 攻击等一些安全隐患
    _.escape = createEscaper(escapeMap);














    // 将_对象上的方法加载到_.prototype原型上 使_()实例能够访问_对象上的方法
    // _.mixin = function(obj){
    //     _.each(_.functions(obj),function(name){
    //         var func = _[name] = obj[name];
    //         _.prototype[name] = function(){
    //             var args = [this._wrapped];
    //             push.apply(args,arguments);
    //             return result(this,func.apply(_,args));
    //         }
    //     })
    // }
    //
    // _.mixin(_);



}.call(this))
