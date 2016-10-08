const comp2 = require("../composition/comp2");
const I = require("../primitive/I");
const {concat, empty, equals} = require("../../interop/symbols");

module.exports = endo2 = {
  [concat]: comp2,
  [empty]: I
};