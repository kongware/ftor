"use strict";

module.exports = f => xs => xs.reduce((acc, x, i) => f(acc) (x, i));