const concat = require("./concat");
const flip = require("../../../../../polymorphic/flip");
const foldlk = require("../folding/foldlk");

module.exports = concatMap = f => foldlk(acc => x => k => k(flip(concat) (acc) (f(x)))) ([]);