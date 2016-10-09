const flatten = require("./flatten");
const isArray = require("../reflection/isArray");
const map = require("../transformation/map");

module.exports = deepFlatten = xs => flatten(map(x => isArray(x) ? deepFlatten(x) : x) (xs));