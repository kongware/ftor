"use strict";


// dependencies


const compareBy = require("./compareBy");
const eq = require("../primitive/eq");
const I = require("../I");


/**
 * @name Tuple
 * @note combined namespace/constructor; iterable
 * @type product type
 * @status stable
 * @example

  const Tuple = (...args) => f => f(...args);
  Tuple.toArray = tx => tx((...args) => args);
  const triple = Tuple(1, "a", true);

  Tuple.toArray(triple); // [1, "a", true]

 */


// (*) -> ((*) -> r) -> r
const Tuple = (...args) => {
  const Tuple = f => f(...args);
  Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
  return Tuple;
}


/**
 * @name bimap
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.toArray = tx => tx((...args) => args);
  Tuple.bimap = f => g => tx => tx((x, y) => Tuple(f(x), g(y)));

  const inc = x => x + 1
  const toUC = x => x.toUpperCase();
  const pair = Tuple.bimap(inc) (toUC) (Tuple(1, "a"));

  Tuple.toArray(pair); // [2, "A"]

 */


// (a -> b) -> (c -> d) -> ((a, c) -> r) -> ((b, d) -> r)
Tuple.bimap = f => g => tx => tx((x, y) => Tuple(f(x), g(y)));


/**
 * @name concat
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.toArray = tx => tx((...args) => args);
  Tuple.concat = tx => ty => tx((...argsx) => ty((...argsy) => Tuple(...argsx, ...argsy)));

  const tuple = Tuple.concat(Tuple(1, "a")) (Tuple(true));
  Tuple.toArray(tuple); // [1, "a", true]

 */


// ((*) -> r) -> ((*) -> r) -> ((*) -> r)
Tuple.concat = tx => ty => tx((...argsx) => ty((...argsy) => Tuple(...argsx, ...argsy)));


// ((*) -> r) -> ((*) -> r) -> ((*) -> r)
Tuple.concat_ = ty => tx => tx((...argsx) => ty((...argsy) => Tuple(...argsx, ...argsy)));


/**
 * @name concat by
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.toArray = tx => tx((...args) => args);
  
  Tuple.concatBy2 = (...concat) => tx => ty =>
   tx((x1, y1) => ty((x2, y2) => Tuple(concat[0](x1) (x2), concat[1](y1) (y2))));

  const add = x => y => x + y;
  const concat = x => y => x.concat(y);
  const pair = Tuple.concatBy2(add, concat) (Tuple(1, "a")) (Tuple(2, "b"));

  Tuple.toArray(pair); // [3, "ab"]

 */


// ((a -> a -> a)) -> (a -> r) -> (a -> r) -> (a -> r)
Tuple.concatBy = concat => tx => ty =>
 tx(x => ty(y => Tuple(concat(x) (y))));


// ((a -> a -> a) -> (b -> b -> b)) -> ((a, b) -> r) -> ((a, b) -> r) -> ((a, b) -> r)
Tuple.concatBy2 = (...concat) => tx => ty =>
 tx((x1, y1) => ty((x2, y2) => Tuple(concat[0](x1) (x2), concat[1](y1) (y2))));


// ((a -> a -> a) -> (b -> b -> b) -> (c -> c -> c)) -> ((a, b, c) -> r) -> ((a, b, c) -> r) -> ((a, b, c) -> r)
Tuple.concatBy3 = (...concat) => tx => ty =>
 tx((x1, y1, z1) => ty((x2, y2, z2) => Tuple(concat[0](x1) (x2), concat[1](y1) (y2), concat[2](z1) (z2))));


/**
 * @name empty
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.toArray = tx => tx((...args) => args);
  Tuple.empty = Tuple();

  Tuple.toArray(Tuple.empty); // []

 */


// (() -> )
Tuple.empty = Tuple();


/**
 * @name equal
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  const compareBy = pred => ix => iy => {
    const aux = (ix, iy) => {
      const {value: x} = ix.next(), {value: y} = iy.next();

      if (x === undefined && y === undefined) return true;
      else if (!pred(x) (y)) return false;
      else return aux(ix, iy);
    };

    return aux(ix[Symbol.iterator](), iy[Symbol.iterator]())
  };

  const eq = x => y => Object.is(x, y);
  Tuple.eq = compareBy(eq);

  const tripleA = Tuple(1, "a", true),
   tripleB = Tuple(1, "a", true),
   tripleC = Tuple(1, "b", true);


  Tuple.eq(tripleA) (tripleB); // true
  Tuple.eq(tripleA) (tripleC); // false

 */


