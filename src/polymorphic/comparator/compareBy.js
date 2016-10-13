const {LT, EQ, GT} = require("../../const/ORDERING");

module.exports = compareBy = f => y => x => f(x) (y) ? LT : f(y) (x) ? GT : EQ;