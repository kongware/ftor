const uncurry = require("../../../../../polymorphic/currying/uncurry");

module.exports = foldl = f => acc => as => as.reduce(uncurry(f), acc);