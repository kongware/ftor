const add = require("../../../primitive/number/operator/add");
const foldl = require("./foldl");

module.exports = sum = as => foldl(add) (0) (as);