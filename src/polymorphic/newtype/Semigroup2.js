const comp2 = require("../../polymorphic/composition/comp2");
const Semigroup = require("../../newtype/Semigroup");

module.exports = Object.assign({}, Semigroup, {
  concat: comp2
});