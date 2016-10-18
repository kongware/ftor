const _concat = require("../accumulation/_/_concat");
const differencel = require("./differencel");
const differencer = require("./differencer");

module.exports = difference = ys => xs => _concat(differencel(xs) (ys)) (differencer(xs) (ys));