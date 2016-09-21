const afrom = require("../construction/afrom");
const foldl = require("../folding/foldl");
const push = require("../mutation/push");
const some = require("../folding/some");

module.exports = uniqueBy = f => foldl(
   acc => x => some(f(x)) (acc)
    ? acc
    : push(x) (acc)
 ) ([]);