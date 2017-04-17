"use strict";


// dependencies


const {B_} = require("../B");
const Const = require("../sum/const/Const");
const runBy = require("../runBy");


/**
 * @name view through a lense
 * @type higher order function
 * @example

   const o = {name: "Bob", addresses: [
     {street: "99 Maple", zip: 94004, type: "home"},
     {street: "9200 Sunset", zip: 90069, type: "work"},
     {street: "1 Infinite Loop", zip: 95014, type: "life"},
   ]}

   const _2ndStreetLens = B_(key("addresses"), index(1), key("street"));

   view (_2ndStreetLens) (o); // 9200 Sunset

 */


// Functor f => (a -> f b) -> t * -> a
const view = lens => B_(runBy, lens(Const));


// API


module.exports = view;