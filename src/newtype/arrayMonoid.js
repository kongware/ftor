const append = require("../composite/product/object/array/accumulation/append");
const aof = require("../composite/product/object/array/construction/aof");
const equals = require("../composite/product/object/array/reflection/equals");

module.exports = arrayMonoid = {
  concat: append,
  empty: aof
};