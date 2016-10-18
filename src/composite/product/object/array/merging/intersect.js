const createSet = require("../../../../abstract/set/createSet");
const filter = require("../folding/left/derived/filter");

module.exports = intersect = ys => xs => {
  const zs = createSet(ys);
  return filter(x => zs.has(x)
     ? true
     : false
  ) (xs);
};