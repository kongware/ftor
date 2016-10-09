const afrom = require("../construction/afrom");
const foldl = require("../folding/foldl");
const destructivePush = require("../mutation/destructivePush");
const some = require("../folding/some");

module.exports = uniqueBy = f => foldl(
   acc => x => some(f(x)) (acc)
    ? acc
    : destructivePush(x) (acc)
 ) ([]);