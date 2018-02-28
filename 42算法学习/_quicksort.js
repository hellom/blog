/**
 * 快速排序，分而治之思想的一种实现,时间复杂负O(nlogn)
 * @param {} array
 */
function quicksort(array) {
  if (array.length < 2) {
    return array;
  } else {
    let pivot = array[0];
    let less = array.slice(1).filter(function(el) {
      return el <= pivot;
    });
    let greater = array.slice(1).filter(function(el) {
      return el > pivot;
    });
    return quicksort(less).concat([pivot], quicksort(greater));
  }
}

console.log(quicksort([10, 5, 2, 3]));
