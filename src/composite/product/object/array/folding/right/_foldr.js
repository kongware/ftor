const _flip = require("../../../../../../polymorphic/primitive/_flip");

module.exports = _foldr = (f, acc, xs) => xs.reduceRight(_flip(f), acc);