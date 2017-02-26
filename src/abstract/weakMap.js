"use strict";

const cons = require("../product/object");

const weakMap = {};


weakMap.clone = weakMap => cons(Map) (weakMap);


weakMap.cons = (...xs) => cons(Map) (xs);


weakMap.del = k => weakMap => (weakMap.clone(weakMap).delete(k), weakMap);


weakMap.destructiveDel = k => weakMap => (weakMap.delete(k), weakMap);


weakMap.destructiveSet = (k, v) => weakMap => weakMap.set(k, v);


weakMap.get = k => weakMap => weakMap.get(k);


weakMap.has = k => weakMap => weakMap.has(k);


weakMap.set = (k, v) => weakMap => weakMap.clone(weakMap).set(k, v);


module.exports = weakMap;