const comp3 = require("../composition/comp3");
const I = require("../primitive/I");
const {concat, empty} = require("../../interop/symbols");

module.exports = Endo3 = {
  [concat]: comp3,
  [empty]: I
};