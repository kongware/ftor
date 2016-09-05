const comp2 = require("../../../polymorphic/composition/comp2");
const concat = require("./concat");
const unique = require("../normalization/unique");

module.exports = union = comp2(unique) (concat);