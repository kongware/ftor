const add = require("../../../../../../primitive/number/operator/add");
const foldl = require("../left/foldl");

module.exports = sum = xs => foldl(add) (0) (xs);