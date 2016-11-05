const {LT, EQ, GT} = require("../../newtype/Order");

module.exports = compareBy = f => y => x => f(x) (y) ? LT : f(y) (x) ? GT : EQ;