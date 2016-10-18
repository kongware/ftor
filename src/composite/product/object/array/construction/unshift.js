const clone = require("../../construction/clone");
const destructiveUnshift = require("../mutation/destructiveUnshift");

module.exports = unshift = x => xs => (xs = clone(xs), destructiveUnshift(x) (xs));