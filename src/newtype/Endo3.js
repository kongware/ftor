const comp3 = require("../polymorphic/composition/comp3");
const I = require("../polymorphic/primitive/I");
const {concat, empty} = require("../interop/symbols");

module.exports = Endo3 = {
  [concat]: comp3,
  [empty]: I
};