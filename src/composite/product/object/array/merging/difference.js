const _concat = require("../accumulation/_concat");
const _differencel = require("./_differencel");
const flip = require("../../../../../polymorphic/primitive/flip");

module.exports = difference = ys => xs => _concat(_differencel(xs) (ys)) (flip(_differencel) (xs) (ys));