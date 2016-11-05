const dec = require("../../operator/dec");
const Enumerable = require("../../../newtype/Enumerable");
const inc = require("../../operator/inc");

module.exports = Object.assign({}, Enumerable, {
  pred: dec,
  succ: inc
};