const comp = require("../polymorphic/composition/comp");
const I = require("../polymorphic/primitive/I");
const {concat, empty} = require("../interop/symbols");

module.exports = Endo = {
  [concat]: comp,
  [empty]: I
};