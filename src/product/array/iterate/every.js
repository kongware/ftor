"use strict";

module.exports = f => xs => xs.every((x, i) => f(x, i));