// (a -> a -> Boolean) -> Iterable a -> Iterable a -> Boolean
Tuple.eq = compareBy(eq);


/**
 * @name equal by
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.len = tx => tx((...args) => args.length);

  Tuple.eqBy2 = (...eq) => tx => ty => Tuple.len(tx) === Tuple.len(ty)
   && tx((x1, y1) => ty((x2, y2) => eq[0](x1) (x2) && eq[1](y1) (y2)));

  const o = {foo: true, bar: 1}, p = {foo: true, bar: 2}, q = {foo: false, bar: 3},
   xs = [1, 2, 3], ys = [4, 5, 6], zs = [1, 2];

  const fooEq = o => p => o.foo === p.foo;
  const lenEq = xs => ys => xs.length === ys.length;

  Tuple.eqBy2(fooEq, lenEq) (Tuple(o, xs)) (Tuple(p, ys)); // true
  Tuple.eqBy2(fooEq, lenEq) (Tuple(o, xs)) (Tuple(q, ys)); // false
  Tuple.eqBy2(fooEq, lenEq) (Tuple(o, xs)) (Tuple(p, zs)); // false

 */


// (a -> Boolean) -> (a -> Boolean) -> (a -> Boolean) -> Boolean
Tuple.eqBy = eq => tx => ty => Tuple.len(tx) === Tuple.len(ty)
 && tx(x => ty(y => eq[0](y) (x)));


// ((a -> Boolean), (b -> Boolean)) -> ((a, b) -> Boolean) -> ((a, b) -> Boolean) -> Boolean
Tuple.eqBy2 = (...eq) => tx => ty => Tuple.len(tx) === Tuple.len(ty)
 && tx((x1, y1) => ty((x2, y2) => eq[0](x1) (x2) && eq[1](y1) (y2)));


// ((a -> Boolean), (b -> Boolean), (c -> Boolean)) -> ((a, b, c) -> Boolean) -> ((a, b, c) -> Boolean) -> Boolean
Tuple.eqBy3 = (...eq) => tx => ty => Tuple.len(tx) === Tuple.len(ty)
 && tx((x1, y1, z1) => ty((x2, y2, z2) => eq[0](x1) (x2) && eq[1](y1) (y2) && eq[2](z1) (z2)));


/**
 * @name from Array
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.get1 = tx => tx(I);
  Tuple.get2 = tx => tx((x, y) => y);
  Tuple.fromArray = args => Tuple(...args);

  const I = x => x;
  const pair = Tuple.fromArray([1, "a"]);

  Tuple.get1(pair); // 1
  Tuple.get2(pair); // "a"

 */


// [*] -> ((*) -> r)
Tuple.fromArray = args => Tuple(...args);


/**
 * @name get
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.get2 = tx => tx((x, y) => y);

  Tuple.get2(Tuple(1, "a", true)); // "a"

 */


// ((*) -> r) -> r
Tuple.get1 = tx => tx(I);


// ((*) -> r) -> r
Tuple.get2 = tx => tx((x, y) => y);


// ((*) -> r) -> r
Tuple.get3 = tx => tx((x, y, z) => z);


/**
 * @name get nth
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.getn = n => tx => tx((...args) => args[n - 1]);

  Tuple.getn(2) (Tuple(1, "a", true)); // "a"

 */


// Number -> ((*) -> r) -> r
Tuple.getn = n => tx => tx((...args) => args[n - 1]);


/**
 * @name has
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.has = x => tx => tx((...args) => args.includes(x));

  const triple = Tuple(1, "a", true);

  Tuple.has("a") (triple); // true
  Tuple.has(2) (triple); // false

 */


// a -> ((*) -> Boolean) -> Boolean
Tuple.has = x => tx => tx((...args) => args.includes(x));


/**
 * @name last
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.last = tx => tx((...args) => args[args.length - 1]);

  const tuple5 = Tuple(1, "a", true, {foo: true}, ["bar"]);
  Tuple.last(tuple5); // ["bar"]

 */


// ((*) -> r) -> r
Tuple.last = tx => tx((...args) => args[args.length - 1]);


/**
 * @name length
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.len = tx => tx((...args) => args.length);

  Tuple.len(Tuple(1, "a", true)); // 3

 */


// ((*) -> Number) -> Number
Tuple.len = tx => tx((...args) => args.length);


