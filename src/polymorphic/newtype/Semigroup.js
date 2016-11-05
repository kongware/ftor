const comp = require("../../polymorphic/composition/comp");
const Semigroup = require("../../newtype/Semigroup");

module.exports = Object.assign({}, Semigroup, {
  concat: comp
});