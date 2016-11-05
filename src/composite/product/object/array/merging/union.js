const concat = require("../accumulation/concat");
const createSet = require("../../../../abstract/set/createSet");
const filter = require("../folding/left/derived/filter");
const flip = require("../../../../../polymorphic/primitive/flip");

module.exports = union = ys => xs => {
  const zs = createSet(xs);
  return flip(concat) (xs) (
    filter(x => zs.has(x)
     ? false
     : zs.add(x)
  ) (ys));
};