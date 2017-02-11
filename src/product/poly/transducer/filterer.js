"use strict";

module.exports = pred => rf => acc => x => pred(x) ? rf(acc) (x) : acc;