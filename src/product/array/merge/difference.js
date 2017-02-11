"use strict";

const concat = require("../construct/concat");
const differencel = require("./differencel");
const differencer = require("./differencer");
const flip = require("../../../poly/primitive/flip");

module.exports = ys => xs => flip(concat) (differencel(xs) (ys)) (differencer(xs) (ys));