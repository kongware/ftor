"use strict";

const {A, comp, flip, negf2, swap} = require("../generic");

const {consSet} = require("../abstract/set");

const {get, has, set} = require("./object");

const {add_} = require("../primitive/num"),

const array = {};


array.append_ = (xs, x) => xs.concat([x]);


array.append = x => xs => xs.concat([x]);


array.compareBy = compareBy = f => xs => ys => xs.length === ys.length
 ? xs.every((v, k) => f(v) (ys[k]))
 : false;


array.concat_  = (xs, ...args) => xs.concat(...args);


array.concat = x => xs => xs.concat(x);


array.dedupe = xs => comp(Array.from) (consSet) (xs);


array.dedupeBy = f => xs => xs.reduce((acc, x) => acc.some(f(x))
 ? acc
 : (acc.push(x), acc), []);


array.destructivePop = xs => [xs, xs.pop()];


array.destructivePush_ = (xs, ...args) => (xs.push(...args), xs);


array.destructivePush = x => xs => (xs.push(x), xs);


array.destructiveShift = xs => [xs, xs.shift()];


array.destructiveUnshift_ = (xs, ...args) => (xs.unshift(...args), xs);


array.destructiveUnshift = x => xs => (xs.unshift(x), xs);


array.diff_ = (xs, ys) => flip(concat) (array.diffl(xs) (ys)) (array.diffr(xs) (ys));


array.diff = ys => xs => flip(concat) (array.diffl(xs) (ys)) (array.diffr(xs) (ys));


array.diffl_ = (xs, ys) => {
  const zs = consSet(ys);
  return xs.filter(x => zs.has(x)
     ? false
     : true
  );
};


array.diffl = ys => xs => {
  const zs = consSet(ys);
  return xs.filter(x => zs.has(x)
     ? false
     : true
  );
};


array.diffr_ = swap(diffl_);


array.diffr = flip(diffl);


array.drop = n => xs => xs.slice(n);


array.eqBy = f => xs => ys => xs.length === ys.length
 ? xs.every((x, i) => x === ys[i])
 : false;


array.every = f => xs => xs.every((x, i) => f(x, i));


array.filter = f => xs => xs.filter((x, i) => f(x, i));


array.find = f => xs => xs.find((x, i) => f(x, i));


array.flatten = xs => xs.reduce(concat_, []);


array.flattenr = xs => array.flatten(xs.map(x => Array.isArray(x) ? array.flattenr(x) : x));


array.forEach = f => xs => xs.forEach((x, i) => f(x, i));


array.foldl = f => acc => xs => xs.reduce((acc, x, i) => f(acc, x, i), acc);


array.foldl1 = f => xs => xs.reduce((acc, x, i) => f(acc, x, i));


array.foldlk = f => acc => xs => {
  const next = (acc, i) => xs.length === i
   ? acc
   : f(acc, xs[i], i) (acc => next(acc, i + 1));

  return next(acc, 0);
};


array.foldr = f => acc => xs => xs.reduceRight((acc, x, i) => f(x, acc, i), acc);


array.foldr1 = f => xs => xs.reduceRight((acc, x, i) => f(x, acc, i));


array.foldrk = f => acc => xs => {
  const next = (i, acc) => i < 0
   ? acc
   : f(xs[i], i, acc) (acc => next(i - 1, acc));

  return next(xs.length - 1, acc);
};


array.from = A(Array.from);


array.get = get;


array.has = has;


array.head = xs => xs[0];


array.includes = x => xs => xs.includes(x);


array.init = xs => xs.slice(0, -1);


array.intersect_ = (xs, ys) => {
  const zs = consSet(ys);
  return xs.filter(x => zs.has(x));
};


array.intersect = ys => xs => {
  const zs = consSet(ys);
  return filter(x => zs.has(x));
};


array.isArray = Array.isArray;


array.isEmpty = xs => xs.length === 0;


array.join = x => xs => xs.join(x);


array.last = xs => xs[xs.length - 1];


array.len = xs => xs.length;


array.map = f => xs => xs.map((x, i) => f(x, i));


array.mapcat = f => array.foldr(comp(concat) (f)) ([]);


array.notEqBy = negf2(array.eqBy);


array.of = Array.of;


array.paral = f => acc => xs => {
  const next = (acc, [head, ...tail]) => head === undefined
   ? acc
   : next(f(acc, head, tail), tail);

  return next(acc, xs);
};


array.paralk = f => acc => xs => {
  const next = (acc, [head, ...tail]) => head === undefined
   ? acc
   : f(acc, head, tail, acc => next(acc, tail));

  return next(acc, xs);
};


array.parar = f => acc => xs => {
  const next = (head, acc, tail) => head === undefined
   ? acc
   : next(array.last(tail), f(head, acc, tail), array.init(tail));

  return next(array.last(xs), acc, array.init(xs));
};


array.parark = f => acc => xs => {
  const next = (head, acc, tail) => head === undefined
   ? acc
   : f(head, acc, tail, acc => next(array.last(tail), acc, array.init(tail)));

  return next(array.last(xs), acc, array.init(xs));
};


array.pop = xs => [array.init(xs), array.last(xs)];


array.push_ = (xs, ...args) => xs.concat(args);


array.push = x => xs => xs.concat([x]);


array.range_ = (x, n) => Array(n).fill(x);


