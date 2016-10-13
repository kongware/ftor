const comp2 = require("../polymorphic/composition/comp2");
const I = require("../polymorphic/primitive/I");
const {concat, empty} = require("../interop/symbols");

module.exports = Endo2 = {
  [concat]: comp2,
  [empty]: I
};