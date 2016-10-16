const {LT, EQ, GT} = require("../../const/ORDERING");

module.exports = _compare = (x, y) => x < y ? LT : y < x ? GT : EQ;