

!function(ob){

    ob.ajaxPreFilter = function (funs) {
        window.soucexhr = window.soucexhr || window.XMLHttpRequest;

        //代理xhr对象
        window.XMLHttpRequest = function () {
            this.xhr = new window.soucexhr();
            for (var attr in this.xhr) {
                var type = typeof this.xhr[attr];
                console.log(this.xhr)
                if (type === 'function') {
                    this[attr] = preFilter(attr)
                } else {
                    Object.defineProperty(this, attr, {
                        get: getProperty(attr),
                        set: setProperty(attr)
                    })
                }

            }
        }

        //拦截xhr方法，添加钩子方法
        function preFilter(fun) {
            return function () {
                var args = [].slice.call(arguments);
                // 钩子方法返回 true，则不执行后续的原始xhr方法
                if (funs[fun] && funs[fun].call(this, args, this.xhr)) {
                    return;
                }
                return this.xhr[fun].apply(this.xhr, args);
            }
        }


        function getProperty(attr) {
            return function () {
                return this.hasOwnProperty(attr + '_') ? this[attr + "_"] : this.xhr[attr]
            }
        }

        function setProperty(attr) {
            return function (f) {
                var xhr = this.xhr;
                var that = this;
                if (attr.indexOf("on") !== 0) {
                    this[attr + "_"] = f;
                    return
                }
                if (funs[attr]) {
                    xhr[attr] = () => {
                        funs[attr](that) || f.apply(xhr, arguments)
                    }
                } else {
                    xhr[attr] = f;
                }
            }
        }

        return window.soucexhr

    }

    ob.unPreFilter = function () {
        if (window.soucexhr) {
            XMLHttpRequest = window.soucexhr;
        }
        window.soucexhr = undefined;
    }

}(window)