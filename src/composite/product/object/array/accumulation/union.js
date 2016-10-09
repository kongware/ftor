const _concat = require("./_concat");
const createSet = require("../../../../abstract/set/createSet");
const filter = require("../folding/filter");

module.exports = union = bs => as => {
  const cs = createSet(as);
  return concat(as) (filter(a => cs.has(a)
   ? false
   : cs.add(a)) (bs));
};