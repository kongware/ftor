const apply3 = require("../application/apply3");
const flipFirst4 = require("../argument/flipFirst4");
const foldr = require("../../composite/array/folding/foldr");

module.exports = compn3 = flipFirst4(foldr(apply3));