"use strict";

module.exports = f => (...args) => x => f(...args, x);