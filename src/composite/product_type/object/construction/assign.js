const ctor = require("../reflection/ctor");

module.exports = assign = xs => Object.assign(ctor(xs[0]) (), ...xs);