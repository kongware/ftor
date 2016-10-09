const uncurry = require("../../../../../polymorphic/currying/uncurry");

module.exports = some2 = f => xs => xs.some(uncurry(f));