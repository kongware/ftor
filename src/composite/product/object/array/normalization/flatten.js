const _concat = require("../accumulation/_/_concat");
const curry = require("../../../../../currying/curry");
const foldl = require("../folding/left/foldl");

module.exports = flatten = xs => foldl(curry(_concat)) ([]) (xs);