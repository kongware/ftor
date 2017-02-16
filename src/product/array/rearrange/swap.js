"use strict";

module.exports = (x, y) => ([...xs]) => xs.length > 1
 ? ([xs[x], xs[y]] = [xs[y], xs[x]], xs)
 : xs;