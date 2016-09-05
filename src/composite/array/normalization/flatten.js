const concat = require("../concatenation/concat");
const foldl = require("../foling/foldl");

module.exports = flatten = xs => foldl(concat) ([]) (xs);