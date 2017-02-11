"use strict";

module.exports = (x, ctor) => { throw new ctor(x) };