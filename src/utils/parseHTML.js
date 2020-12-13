export default (str) => {
  var parser = new DOMParser(),
      node   = parser.parseFromString(str.trim(), "text/html")

  return node.body.firstElementChild
}