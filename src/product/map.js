"use strict";


// dependencies


const {B_} = require("../B");
const cons = require("../sum/ident/cons");
const Ident = require("../sum/ident/Ident");
const run = require("../sum/ident/run");

Ident.map = require("../sum/ident/map");


/**
 * @name map over a lens
 * @type higher order function
 * @example
 *

   const o = {name: "Bob", addresses: [
     {street: "99 Maple", zip: 94004, type: "home"},
     {street: "9200 Sunset", zip: 90069, type: "work"},
     {street: "1 Infinite Loop", zip: 95014, type: "life"},
   ]}

   const _2ndStreetLens = B_(key("addresses"), index(1), key("street"));
   const p = map(_2ndStreetLens) (x => x.toUpperCase()) (o); // {...[...{street: "9200 SUNSET",...}...]...}

   console.assert(o !== p); // passes

 */


// Functor f => (b -> f b) -> (a -> b) -> Object|Array -> Object|Array
const map = lens => f => B_(run, lens(B_(cons, f)));


// API


module.exports = map;