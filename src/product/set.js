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

   const o = {name: "Bob", addresses: [
     {street: "99 Maple", zip: 94004, type: "home"},
     {street: "9200 Sunset", zip: 90069, type: "work"},
     {street: "1 Infinite Loop", zip: 95014, type: "life"},
   ]}

   const _2ndStreetLens = B(key("addresses")) (B(index(1)) (key("street")));
   const p = set(_2ndStreetLens) ("77 Sunset Strip") (o); // {...[...{street: "77 Sunset Strip",...}...]...}

   console.assert(o !== p); // passes

 */


// Functor f => (a -> f a) -> a -> Object|Array -> Object|Array
const set = lens => x => map(lens) (K(x));


// API


module.exports = set;