const clone = require("./clone");
const destructiveSet = require("../mutate/destructiveSet");

module.exports = (k, v) => o => destructiveSet(k, v) (clone(o));