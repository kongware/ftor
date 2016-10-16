const A = require("../primitive/A");
const flip = require("../primitive/flip");
const foldr_ = require("../../composite/product/object/array/folding/foldr_");

module.exports = compn_ = flip(foldr_(A));