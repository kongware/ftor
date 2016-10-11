const createSet = require("../../../../abstract/set/createSet");
const filter = require("../folding/filter");

module.exports = differencel = ys => xs => {
  const zs = createSet(ys);
  return filter(x => zs.has(x)
     ? false
     : true
  ) (xs);
};