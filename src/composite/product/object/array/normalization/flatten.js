const concat = require("../accumulation/concat");
const curry = require("../../../../../polymorphic/currying/curry");
const flip = require("../../../../../polymorphic/primitve/flip");
const foldl = require("../folding/left/foldl");

module.exports = flatten = xs => foldl(curry(flip(concat))) ([]) (xs);