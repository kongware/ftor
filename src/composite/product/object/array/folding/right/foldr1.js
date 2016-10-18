const flip = require("../../../../../../../polymorphic/primitive/flip");
const uncurry = require("../../../../../../../polymorphic/currying/uncurry");

module.exports = foldr1 = f => xs => xs.reduceRight(uncurry(flip(f)));