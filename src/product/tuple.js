"use strict";

const {T} = require("../generic");

const tuple = {};


tuple.fifth = (v, w, x, y, z) => z;


tuple.first = (x, y) => x;


tuple.fourth = (w, x, y, z) => z;


tuple.last = (...args) => args[args.length - 1];


tuple.rotatel = (y, z, x) => f => f(x, y, z);


tuple.rotatel4 = (x, y, z, w) => f => f(w, x, y, z);


tuple.rotatel5 = (w, x, y, z, v) => f => f(v, w, x, y, z);


tuple.rotater = (z, x, y) => f => f(x, y, z);


tuple.rotate4 = (z, w, x, y) => f => f(w, x, y, z);


tuple.rotate5 = (z, v, w, x, y) => f => f(v, w, x, y, z);


tuple.second = (x, y) => y;


tuple.set1 = x => (y, ...args) => f => f(x, ...args);


tuple.set2 = x => (y, z, ...args) => f => f(y, x, ...args);


tuple.set3 = w => (x, y, z, ...args) => f => f(x, y, w, ...args);


tuple.set4 = v => (w, x, y, z, ...args) => f => f(w, x, y, v, ...args);


tuple.set5 = u => (v, w, x, y, z, ...args) => f => f(v, w, x, y, u, ...args);


tuple.swap = (y, x) => f => f(x, y);


tuple.third = (x, y, z) => z;


tuple.cons0 = () => f => tuple.tuple0;


tuple.cons1 = T;


tuple.cons2 = (x, y) => f => f(x, y);


tuple.cons3 = (x, y, z) => f => f(x, y, z);


tuple.cons4 = (w, x, y, z) => f => f(w, x, y, z);


tuple.cons5 = (v, w, x, y, z) => f => f(v, w, x, y, z);


module.exports = tuple;