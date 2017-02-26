"use strict";

const cons = require("../product/object");

const map = {};


map.clone = map => cons(Map) (map);


map.cons = (...xs) => cons(Map) (xs);


map.del = k => map => (map.clone(map).delete(k), map);


map.destructiveDel = k => map => (map.delete(k), map);


map.destructiveSet = (k, v) => map => map.set(k, v);


map.entries = map => map.entries();


map.forEach = map => f => map.forEach((x, i) => f(x, i));


map.get = k => map => map.get(k);


map.has = k => map => map.has(k);


map.keys = map => map.keys();


map.set = (k, v) => map => map.clone(map).set(k, v);


map.values = map => map.values();


module.exports = map;