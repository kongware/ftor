"use strict";


// dependencies


const getn = require("./getn");
const mapBy = require("../../mapBy");
const setn = require("./setn");


/**
 * @name element lens
 * @type higher order function
 * @example

   const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);
   const mapBy = f => t => t.type.map(f) (t);
   const runBy = t => t.x;

   const Triple = (x, y, z) => f => f(x, y, z);
   const Pair = (x, y) => f => f(x, y);
   const getn = n => (...args) => args[n - 1];
   const setn = n => x => (...args) => (args[n - 1] = x, Tuple(...args));

   const Const_ = {};
   Const_.map = f => t => Const(t.x);
   const Const = x => ({type: Const_, x: x});
   const view = lens => B_(runBy, lens(Const));
   const elem = n => f => t => mapBy(x => t(setn(n) (x))) (f(t(getn(n))));

   const triple = Triple(Pair(1, "a"), Pair(2, "b"), Pair(3, "c"));
   const _2ndPairLetter = B_(elem(2), elem(2));

   view(_2ndPairLetter) (triple); // "b"

 */


// Functor f => Number -> (a -> f b) -> ((*) -> a) -> ((*) -> b)
const elem = n => f => t => mapBy(x => t(setn(n) (x))) (f(t(getn(n))));


// API


module.exports = elem;