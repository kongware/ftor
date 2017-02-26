"use strict";

const cons = require("../product/object");

const weakSet = {};


weakSet.add = x => weakSet => weakSet.clone(weakSet).add(x);


weakSet.clone = weakSet => cons(Set) (weakSet);


weakSet.cons = (...xs) => cons(Set) (xs);


weakSet.del = x => weakSet => (clone(weakSet).delete(x), weakSet);


weakSet.del = x => weakSet => (weakSet.clone(weakSet).delete(x), weakSet);


weakSet.destructiveDel = x => weakSet => (weakSet.delete(x), weakSet);


weakSet.destructiveAdd = x => weakSet => weakSet.add(x);


weakSet.has = x => weakSet => weakSet.has(x);


module.exports = weakSet;