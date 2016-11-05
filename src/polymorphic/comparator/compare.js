const {LT, EQ, GT} = require("../../newtype/Order");

module.exports = compare = y => x => x < y ? LT : y < x ? GT : EQ;