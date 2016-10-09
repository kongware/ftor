const uncurry = require("../../../../../polymorphic/currying/uncurry");

module.exports = every2 = f => as => as.every(uncurry(f));