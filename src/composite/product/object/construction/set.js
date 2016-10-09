const clone = require("./clone");

module.exports = set = (k, v) => kv => (kv = clone(kv), kv[k] = v, kv);