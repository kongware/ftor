const assign = require("./assign");

module.exports = clone = o => assign(new o.constructor()) ([o]);