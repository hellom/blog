var di = {
    container: {
        get: function(name){
            var cons = this[name];
            return new cons()
        }
    }
};

di.service = function (name, container, Constructor) {
    defineLazyProperty(name, () => new Constructor(container));
};

function defineLazyProperty(name, getter) {
    Object.defineProperty(di.container, name, {
        configurable: true,
        get: function () {
            var obj = getter();
            Object.defineProperty(di.container, name, {
                configurable: false,
                value: obj
            });
            return obj;
        }
    });
}


di.service('foo', 'boo' , function foo(bar) {
    function Foo() {
        this.bar = bar
    }
    Foo.prototype.greeting = function () {
        console.log(this.bar);
    }
    return Foo;
});
var foo = di.container.get('foo');
foo.greeting();