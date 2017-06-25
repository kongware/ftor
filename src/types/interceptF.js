"use strict";


/**
 * @name intercept function calls
 * @note impure
 * @type action
 * @status stable
 * @example

  const interceptF = (tag, f) => (...cs) => new Proxy(f, handleF(cs, tag));

  const handleF = ([c, ...cs], tag) => ({ apply: (f, _, args) => {
    let g;

    // validate contract
    c(args, tag);

    // produce the return value
    if (cs.length === 1) return cs[0](tag) (f(...args));

    // create new proxy
    g = new Proxy(f(...args), handleF(cs, tag))

    // set name property to avoid debugging of anonymous lambdas
    Object.defineProperty(g, "name", {value: tag});

    // enable to-string-coercion for "proxified" functions
    g.toString = Function.prototype.toString.bind(f);

    return g;
  }});

  const unary = c => (args, tag) =>
   args.length === 1
    ? (c(tag) (args[0]), args)
    : throwType(`${tag} expects one argument (${args.length} given)`);

  const binary = (c1, c2) => (args, tag) =>
   args.length === 2
    ? (c1(tag) (args[0]), c2(tag) (args[1]), args)
    : throwType(`${tag} expects two arguments (${args.length} given)`);

  const ternary = (c1, c2, c3) => (args, tag) =>
   args.length === 3
    ? (c1(tag) (args[0]), c2(tag) (args[1]), c3(tag) (args[2]), args)
    : throwType(`${tag} expects three arguments (${args.length} given)`);

  const nary = c => (tag, args) => args.forEach(x => c(tag) (x)); 

  const isNum = tag => x => typeof x === "number" ? x : throwType(`${tag} expects a number (${typeof x} given)`);
  const reNum = tag => x => typeof x === "number" ? x : throwType(`${tag} returned a ${typeof x} (instead of a number)`);

  const isStr = tag => x => typeof x === "string" ? x : throwType(`${tag} expects a string (${typeof x} given)`);
  const reStr = tag => x => typeof x === "string" ? x : throwType(`${tag} returned a ${typeof x} (instead of a string)`);

  const isFun = tag => f => typeof f === "function" ? f : throwType(`${tag} expects a function (${typeof f} given)`);

  const isAny = tag => I;
  const reAny = tag => I;

  const throw_ = cons => template => {throw new cons(template)};
  const throwType = throw_(TypeError);

  const K = x => y => x;
  const I = x => x; 

  // type checking of a curried function

  const add = interceptF("add", x => y => x + y) (unary(isNum), unary(isNum), reNum);

  add(2) (3); // 5
  add("2") (3); // TypeError: add expects a number (string given)
  add(2) (); // TypeError: add expects one argument (0 given)
  add(2) (3, 4); // TypeError: add expects one argument (2 given)

  // type checking of a multi-argument function

  const sum3 = interceptF("sum3", (x, y, z) => x + y + z) (ternary(isNum, isNum, isNum), reNum);

  sum3(1, 2, 3); // 6
  sum3(1, true, 3); // TypeError: sum3 expects a number (boolean given)
  sum3(1, 2); // TypeError: sum3 expects three arguments (2 given)
  sum3(1, 2, 3, 4); // TypeError: sum3 expects three arguments (4 given)

  // type checking of a variadic function

  const sum = interceptF("sum", (...xs) => xs.reduce((acc, x) => acc + x, 0)) (nary(isNum), reNum);

  sum(1, 2, 3, 4, 5); // 15
  sum(); // 0
  sum(1, "2", 3, 4, 5); // TypeError: sum expects a number (string given)

  // type checking of a parametric polymorphic function

  const comp = interceptF("comp", f => g => x => f(g(x))) (unary(isFun), unary(isFun), unary(isAny), reAny);
  const comp2 = comp(comp) (comp);

  const sqr = interceptF("sqr", x => x * x) (unary(isNum), reNum);
  const concat = interceptF("concat", x => y => x.concat(y)) (unary(isStr), unary(isStr), reStr);

  comp2(sqr) (add) (2) (3); // 25
  comp2(true) (add) (2) (3); // TypeError: comp expects a function (boolean given)
  comp2(sqr) (add) (2) ("3"); // TypeError: add expects a number (string given)
  comp2(sqr) (add) (2) (); // TypeError: add expects one argument (0 given)
  comp2(sqr, sqr) (add) (2) (3); // TypeError: comp expects one argument (2 given)
  comp2(sqr) (concat) ("a") ("b"); // TypeError: sqr expects a number (string given)

 */


// ?
const interceptF = (tag, f) => (...cs) => {
  // create a proxy instance
  const g = new Proxy(f, handleF(tag, cs));

  // set name property to avoid anynomous apply traps
  Object.defineProperty(g, "name", {value: tag});

  // enable string coercion for apply traps
  g.toString = Function.prototype.toString.bind(f);

  return g;
};


// ?
const handleF = (tag, [c, ...cs]) => ({ apply: (f, _, args) => {
  let g;

  // validate contract
  c(args, tag);

  // produce the return value
  if (cs.length === 1) return cs[0](tag) (f(...args));

  // create new proxy
  g = new Proxy(f(...args), handleF(tag, cs))

  // set name property to avoid anynomous apply traps
  Object.defineProperty(g, "name", {value: tag});

  // enable string coercion for apply traps
  g.toString = Function.prototype.toString.bind(f);

  return g;
}});


// API


module.exports = interceptF;