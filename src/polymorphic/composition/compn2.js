const apply2 = require("../application/apply2");
const flipFirst3 = require("../argument/flipFirst3");
const foldr = require("../../compositeobject/array/folding/foldr");

module.exports = compn2 = flipFirst3(foldr(apply2));