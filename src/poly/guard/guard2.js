"use strict";

module.exports = f => pred => x => y => pred(y) ? f(x) (y) : y;