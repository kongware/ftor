const comp4 = require("../polymorphic/composition/comp4");
const I = require("../polymorphic/primitive/I");
const {concat, empty} = require("../interop/symbols");

module.exports = Endo4 = {
  [concat]: comp4,
  [empty]: I
};