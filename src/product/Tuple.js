"use strict";


// dependencies


const {I, K, T} = require("../generic");

const Tuple = {};


// constructors


const Tuple0 = () => f => f();


const Tuple1 = T;


const Tuple2 = (x, y) => f => f(x, y);


const Tuple3 = (x, y, z) => f => f(x, y, z);


const Tuple4 = (w, x, y, z) => f => f(w, x, y, z);


const Tuple5 = (v, w, x, y, z) => f => f(v, w, x, y, z);


// general


Tuple._1st = I;


Tuple._2nd = K;


Tuple._3rd = (x, y, z) => z;


Tuple._4th = (w, x, y, z) => z;


Tuple._5th = (v, w, x, y, z) => z;


Tuple.curry = f => x => y => f(x, y);


Tuple.curry3 = f => x => y => z => f(x, y, z);


Tuple.curry4 = f => w => x => y => z => f(w, x, y, z);


Tuple.curry5 = f => v => w => x => y => z => f(v, w, x, y, z);


Tuple.curryOp = f => y => x => f(x, y);


Tuple.curryOp3 = f => y => z => x => f(x, y, z);


Tuple.curryOp4 = f => x => y => z => w => f(w, x, y, z);


Tuple.curryOp5 = f => w => x => y => z => v => f(v, w, x, y, z);


Tuple.last = (...args) => args[args.length - 1];


Tuple.len = (...args) => args.length;


Tuple.rotatel = (y, z, x) => f => f(x, y, z);


Tuple.rotatel4 = (x, y, z, w) => f => f(w, x, y, z);


Tuple.rotatel5 = (w, x, y, z, v) => f => f(v, w, x, y, z);


Tuple.rotater = (z, x, y) => f => f(x, y, z);


Tuple.rotate4 = (z, w, x, y) => f => f(w, x, y, z);


Tuple.rotate5 = (z, v, w, x, y) => f => f(v, w, x, y, z);


Tuple.swap = (y, x) => f => f(x, y);


Tuple.uncurry = f => (x, y) => f(x) (y);


Tuple.uncurry3 = f => (x, y, z) => f(x) (y) (z);


Tuple.uncurry4 = f => (w, x, y, z) => f(w) (x) (y) (z);


Tuple.uncurry5 = f => (v, w, x, y, z) => f(v) (w) (x) (y) (z);


Tuple.uncurryOp = f => (y, x) => f(x) (y);


Tuple.uncurryOp3 = f => (y, z, x) => f(x) (y) (z);


Tuple.uncurryOp4 = f => (x, y, z, w) => f(w) (x) (y) (z);


Tuple.uncurryOp5 = f => (w, x, y, z, v) => f(v) (w) (x) (y) (z);


// Foldable


Tuple.foldl = (...args) => acc => f => args.reduce(f, acc);


Tuple.foldl1 = (...args) => f => args.reduce(f);


Tuple.foldr = (...args) => acc => f => args.reduceRight((acc, x) => f(x, acc), acc);


Tuple.foldr1 = (...args) => acc => f => args.reduceRight(f);


// API


module.exports = {Tuple, Tuple0, Tuple1, Tuple2, Tuple3, Tuple4, Tuple5};