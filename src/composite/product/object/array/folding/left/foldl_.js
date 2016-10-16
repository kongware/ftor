const _A2_ = require("../../../../../../polymorphic/primitive/_A2_");

module.exports = foldl_ = f => acc => xs => xs.reduce(_A2_(f), acc);