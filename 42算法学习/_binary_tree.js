var nodes = {
  node: 6,
  left: {
    node: 5,
    left: {
      node: 4
    },
    right: {
      node: 3
    }
  },
  right: {
    node: 2,
    right: {
      node: 1
    }
  }
}

var result = []
var dfs = function(root) {
  if (root.node) {
    result.push(root.node)
    root.left && dfs(root.left)
    root.right && dfs(root.right)
  }
}
dfs(nodes)

var maxDepth = function(root) {
  return find(root)
  function find(node) {
    if (node === null) {
      return 0
    }
    var deepL = 1
    var deepR = 1
    if (node.left) {
      deepL += find(node.left)
    }
    if (node.right) {
      deepR += find(node.right)
    }

    return deepL > deepR ? deepL : deepR
  }
}

console.log(maxDepth(nodes))
