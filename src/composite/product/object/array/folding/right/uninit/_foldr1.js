const _flip = require("../../../../../../../polymorphic/primitive/_flip");

module.exports = _foldr1 = (f, xs) => xs.reduceRight(_flip(f));