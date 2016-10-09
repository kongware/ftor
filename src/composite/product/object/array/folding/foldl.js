const uncurry = require("../../../../../polymorphic/currying/uncurry");

module.exports = foldl = f => acc => xs => xs.reduce(uncurry(f), acc);