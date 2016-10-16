const A2 = require("../../../../../../../polymorphic/primitive/A2");
const uncurry = require("../../../../../../../polymorphic/currying/uncurry");

module.exports = foldl1 = f => xs => xs.reduce(uncurry(A2(f)));