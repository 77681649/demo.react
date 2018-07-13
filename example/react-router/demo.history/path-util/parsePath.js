const { parsePath } = require("history/PathUtils");
const actual = parsePath("/user/list?order_key=id&order_dir=asc#tag");

console.log(actual);
