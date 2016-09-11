const foldlk = require("../folding/foldlk");

module.exports = mapcat = f => foldlk(acc => x => k => k(acc.concat(f(x)))) ([]);