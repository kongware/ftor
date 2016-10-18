const _concat = require("../accumulation/_concat");
const createSet = require("../../../../abstract/set/createSet");
const filter = require("../folding/left/derived/filter");

module.exports = union = ys => xs => {
  const zs = createSet(xs);
  return _concat(xs) (
    filter(x => zs.has(x)
     ? false
     : zs.add(x)
  ) (ys));
};