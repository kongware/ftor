const clone = require("./clone");
const destructiveDel = require("../mutate/destructiveDel");

module.exports = k => o => destructiveDel(k) (clone(o));