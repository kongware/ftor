const _concat = require("./_concat");
const foldlk = require("../folding/foldlk");

module.exports = concatMap = f => foldlk(acc => x => k => k(_concat(acc) (f(x)))) ([]);