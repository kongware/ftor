const uncurry = require("../../../../../polymorphic/currying/uncurry");

module.exports = sortBy = f => as => as.sort(uncurry(f));