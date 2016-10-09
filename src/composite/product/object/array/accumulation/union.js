const _concat = require("./_concat");
const createSet = require("../../../../abstract/set/createSet");
const filter = require("../folding/filter");

module.exports = union = ys => xs => {
  const zs = createSet(xs);
  return concat(xs) (filter(x => zs.has(x)
   ? false
   : zs.add(x)) (ys));
};