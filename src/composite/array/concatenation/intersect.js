const afrom = require("../construction/afrom");
const create = require("../../../abstract/set/create");
const filter = require("../searching/filter");
const has = require("../../../abstract/set/has");

module.exports = intersect = ys => xs => {
  ys = create(ys);
  return filter(x => has(x) (ys)) (afrom(create(xs)));
}