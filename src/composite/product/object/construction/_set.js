const clone = require("./clone");

module.exports = _set = (k, v, o) => (o = clone(o), o[k] = v, o);