const comp = require("../composition/comp");
const I = require("../primitive/I");
const {concat, empty, equals} = require("../../interop/symbols");

module.exports = endo = {
  [concat]: comp,
  [empty]: I
};