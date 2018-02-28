/**
 * 二分查找的递归实现
 */
function _recurise_binary_search(list, start, end, item) {
  let mid = Math.floor((start + end) / 2);
  if (list[mid] === item) {
    return mid;
  }
  if (start >= end) {
    return null;
  }
  if (list[mid] > item) {
    return _recurise_binary_search(list, start, mid - 1, item);
  } else {
    return _recurise_binary_search(list, mid + 1, end, item);
  }
}

const list = [1, 3, 5, 34, 90, 98];
console.log(_recurise_binary_search(list, 0, 5, 2));
