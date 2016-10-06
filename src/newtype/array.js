const append = require("../composite/product_type/object/array/accumulation/append");
const aof = require("../composite/product_type/object/array/construction/aof");
const equals = require("../composite/product_type/object/array/reflection/equals");

module.exports = {
  concat: append,
  empty: aof,
  equals: equals
};