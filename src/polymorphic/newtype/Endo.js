const comp = require("../composition/comp");
const I = require("../primitive/I");
const {concat, empty} = require("../../interop/symbols");

module.exports = Endo = {
  [concat]: comp,
  [empty]: I
};