"use strict";


// dependencies


const getn = require("./getn");
const mapBy = require("../../mapBy");
const setn = require("./setn");


/**
 * @name element
 * @note of a lens
 * @type higher order function
 * @example

   const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);
   const K = x => _ => x;
   const mapBy = f => t => t.type.map(f) (t);
   const runBy = t => t.x;

   const Tuple = (...args) => f => f(...args);
   const Triple = (x, y, z) => f => f(x, y, z);
   const Pair = (x, y) => f => f(x, y);
   const getn = n => (...args) => args[n - 1];
   const setn = n => x => (...args) => (args[n - 1] = x, Tuple(...args));

   const Const_ = {};
   Const_.map = f => t => Const(t.x);
   const Const = x => ({type: Const_, x: x});
   
   const Ident_ = {};
   Ident_.map = f => t => Ident(f(t.x));
   const Ident = x => ({type: Ident_, x: x});

   const view = lens => B_(runBy, lens(Const));
   const map = lens => f => B_(runBy, lens(B_(Ident, f)));
   const set = lens => x => map(lens) (K(x));

   const elem = n => f => t => mapBy(x => t(setn(n) (x))) (f(t(getn(n))));

   const triple = Triple(Pair(1, "a"), Pair(2, "b"), Pair(3, "c"));
   const _2ndPairLetter = B_(elem(2), elem(2));

   view(_2ndPairLetter) (triple); // "b"
   view(_2ndPairLetter) (map(_2ndPairLetter) (x => x.toUpperCase()) (triple)); // "B"
   view(_2ndPairLetter) (set(_2ndPairLetter) ("z") (triple)); // "z"

 */


// Functor f => Number -> (a -> f b) -> ((*) -> a) -> ((*) -> b)
const elem = n => f => t => mapBy(x => t(setn(n) (x))) (f(t(getn(n))));


// API


module.exports = elem;