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

   const o = {name: "Bob", addresses: [
     {street: "99 Maple", zip: 94004, type: "home"},
     {street: "9200 Sunset", zip: 90069, type: "work"},
     {street: "1 Infinite Loop", zip: 95014, type: "life"},
   ]}

   const _2ndStreetLens = B(key("addresses")) (B(index(1)) (key("street")));
   const p = map(_2ndStreetLens) (x => x.toUpperCase()) (o); // {...[...{street: "9200 SUNSET",...}...]...}

   console.assert(o !== p); // passes

 */


// Functor f => (b -> f b) -> (a -> b) -> Object|Array -> Object|Array
const map = lens => f => B(run) (lens(B(Ident) (f)));


// API


module.exports = map;