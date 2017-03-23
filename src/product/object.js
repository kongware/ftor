"use strict";

const {A} = require("../generic");

const {curry} = require("./Tuple");

const object = {};


object.assign = (...os) => Object.assign({}, ...os);


object.clone = o => Object.assign({}, o);


object.cons = ctor => x => Reflect.construct(ctor, [x]);


object.consn = ctor => xs => Reflect.construct(ctor, xs);


object.contains_ = (o, x) => Object.keys(o).some(k => o[k] === x);


object.contains = x => o => Object.keys(o).some(k => o[k] === x);


object.del_ = (o, k) => object.destructiveDel(k) (object.clone(o));


object.del = k => o => object.destructiveDel(k) (object.clone(o));


object.destruct = x => f => ({[x]:a}) => f(a);


object.destruct2 = (x, y) => f => ({[x]:a}) => ({[y]:b}) => f(a) (b);


object.destruct2_ = (x, y) => f => ({[x]:a}, {[y]:b}) => f(a, b);


object.destruct3 = (x, y, z) => f => ({[x]:a}) => ({[y]:b}) => ({[z]:c}) => f(a) (b) (c);


object.destruct3_ = (x, y, z) => f => ({[x]:a}, {[y]:b}, {[z]:c}) => f(a, b, c);


object.destruct4 = (w, x, y, z) => f => ({[w]:a}) => ({[x]:b}) => ({[y]:c}) => ({[z]:d}) => f(a) (b) (c) (d);


object.destruct4_ = (w, x, y, z) => f => ({[w]:a}, {[x]:b}, {[y]:c}, {[z]:d}) => f(a, b, c, d);


object.destruct5 = (v, w, x, y, z) => f => ({[v]:a}) => ({[w]:b}) => ({[x]:c}) => ({[y]:d}) => ({[z]:e}) => f(a) (b) (c) (d) (e);


object.destruct5_ = (v, w, x, y, z) => f => ({[v]:a}, {[w]:b}, {[x]:c}, {[y]:d}, {[z]:e}) => f(a, b, c, d, e);


object.destructiveDef = (k, dtor) => o => Object.defineProperty(o, k, dtor);


object.destructiveDel = k => o => (delete o[k], o);


object.destructiveSet = (k, v) => o => (o[k] = v, o);


object.entries = Object.entries;


//object.iterator = TODO


object.fold = f => acc => o => {
  const next = (acc, i) => k[i] === undefined
   ? acc
   : next(f(acc, o[k[i]], k[i]), i + 1),
   k = Object.keys(o);

  return next(acc, 0);
};


object.fold1 = f => o => {
  const next = (acc, i) => k[i] === undefined
   ? acc
   : next(f(acc, o[k[i]], k[i]), i + 1),
   k = Object.keys(o);

  return next(o[k[i]], 1);
};


object.foldk = f => acc => o => {
  const next = (acc, i) => k[i] === undefined
   ? acc
   : next(f(acc, o[k[i]], k[i]), (acc => next(acc, i + 1))),
   k = Object.keys(o);

  return next(acc, 0);
};


object.freeze = Object.freeze;


object.get = k => o => o[k];


object.getBy = v => o => Object.keys(o).find(k => o[k] === v);


object.getCtor = object.get("constructor");


object.getProto = o => o.constructor ? o.constructor.prototype : Object.getPrototypeOf(o);


object.has_ = (o, k) => k in o;


object.has = k => o => k in o;


object.keys = Object.keys;


object.len = o => Object.keys(o).length;


object.owns_ = (o, k) => Object.keys(o).includes(k);


object.owns = k => o => Object.keys(o).includes(k);


object.para = f => acc => o => {
  const next = (acc, [head, ...tail]) => head === undefined
   ? acc
   : next(f(acc, o[head], head) (tail), tail);

  return next(acc, Object.keys(o));
};


object.proto = A(Object.create);


object.proto2 = curry(Object.create);


object.record = o => Object.freeze(o);


object.seal = Object.seal;


object.set = (k, v) => o => destructiveSet(k, v) (clone(o));


object.subset = x => ({[x]:a}) => ({[x]:a});


object.subset2 = (x, y) => ({[x]:a, [y]:b}) => ({[x]:a, [y]:b});


object.subset3 = (x, y, z) => ({[x]:a, [y]:b, [z]:c}) => ({[x]:a, [y]:b, [z]:c});


object.subset4 = (w, x, y, z) => ({[w]:a, [x]:b, [y]:c, [z]:d}) => ({[w]:a, [x]:b, [y]:c, [z]:d});


object.subset5 = (v, w, x, y, z) => ({[v]:a, [w]:b, [x]:c, [y]:d, [z]:e}) => ({[v]:a, [w]:b, [x]:c, [y]:d, [z]:e});


object.toArray = o => Object.keys(o).map(k => o[k]);


object.union = p => o => Object.assign({}, o, p);


object.unionn = (...os) => Object.assign({}, ...os);


object.values = Object.values;


module.exports = object;