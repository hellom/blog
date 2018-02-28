/**
 * 二分查找，用于有序的数组,时间复杂度O(logn)
 * @param {array} list
 * @param {key} item
 */
function _binary_search(list, item) {
  let low = 0;
  let high = list.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    let guess = list[mid];
    if (guess === item) {
      return mid;
    }
    if (guess > item) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return null;
}

const list = [1, 3, 5, 34, 90, 98];
console.log(_binary_search(list, 2));
