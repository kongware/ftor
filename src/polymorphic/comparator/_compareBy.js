const {LT, EQ, GT} = require("../../const/ORDERING");

module.exports = _compareBy = f => (x, y) => f(x, y) ? LT : f(y, x) ? GT : EQ;