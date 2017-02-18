"use strict";

module.exports = w => (x, y, z, ...args) => f => f(x, y, w, ...args);