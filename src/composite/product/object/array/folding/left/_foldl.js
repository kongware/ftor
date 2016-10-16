const _A2 = require("../../../../../../polymorphic/primitive/_A2");

module.exports = _foldl = (f, acc, xs) => xs.reduce(_A2(f), acc);