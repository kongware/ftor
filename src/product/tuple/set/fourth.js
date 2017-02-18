"use strict";

module.exports = v => (w, x, y, z, ...args) => f => f(w, x, y, v, ...args);