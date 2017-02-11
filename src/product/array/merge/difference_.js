"use strict";

const concat = require("../construct/concat");
const differencel = require("./differencel");
const differencer = require("./differencer");
const flip = require("../../../poly/primitive/flip");

module.exports = (xs, ys) => flip(concat) (differencel(xs) (ys)) (differencer(xs) (ys));