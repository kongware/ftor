const uncurry = require("../../../../../polymorphic/currying/uncurry");

module.exports = some2 = f => as => as.some(uncurry(f));