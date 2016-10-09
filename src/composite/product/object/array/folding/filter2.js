const uncurry = require("../../../../../polymorphic/currying/uncurry");

module.exports = filter2 = f => xs => xs.filter(uncurry(f));