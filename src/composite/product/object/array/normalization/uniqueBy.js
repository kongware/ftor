const afrom = require("../construction/afrom");
const foldl = require("../folding/foldl");
const destructivePush = require("../mutation/destructivePush");
const some = require("../folding/some");

module.exports = uniqueBy = f => foldl(
   acc => a => some(f(a)) (acc)
    ? acc
    : destructivePush(a) (acc)
 ) ([]);