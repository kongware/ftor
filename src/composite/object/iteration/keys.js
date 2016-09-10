const keys = require("./keys");
const next = require("../../iterable/next");

module.exports = keys = o => keys(o).values();