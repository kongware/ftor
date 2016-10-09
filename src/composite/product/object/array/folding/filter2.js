const uncurry = require("../../../../../polymorphic/currying/uncurry");

module.exports = filter2 = f => as => as.filter(uncurry(f));