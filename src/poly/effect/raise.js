"use strict";

module.exports = ctor => x => { throw new ctor(x) };