const ctor = require("../reflection/ctor");

module.exports = assign = (...xs) => Object.assign(new (ctor(xs[0])) (), ...xs);