const comp2 = require("../../../polymorphic/composition/comp2");
const concat_ = require("./concat_");
const unique = require("../normalization/unique");

module.exports = union_ = comp2(unique) (concat_);