"use strict";


// dependencies


const B = require("../B");
const Ident = require("../sum/ident/Ident");
const run = require("../sum/ident/run");


/**
 * @name set through a lens
 * @type operator function
 * @example
 *

   ?

 */


// Functor f => (a -> f a) -> a -> Object|Array -> Object|Array
const set = lens => x => map(lens) (K(x));


// API


module.exports = set;