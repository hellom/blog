/**
 * 继承：
 * 子类继承父类的属性和方法，包括父类的类属性和特权属性以及父类原型对象上的属性和方法
 */

//原型式继承
//缺点是：子类无法继承父类的类属性和特权属性

// var A = function(){};
// A.prototype = {
//     aa: function(){
//         console.log(1);
//     }
// }

// function bridge(){}
 
// bridge.prototype = A.prototype;

// function B(){}

// B.prototype = new bridge();

// var a = new A();
// var b = new B();

// console.log(a.aa == b.aa);
// console.log(A.prototype == B.prototype);

// A.prototype.bb = function() {
//     console.log(bb);
// }
// console.log(a.bb == b.bb);

// B.prototype.cc = function() {
//     console.log(cc);
// }
// console.log(a.cc == b.cc);

// console.log(b instanceof A);
// console.log(b instanceof B);

// var B = Object.create(A.prototype);
// console.log(A.prototype == B.prototype);

/**
 * 原型继承的简便写法
 */

// function A() {
//     this.aa = 2
// }
// A.prototype = {
//     aa: 1
// }
// function B() {}
// B.prototype.__proto__ = A.prototype;

// var b = new B();

// console.log(b.aa);




