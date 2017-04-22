"use strict";


// dependencies


const {B_} = require("../B");
const Const = require("../sum/const/Const");
const runBy = require("../runBy");


/**
 * @name view
 * @note through a lense
 * @type higher order function
 * @example

   const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);
   const mapBy = f => t => t.type.map(f) (t);
   
   const Const_ = {};
   Const_.map = f => t => Const(t.x);

   const Const = x => ({type: Const_, x: x});
   const runBy = t => "run" in t ? t.run(t) : t.x;

   const key = k => f => o => mapBy(v => Object.assign({}, o, {[k]: v})) (f(o[k]));
   const index = i => f => xs => mapBy(x => Object.assign([], xs, {[i]: x})) (f(xs[i]));
   const view = lens => B_(runBy, lens(Const));

   const o = {name: "Bob", addresses: [
     {street: "99 Maple", zip: 94004, type: "home"},
     {street: "77 Sunset", zip: 90069, type: "work"},
     {street: "1 Infinite Loop", zip: 95014, type: "life"},
   ]}

   const _2ndStreetLens = B_(key("addresses"), index(1), key("street"));

   view(_2ndStreetLens) (o); // "77 Sunset"

 */


// Functor f => (a -> f b) -> t * -> a
const view = lens => B_(runBy, lens(Const));


// API


module.exports = view;