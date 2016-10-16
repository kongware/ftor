const _flip_ = require("../../../../../../polymorphic/primitive/_flip_");

module.exports = foldr_ = f => acc => xs => xs.reduceRight(_flip_(f), acc);