array.range = n => x => Array(n).fill(x);


array.reverse = xs => xs.reverse();


array.set = set;


array.shift = xs => [array.head(xs), array.tail(xs)];


array.slice_ = (xs, x, y) => xs.slice(x, y);


array.slice = x => y => xs => xs.slice(x, y);


array.some = f => xs => xs.some((x, i) => f(x, i));


array.sort = xs => xs.sort();


array.sortBy = f => xs => xs.sort((x, i) => f(x, i));


array.subset = x => ({[x]:a}) => [a];


array.subset2 = (x, y) => ({[x]:a, [y]:b}) => [a, b];


array.subset3 = (x, y, z) => ({[x]:a, [y]:b, [z]:c}) => [a, b, c];


array.subset4 = (w, x, y, z) => ({[w]:a, [x]:b, [y]:c, [z]:d}) => [a, b, c, d];


array.subset5 = (v, w, x, y, z) => ({[v]:a, [w]:b, [x]:c, [y]:d, [z]:e}) => [a, b, c, d, e];


array.sum = xs => xs.reduce(add_, 0) (xs);


array.swap = (x, y) => ([...xs]) => xs.length > 1 ? ([xs[x], xs[y]] = [xs[y], xs[x]], xs) : xs;


array.tail = xs => xs.slice(1);


array.take = n => xs => xs.slice(0, n);


array.union_ = (xs, ys) => {
  const zs = consSet(xs);
  return flip(concat) (xs) (ys.filter(x => zs.has(x)
   ? false
   : zs.add(x)));
};


array.union = ys => xs => {
  const zs = consSet(xs);
  return flip(concat) (xs) (ys.filter(x => zs.has(x)
   ? false
   : zs.add(x)));
};


array.unshift_ = (xs, ...args) => [...args].concat(xs);


array.unshift = x => xs => [x].concat(xs);


array.zip_ = (xs, ys) => {
  const next = (acc, i) => xs.length <= i || ys.length <= i
     ? acc
     : next(acc.concat([[xs[i], ys[i]]]), i + 1);

  return next([], 0);
};


array.zip = ys => xs => {
  const next = (acc, i) => xs.length <= i || ys.length <= i
     ? acc
     : next(acc.concat([[xs[i], ys[i]]]), i + 1);

  return next([], 0);
};


array.zip3_ = (xs, ys, zs) => {
  const next = (acc, i) => xs.length <= i || ys.length <= i || zs.length <= i
     ? acc
     : next(acc.concat([[xs[i], ys[i], zs[i]]]), i + 1);

  return next([], 0);
};


array.zip3 = ys => zs => xs =>  {
  const next = (acc, i) => xs.length <= i || ys.length <= i || zs.length <= i
     ? acc
     : next(acc.concat([[xs[i], ys[i], zs[i]]]), i + 1);

  return next([], 0);
};


array.zip4_ = (ws, xs, ys, zs) => {
  const next = (acc, i) => ws.length <= i || xs.length <= i || ys.length <= i || zs.length <= i
     ? acc
     : next(acc.concat([[ws[i], xs[i], ys[i], zs[i]]]), i + 1);

  return next([], 0);
};


array.zip4 = xs => ys => zs => ws => {
  const next = (acc, i) => ws.length <= i || xs.length <= i || ys.length <= i || zs.length <= i
     ? acc
     : next(acc.concat([[ws[i], xs[i], ys[i], zs[i]]]), i + 1);

  return next([], 0);
};


array.zip5_ = (vs, ws, xs, ys, zs) => {
  const next = (acc, i) => vs.length <= i || ws.length <= i || xs.length <= i || ys.length <= i || zs.length <= i
     ? acc
     : next(acc.concat([[vs[i], ws[i], xs[i], ys[i], zs[i]]]), i + 1);

  return next([], 0);
};


array.zip5 = ws => xs => ys => zs => vs => {
  const next = (acc, i) => vs.length <= i || ws.length <= i || xs.length <= i || ys.length <= i || zs.length <= i
     ? acc
     : next(acc.concat([[vs[i], ws[i], xs[i], ys[i], zs[i]]]), i + 1);

  return next([], 0);
};


array.zipWith = f => xs => ys => {
  const next = (acc, i) => xs.length <= i || ys.length <= i
     ? acc
     : next(acc.concat([f(xs[i], ys[i])]), i + 1);

  return next([], 0);
};


array.zipWith3 = f => xs => ys => zs => {
  const next = (acc, i) => xs.length <= i || ys.length <= i || zs.length <= i
     ? acc
     : next(acc.concat([f(xs[i], ys[i], zs[i])]), i + 1);

  return next([], 0);
};



array.zipWith4 = f => ws => xs => ys => zs => {
  const next = (acc, i) => ws.length <= i || xs.length <= i || ys.length <= i || zs.length <= i
     ? acc
     : next(acc.concat([f(ws[i], xs[i], ys[i], zs[i])]), i + 1);

  return next([], 0);
};


array.zipWith5 = f => vs => ws => xs => ys => zs => {
  const next = (acc, i) => vs.length || ws.length <= i || xs.length <= i || ys.length <= i || zs.length <= i
     ? acc
     : next(acc.concat([f(vs[i], ws[i], xs[i], ys[i], zs[i])]), i + 1);

  return next([], 0);
};


module.exports = array;