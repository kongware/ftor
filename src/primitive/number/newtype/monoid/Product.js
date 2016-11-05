const Monoid = require("../../../newtype/Monoid");
const Product = require("../semigroup/Product");

module.exports = Object.assign({}, Monoid, {
  concat: Product.concat,
  empty: () => 1
};