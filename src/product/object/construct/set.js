const clone = require("./clone");
const destructiveSet = require("../mutate/destructiveSet");

module.exports = k => o => destructiveSet(k) (clone(o));