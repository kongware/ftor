"use strict";

module.exports = n => f => repeat (n) (x => (f(x), x + 1)) (0);