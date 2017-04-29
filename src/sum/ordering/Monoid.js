"use strict";


// dependencies


const {concat, concat_} = require("./concat");
const empty = require("./empty");


/**
 * @name Monoid
 * @type type representative
 * @status stable
 */


const Monoid = {};


// Semigroup


Monoid.concat = concat;
Monoid.concat_ = concat_;


// Monoid


Monoid.empty = empty;


// API


module.exports = Monoid;