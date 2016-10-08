const clone = require("./clone");

module.exports = set = (k, v) => o => (o = clone(o), o[k] = v, o);