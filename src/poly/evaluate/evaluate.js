"use strict";

module.exports = x => typeof x === "function" ? x() : x;