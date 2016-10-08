const concat_ = require("./concat_");
const foldlk = require("../folding/foldlk");

module.exports = concatMap = f => foldlk(acc => x => k => k(concat_(acc) (f(x)))) ([]);