/**
 * @name map
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.toArray = tx => tx((...args) => args);
  Tuple.map2 = f => tx => tx((x, y, ...args) => Tuple(x, f(y), ...args));

  const toUC = x => x.toUpperCase();

  const triple = Tuple.map2(toUC) (Tuple(1, "a", true));
  Tuple.toArray(triple); // [1, "A", true]

 */


// (a -> b) -> ((*) -> r) -> ((*) -> r)
Tuple.map1 = f => tx => tx((x, ...args) => Tuple(f(x), ...args));


// (a -> b) -> ((*) -> r) -> ((*) -> r)
Tuple.map2 = f => tx => tx((x, y, ...args) => Tuple(x, f(y), ...args));


// (a -> b) -> ((*) -> r) -> ((*) -> r)
Tuple.map3 = f => tx => tx((x, y, z, ...args) => Tuple(x, y, f(z), ...args));


/**
 * @name rotate left
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.toArray = tx => tx((...args) => args);
  Tuple.rotatel = tx => tx((x, y, z) => Tuple(y, z, x));

  const triple = Tuple.rotatel(Tuple(1, "a", true));
  Tuple.toArray(triple); // ["a", true, 1]

 */


// ((a, b, c) -> r) -> ((b, c, a) -> r)
Tuple.rotatel = tx => tx((x, y, z) => Tuple(y, z, x));


/**
 * @name rotate right
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.toArray = tx => tx((...args) => args);
  Tuple.rotater = tx => tx((x, y, z) => Tuple(z, x, y));

  const triple = Tuple.rotater(Tuple(1, "a", true));
  Tuple.toArray(triple); // [true, 1, "a"]

 */


// ((a, b, c) -> r) -> ((c, a, b) -> r)
Tuple.rotater = tx => tx((x, y, z) => Tuple(z, x, y));


/**
 * @name set
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.toArray = tx => tx((...args) => args);
  Tuple.set2 = y => tx => tx((x, _, ...args) => Tuple(x, y, ...args));

  const triple = Tuple.set2("b") (Tuple(1, "a", true));
  Tuple.toArray(triple); // [1, "b", true]

 */


// a -> ((*) -> r) -> ((*) -> r)
Tuple.set1 = x => tx => tx((_, ...args) => Tuple(x, ...args));


// a -> ((*) -> r) -> ((*) -> r)
Tuple.set2 = y => tx => tx((x, _, ...args) => Tuple(x, y, ...args));


// a -> ((*) -> r) -> ((*) -> r)
Tuple.set3 = z => tx => tx((x, y, _, ...args) => Tuple(x, y, z, ...args));


/**
 * @name set nth
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.toArray = tx => tx((...args) => args);
  Tuple.setn = n => x => tx => tx((...args) => (args[n - 1] = x, Tuple(...args)));

  const triple = Tuple.setn(2) ("b") (Tuple(1, "a", true));
  Tuple.toArray(triple); // [1, "b", true]

 */


// Number -> ((*) -> r) -> r
Tuple.setn = n => x => tx => tx((...args) => (args[n - 1] = x, Tuple(...args)));


/**
 * @name swap
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.toArray = tx => tx((...args) => args);
  Tuple.swap = tx => tx((x, y) => Tuple(y, x));

  const pair = Tuple.swap(Tuple(1, "a"));
  Tuple.toArray(pair); // ["a", 1]

 */


// ((a, b) -> r) -> ((b, a) -> r)
Tuple.swap = tx => tx((x, y) => Tuple(y, x));


/**
 * @name to array
 * @type first order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.toArray = tx => tx((...args) => args);

  Tuple.toArray(Tuple(1, "a", true)); // [1, "a", true]

 */


// ((*) -> r) -> [*]
Tuple.toArray = tx => tx((...args) => args);


/**
 * @name uncurry
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  }

  Tuple.uncurry = f => tx => tx((...args) => f(args[0]) (args[1]));

  const add = y => x => x + y;
  const pair = Tuple(2, 3);
   
  Tuple.uncurry(add) (pair); // 5

 */


// (a -> b -> c) -> ((a, b) -> c) -> c
Tuple.uncurry = f => tx => tx((...args) => f(args[0]) (args[1]));


// (a -> b -> c -> d) -> ((a, b, c) -> d) -> d
Tuple.uncurry3 = f => tx => tx((...args) => f(args[0]) (args[1]) (args[2]));


// API


module.exports = Tuple;