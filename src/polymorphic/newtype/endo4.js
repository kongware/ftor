const comp4 = require("../composition/comp4");
const I = require("../primitive/I");
const {concat, empty, equals} = require("../../interop/symbols");

module.exports = endo4 = {
  [concat]: comp4,
  [empty]: I
};