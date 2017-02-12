"use strict";

module.exports = f => pred => x => pred(x) ? f(x) : x;