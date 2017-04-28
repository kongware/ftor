"use strict";


// dependencies


const eq = require("./eq");
const neq = require("./neq");


/**
 * @name Setoid
 * @note equality
 * @type type representative
 * @status stable
 */


const Setoid = {};


Setoid.eq = eq;
Setoid.neq = neq;


// API


module.exports = Setoid;