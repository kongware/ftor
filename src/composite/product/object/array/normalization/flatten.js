const concat = require("../accumulation/concat");
const foldl = require("../foling/foldl");

module.exports = flatten = as => foldl(concat) ([]) (as);