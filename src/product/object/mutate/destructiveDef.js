"use strict";

module.exports = (k, dtor) => o => Object.defineProperty(o, k, dtor);