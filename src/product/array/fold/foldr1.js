"use strict";

module.exports = f => xs => xs.reduceRight((acc, x, i) => f(x) (acc, i));