"use strict";


// dependencies


const B = require("../B");
const Const = require("../sum/const/Const");
const run = require("../sum/const/run");


/**
 * @name view through a lense
 * @type operator function
 * @example
 *

   const o = {name: "Bob", addresses: [
     {street: "99 Maple", zip: 94004, type: "home"},
     {street: "9200 Sunset", zip: 90069, type: "work"},
     {street: "1 Infinite Loop", zip: 95014, type: "life"},
   ]}

   const _2ndStreetLens = B(key("addresses")) (B(index(1)) (key("street")));

   view (_2ndStreetLens) (o); // 9200 Sunset

 */


// Functor f => (a -> f a) -> Object|Array -> a
const view = lens => B(run) (lens(Const));


// API


module.exports = view;