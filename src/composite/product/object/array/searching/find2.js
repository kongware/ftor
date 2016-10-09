const uncurry = require("../../../../../polymorphic/currying/uncurry");

module.exports = find2 = f => as => as.find(uncurry(f));