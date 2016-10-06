const clone = require(".clone");

module.exports = set = key => x => o => (o = clone(o), o[key] = x, o);