const afrom = require("../construction/afrom");
const foldl = require("../folding/foldl");
const push = require("../mutation/push");
const some = require("../folding/some");

module.exports = uniqueBy = f => foldl(
   acc => a => some(f(a)) (acc)
    ? acc
    : push(a) (acc)
 ) ([]);