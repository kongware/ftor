const flip = require("../../../../../polymorphic/argument/flip");
const uncurry = require("../../../../../polymorphic/currying/uncurry");

module.exports = foldr = f => acc => as => as.reduceRight(uncurry(flip(f)), acc);