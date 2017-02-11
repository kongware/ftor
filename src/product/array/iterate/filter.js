"use strict";

module.exports = f => xs => xs.filter((x, i) => f(x, i));