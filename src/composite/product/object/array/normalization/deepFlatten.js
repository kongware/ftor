const flatten = require("./flatten");
const isArray = require("../reflection/isArray");
const map = require("../transformation/map");

module.exports = deepFlatten = as => flatten(map(a => isArray(a) ? deepFlatten(a) : a) (as));