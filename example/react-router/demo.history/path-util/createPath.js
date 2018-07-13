const { createPath } = require("history/PathUtils");

var actual = createPath({
  pathname: "/user/list",
  search: "?order_key=id&order_dir=asc",
  hash: "#tag"
});
console.log(actual);

var actual = createPath({
  pathname: "/user/list",
  search: "order_key=id&order_dir=asc",
  hash: "tag"
});
console.log(actual);

var actual = createPath({ hash: "tag" });
console.log(actual);
