"use strict";

module.exports = f => acc => xs => xs.reduceRight((acc, x, i) => f(x) (acc, i), acc);