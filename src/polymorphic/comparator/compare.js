const {LT} = require("../../const/ORDERING");

module.exports = compare = y => x => x < y ? LT : y < x ? GT : EQ;