"use strict";


// dependencies


const I = require("../I");


/**
 * @name Tuple
 * @note combined namespace/constructor
 * @type product type
 * @status stable
 * @example

  const Tuple = (...args) => f => f(...args);
  Tuple.toArray = tx => tx((...args) => args);
  const triple = Tuple(1, "a", true);

  Tuple.toArray(triple); // [1, "a", true]

 */


const Tuple = (...args) => f => f(...args);


/**
 * @name from Array
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => f => f(...args);
  Tuple.fromArray = f => args => f(...args);

  Tuple.fromArray((x, y) => x + y) ([2, 3]); // 5

 */

// ((*) -> a) -> [*] -> a
Tuple.fromArray = f => args => f(...args);


/**
 * @name get
 * @type first order function
 * @status stable
 * @example

  const Tuple = (...args) => f => f(...args);
  Tuple.get2 = tx => tx((x, y) => y);

  Tuple.get2(Tuple(1, "a", true)); // "a"

 */


// ((*) -> a) -> a
Tuple.get1 = tx => tx(I);


// ((*) -> a) -> a
Tuple.get2 = tx => tx((x, y) => y);


// ((*) -> a) -> a
Tuple.get3 = tx => tx((x, y, z) => z);


/**
 * @name get nth
 * @type first order function
 * @status stable
 * @example

  const Tuple = (...args) => f => f(...args);
  Tuple.getn = n => tx => tx((...args) => args[n - 1]);

  Tuple.getn(2) (Tuple(1, "a", true)); // "a"

 */


// Number -> ((*) -> a) -> a
Tuple.getn = n => tx => tx((...args) => args[n - 1]);


/**
 * @name has
 * @type first order function
 * @status stable
 * @example

  const Tuple = (...args) => f => f(...args);
  Tuple.has = x => tx => tx((...args) => args.includes(x));

  const triple = Tuple(1, "a", true);

  Tuple.has("a") (triple); // true
  Tuple.has(2) (triple); // false

 */


// a -> ((*) -> b) -> Boolean
Tuple.has = x => tx => tx((...args) => args.includes(x));


/**
 * @name last
 * @type first order function
 * @status stable
 * @example

  const Tuple = (...args) => f => f(...args);
  Tuple.last = tx => tx((...args) => args[args.length - 1]);

  const tuple5 = Tuple(1, "a", true, {foo: true}, ["bar"]);
  Tuple.last(tuple5); // ["bar"]

 */


// ((*) -> a) -> a
Tuple.last = tx => tx((...args) => args[args.length - 1]);


/**
 * @name length
 * @type first order function
 * @status stable
 * @example

  const Tuple = (...args) => f => f(...args);
  Tuple.len = tx => tx((...args) => args.length);

  Tuple.len(Tuple(1, "a", true)); // 3

 */


// ((*) -> a) -> Number
Tuple.len = tx => tx((...args) => args.length);


/**
 * @name map
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => f => f(...args);
  Tuple.toArray = tx => tx((...args) => args);
  Tuple.map2 = f => tx => tx((x, y, ...args) => Tuple(x, f(y), ...args));

  const toUC = x => x.toUpperCase();

  const triple = Tuple.map2(toUC) (Tuple(1, "a", true));
  Tuple.toArray(triple); // [1, "A", true]

 */


// (a -> b) -> ((*) -> c) -> ((*) -> c)
Tuple.map1 = f => tx => tx((x, ...args) => Tuple(f(x), ...args));


// (a -> b) -> ((*) -> c) -> ((*) -> c)
Tuple.map2 = f => tx => tx((x, y, ...args) => Tuple(x, f(y), ...args));


// (a -> b) -> ((*) -> c) -> ((*) -> c)
Tuple.map3 = f => tx => tx((x, y, z, ...args) => Tuple(x, y, f(z), ...args));


/**
 * @name to array
 * @type first order function
 * @status stable
 * @example

  const Tuple = (...args) => f => f(...args);
  Tuple.toArray = tx => tx((...args) => args);

  Tuple.toArray(Tuple(1, "a", true)); // [1, "a", true]

 */


// (*) -> [*]
Tuple.toArray = tx => tx((...args) => args);


/**
 * @name uncurry
 * @type higher order function
 * @status stable
 * @example

  const Tuple = (...args) => f => f(...args);
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