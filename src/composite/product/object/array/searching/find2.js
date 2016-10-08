const uncurry = require("../../../../../polymorphic/currying/uncurry");

module.exports = find2 = f => xs => xs.find(uncurry(f));