"use strict";

module.exports = x => (y, z, ...args) => f => f(y, x, ...args);