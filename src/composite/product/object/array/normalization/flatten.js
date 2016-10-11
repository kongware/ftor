const _concat = require("../accumulation/_concat");
const foldl = require("../folding/foldl");

module.exports = flatten = xs => foldl(_concat) ([]) (xs);