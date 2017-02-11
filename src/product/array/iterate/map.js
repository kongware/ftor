"use strict";

module.exports = f => xs => xs.map((x, i) => f(x, i));