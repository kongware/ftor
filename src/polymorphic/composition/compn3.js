const apply3 = require("../application/apply3");
const flipFirst4 = require("../argument/flipFirst4");
const foldr = require("../../compositeobject/array/folding/foldr");

module.exports = compn3 = flipFirst4(foldr(apply3));