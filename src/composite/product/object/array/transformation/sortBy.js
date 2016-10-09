const uncurry = require("../../../../../polymorphic/currying/uncurry");

module.exports = sortBy = f => xs => xs.sort(uncurry(f));