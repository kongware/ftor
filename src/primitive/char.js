"use strict";

const char = {};


// constructor


char.Char = class Char extends String {
  constructor(x) {super(x[0])}
};


// Bounded


char.Char.prorotype = minBound = "\u{0}";


char.Char.prototype = maxBound = "\u{10FFFF}";


module.exports = char;