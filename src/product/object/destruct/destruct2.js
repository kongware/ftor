"use strict";

module.exports = (x, y) => f => ({[x]:a, [y]:b}) => f(a, b);