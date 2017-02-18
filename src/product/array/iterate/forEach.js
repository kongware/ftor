"use strict";

module.exports = f => xs => xs.forEach((x, i) => f(x, i));