"use strict";


// constructor


Char = class Char extends String {
  constructor(x) {super(x[0])}
};


// Bounded


Char.prototype.minBound = "\u{0}";


Char.prototype.maxBound = "\u{10FFFF}";


module.exports = Char;