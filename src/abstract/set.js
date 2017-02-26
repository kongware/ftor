"use strict";

const cons = require("../product/object");

const set = {};


set.add = x => set => set.clone(set).add(x);


set.clone = set => cons(Set) (set);


set.cons = (...xs) => cons(Set) (xs);


set.del = x => set => (clone(set).delete(x), set);


set.del = x => set => (set.clone(set).delete(x), set);


set.destructiveDel = x => set => (set.delete(x), set);


set.destructiveAdd = x => set => set.add(x);


set.forEach = set => f => set.forEach((x, i) => f(x, i));


set.has = x => set => set.has(x);


set.values = set => set.values();


module.exports = set;