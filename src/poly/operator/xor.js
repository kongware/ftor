"use strict";

module.exports = default => y => x => !x === !y ? default : x || y;