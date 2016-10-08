const add = require("../../../primitive/number/operator/add");
const foldl = require("./foldl");

module.exports = sum = xs => foldl(add) (0) (xs);