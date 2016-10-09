const _concat = require("./_concat");
const foldlk = require("../folding/foldlk");

module.exports = concatMap = f => foldlk(acc => a => k => k(_concat(acc) (f(a)))) ([]);