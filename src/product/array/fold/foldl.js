"use strict";

module.exports = f => acc => xs => xs.reduce((acc, x, i) => f(acc) (x, i), acc);