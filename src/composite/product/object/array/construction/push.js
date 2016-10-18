const clone = require("../../construction/clone");
const destructivePush = require("../mutation/destructivePush");

module.exports = push = x => xs => (xs = clone(xs), destructivePush(x) (xs));