"use strict";


// dependencies


const {K} = require("../K");
const map = require("./map");


/**
 * @name set
 * @note through a lens
 * @type higher order function
 * @example

   @see map

 */


// Functor f => (a -> f b) -> a -> t * -> t *
const set = lens => x => map(lens) (K(x));


// API


module.exports = set;