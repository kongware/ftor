"use strict";


// dependencies


const B = require("../B");
const Ident = require("../sum/ident/Ident");
const run = require("../sum/ident/run");


/**
 * @name map over a lens
 * @type operator function
 * @example
 *

   ?

 */


// Functor f => (b -> f b) -> (a -> b) -> Object|Array -> Object|Array
const map = lens => f => B(run) (lens(B(Ident) (f)));


// API


module.exports = map;