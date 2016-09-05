var concat = require("./concatenation/concat");
var foldl = require("./reducing/foldl");

module.exports = flatten = xs => foldl(concat) ([]) (xs);