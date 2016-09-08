const afrom = require("../construction/afrom");
const createSet = require("../../../abstract/set/createSet");
const filter = require("../searching/filter");
const has = require("../../../abstract/set/has");

module.exports = intersect = ys => xs => {
  ys = createSet(ys);
  return filter(x => has(x) (ys)) (afrom(createSet(xs)));
}