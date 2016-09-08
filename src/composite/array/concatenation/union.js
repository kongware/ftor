const concat_ = require("./concat_");
const createSet = require("../../../abstract/set/createSet");
const filter = require("../searching/filter");
const has = require("../../../abstract/set/has");
const notf = require("../../../polymorphic/negation/notf");
const unique = require("../normalization/unique");

module.exports = union = ys => xs => {
  ys = unique(ys);
  zs = createSet(xs);
  return concat_(xs) (filter(notf(has(zs))) (ys));
}