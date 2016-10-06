const apply = require("../application/apply");
const flip = require("../argument/flip");
const foldr = require("../../compositeobject/array/folding/foldr");

module.exports = compn = flip(foldr(apply));