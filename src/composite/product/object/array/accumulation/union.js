const concat_ = require("./concat_");
const createSet = require("../../../../abstract/set/createSet");
const filter = require("../folding/filter");

module.exports = union = ys => xs => {
  const xs_ = createSet(xs);
  return concat(xs) (filter(x => xs_.has(x)
   ? false
   : xs_.add(x)) (ys));
};