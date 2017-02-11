"use strict";

module.exports = f => xs => xs.some((x, i) => f(x, i));