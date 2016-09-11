const concat_ = require("./concat_");
const createSet = require("../../../abstract/set/createSet");
const filter = require("../searching/filter");

module.exports = unionBy = f => ys => xs => {
  const xs_ = createSet(xs);  
  return concat_(xs) (filter(f(x => xs_.has(x) ? false : xs_.add(x))) (ys));
}