const afrom = require("../construction/afrom");
const foldl = require("../folding/left/foldl");
const destructivePush = require("../mutation/destructivePush");
const some = require("../folding/left/derived/some");

module.exports = dedupeBy = f => foldl(
   acc => x => some(f(x)) (acc)
    ? acc
    : destructivePush(x) (acc)
 ) ([]);