const concat = require("../accumulation/concat");
const foldl = require("../foling/foldl");

module.exports = flatten = xs => foldl(concat) ([]) (xs);