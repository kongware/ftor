const ctor = require("../reflection/ctor");

module.exports = assign = as => Object.assign(ctor(as[0]) (), ...as);