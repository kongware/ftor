"use strict";

module.exports = u => (v, w, x, y, z, ...args) => f => f(v, w, x, y, u, ...args);