const uncurry = require("../../../../../polymorphic/currying/uncurry");

module.exports = every2 = f => xs => xs.every(uncurry(f));