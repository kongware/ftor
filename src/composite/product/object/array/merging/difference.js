const concat = require("../accumulation/concat");
const differencel = require("./differencel");
const differencer = require("./differencer");
const flip = require("../../../../../polymorphic/primitive/flip");

module.exports = difference = ys => xs => flip(concat) (differencel(xs) (ys)) (differencer(xs) (ys));