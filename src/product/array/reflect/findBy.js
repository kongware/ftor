"use strict";

module.exports = f => xs => xs.find((x, i) => f(x, i));