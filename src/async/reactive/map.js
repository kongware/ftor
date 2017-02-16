"use strict";

module.exports = f => observable => observe => subscribe(observable) (x => observe(f(x)));