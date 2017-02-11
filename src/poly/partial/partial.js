"use strict";

module.exports = f => (...args) => (...args2) => f(...args, ...args2);