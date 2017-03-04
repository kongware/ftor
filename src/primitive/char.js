"use strict";

const char = {};


char.Char = class Char extends String {
  constructor(x) {super(x[0])}
};


char.Char.prototype = maxBound = "\u{10FFFF}";


char.Char.prorotype = minBound = "\u{0}";


module.exports = char;