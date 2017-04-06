"use strict";


// dependencies


const mapBy = require("../../mapBy");


/**
 * @name index by function lens
 * @type operator function
 * @example
 *

   const o = {name: "Bob", addresses: [
     {street: "99 Maple", zip: 94004, type: "home"},
     {street: "9200 Sunset", zip: 90069, type: "work"},
     {street: "1 Infinite Loop", zip: 95014, type: "life"},
   ]}

   const _2ndStreetLens = B_(key("addresses"), indexBy(xs => xs[xs.length - 1]), key("street"));
   const p = map(_2ndStreetLens) (x => x.toUpperCase()) (o); // {...[...{street: "1 INFINITE LOOP",...}...]...}

   console.assert(o !== p); // passes

 */


// Functor f => (Array -> Number) -> (a -> f b) -> Array -> Array
const indexBy = g => f => xs => (g = g(xs), mapBy(v => Object.assign([], xs, {[g]: v})) (f(xs[g])));


// API


module.exports = indexBy;