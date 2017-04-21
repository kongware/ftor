"use strict";


// dependencies


const {C_} = require("../C");
const Ident = require("../sum/ident/Ident");
const runBy = require("../runBy");


/**
 * @name map over a lens
 * @type higher order function
 * @example

   const o = {name: "Bob", addresses: [
     {street: "99 Maple", zip: 94004, type: "home"},
     {street: "9200 Sunset", zip: 90069, type: "work"},
     {street: "1 Infinite Loop", zip: 95014, type: "life"},
   ]}

   const _2ndStreetLens = C_(key("addresses"), index(1), key("street"));
   const p = map(_2ndStreetLens) (x => x.toUpperCase()) (o); // {...[...{street: "9200 SUNSET",...}...]...}

   console.assert(o !== p); // passes

 */


// Functor f => (a -> f b) -> (a -> b) -> t * -> t *
const map = lens => f => C_(runBy, lens(C_(Ident, f)));


// API


module.exports = map;