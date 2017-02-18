"use strict";

const cons = require("../../product/object/construct/cons");

module.exports = (...xs) => cons(WeakSet) (xs);