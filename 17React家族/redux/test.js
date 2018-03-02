var fEnhancer = function(originF) {
  return function(...args) {
    console.log("this is fEnhancer before");
    var r = originF(...args);
    console.log("this is fEnhancer after");
    return r;
  };
};

var hEnhancer = function(originF) {
  return function(...args) {
    console.log("this is hEnhancer before");
    var r = originF(...args);
    console.log("this is hEnhancer after");
    return r;
  };
};

var gEnhancer = function(originF) {
  return function(...args) {
    console.log("this is gEnhancer before");
    var r = originF(...args);
    console.log("this is gEnhancer after");
    return r;
  };
};

function justPrint() {
  console.log("justPrint...");
}

var enhancerArray = [fEnhancer, hEnhancer, gEnhancer];
function enhancerFun2(originF) {
  return enhancerArray.reduce((a, b) => (...args) => a(b(...args)))(originF);
}
enhancerFun2(justPrint)();
// console.log(enhancerFun2(justPrint));

// fEnhancer(hEnhancer(gEnhancer(justPrint)))();

// var enhancerArray = [gEnhancer, hEnhancer, fEnhancer];
// function enhancerFun(originF) {
//   let of = originF;
//   enhancerArray.forEach(enhancer => {
//     of = enhancer(of);
//   });
//   return of;
// }

// enhancerFun(justPrint)();
