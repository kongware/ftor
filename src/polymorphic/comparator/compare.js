const {LT, EQ, GT} = require("../../const/ORDERING");

module.exports = compare = y => x => x < y ? LT : y < x ? GT : EQ;