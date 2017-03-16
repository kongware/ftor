"use strict";

const {I, K, T} = require("../generic");

const tuple = {};


// general


tuple._1st = I;


tuple._2nd = K;


tuple._3rd = (x, y, z) => z;


tuple._4th = (w, x, y, z) => z;


tuple._5th = (v, w, x, y, z) => z;


tuple.curry = f => x => y => f(x, y);


tuple.curry3 = f => x => y => z => f(x, y, z);


tuple.curry4 = f => w => x => y => z => f(w, x, y, z);


tuple.curry5 = f => v => w => x => y => z => f(v, w, x, y, z);


tuple.curryOp = f => y => x => f(x, y);


tuple.curryOp3 = f => y => z => x => f(x, y, z);


tuple.curryOp4 = f => x => y => z => w => f(w, x, y, z);


tuple.curryOp5 = f => w => x => y => z => v => f(v, w, x, y, z);


tuple.last = (...args) => args[args.length - 1];


tuple.len = (...args) => args.length;


tuple.rotatel = (y, z, x) => f => f(x, y, z);


tuple.rotatel4 = (x, y, z, w) => f => f(w, x, y, z);


tuple.rotatel5 = (w, x, y, z, v) => f => f(v, w, x, y, z);


tuple.rotater = (z, x, y) => f => f(x, y, z);


tuple.rotate4 = (z, w, x, y) => f => f(w, x, y, z);


tuple.rotate5 = (z, v, w, x, y) => f => f(v, w, x, y, z);


tuple.swap = (y, x) => f => f(x, y);


tuple.uncurry = f => (x, y) => f(x) (y);


tuple.uncurry3 = f => (x, y, z) => f(x) (y) (z);


tuple.uncurry4 = f => (w, x, y, z) => f(w) (x) (y) (z);


tuple.uncurry5 = f => (v, w, x, y, z) => f(v) (w) (x) (y) (z);


tuple.uncurryOp = f => (y, x) => f(x) (y);


tuple.uncurryOp3 = f => (y, z, x) => f(x) (y) (z);


tuple.uncurryOp4 = f => (x, y, z, w) => f(w) (x) (y) (z);


tuple.uncurryOp5 = f => (w, x, y, z, v) => f(v) (w) (x) (y) (z);


// constructors


tuple.cons0 = () => f => f();


tuple.cons1 = T;


tuple.cons2 = (x, y) => f => f(x, y);


tuple.cons3 = (x, y, z) => f => f(x, y, z);


tuple.cons4 = (w, x, y, z) => f => f(w, x, y, z);


tuple.cons5 = (v, w, x, y, z) => f => f(v, w, x, y, z);



// Foldable


tuple.foldl = (...args) => acc => f => args.reduce(f, acc);


tuple.foldl1 = (...args) => f => args.reduce(f);


tuple.foldr = (...args) => acc => f => args.reduceRight((acc, x) => f(x, acc), acc);


tuple.foldr1 = (...args) => acc => f => args.reduceRight(f);


module.exports = tuple;