"use strict";

const every = require("../iterate/every");

module.exports = f => xs => ys => xs.length === ys.length
 ? every((x, i) => x === ys[i]) (xs)
 : false;