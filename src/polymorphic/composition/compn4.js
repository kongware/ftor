const apply4 = require("../application/apply4");
const flipFirst5 = require("../argument/flipFirst5");
const foldr = require("../../composite/array/folding/foldr");

module.exports = compn4 = flipFirst5(foldr(apply4));