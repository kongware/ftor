const comp3 = require("../composition/comp3");
const I = require("../primitive/I");
const {concat, empty, equals} = require("../../interop/symbols");

module.exports = endo3 = {
  [concat]: comp3,
  [empty]: I
};