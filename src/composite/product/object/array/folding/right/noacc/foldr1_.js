const _flip_ = require("../../../../../../../polymorphic/primitive/_flip_");

module.exports = foldr1_ = f => xs => xs.reduceRight(_flip_(f));