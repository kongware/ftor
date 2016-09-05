const afrom = require("../construction/afrom");

module.exports = uniqueBy = f => foldl(
   acc => x => some(f(x)) (acc)
    ? acc
    : push(x) (acc)
 ) ([]);