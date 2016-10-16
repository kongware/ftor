const A = require("../primitive/A");
const flip = require("../primitive/flip");
const foldr = require("../../composite/product/object/array/folding/foldr");

module.exports = compn = flip(foldr(A));