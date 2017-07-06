"use strict";

/******************************************************************************
*******************************************************************************
***********************************[ FTOR ]************************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
*******************************************************************************
*******************************[ 1. CONSTANTS ]********************************
*******************************************************************************
******************************************************************************/

// symbol prefix (rev 0)
// String

const SYM_PREFIX = "ftor/";


// type check (rev 0)
// Boolean

const TC = true;


/******************************************************************************
*******************************************************************************
****************************[ 2. META PROGRAMMING ]****************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
********************************[ 2.1. TYPES ]*********************************
******************************************************************************/


// --[ PROXY ]-----------------------------------------------------------------


// virtualize (rev 0)
// Object -> (String, Function) -> (...? -> ?) -> Function

const virtualize = handler => (name, f) => (...cs) => {
  // create new proxy instance
  const g = new Proxy(f, handler(name, cs));

  // enable string coercion for apply traps
  g.toString = Function.prototype.toString.bind(f);

  return g;
};


// handle (rev 0)
// handle apply traps for virtualized functions
// (String, [? -> ?]) -> Function

const handleType = (name, [c, ...cs]) => ({
  // apply trap
  apply: (f, _, args) => {
    let g, r;

    // type check
    r = c(args)

    // handle type mismatch
    if (Error.prototype.isPrototypeOf(r)) {
      const [x, y] = get$("errArgs") (r);

      switch (r.constructor) {
        case ArityError: {
          throw new ArityError(`${name} expects ${x} argument(s) (${y} received)`);
        }

        case TypeError: {
          throw new TypeError(`${name} expects a(n) ${x} (${y} received)`);
        }
      }
    }

    // produce the return value
    if (cs.length === 1) {
      // return type check
      r = cs[0] (f(...args));

      // handle type mismatch
      if (Error.prototype.isPrototypeOf(r)) {
        const [x, y] = getErr$(r);
        throw new ReturnTypeError(`${name} must return a(n) ${x} (${y} returned)`);
      }

      return r;
    }

    // create new proxy instance
    g = new Proxy(f(...args), handle(type, name, cs))

    // enable string coercion for apply traps
    g.toString = Function.prototype.toString.bind(f);

    return g;
  },

  // get trap
  get: (o, k) => k === "name" ? name : o[k]
});


// --[ REFLECTION ]------------------------------------------------------------


// get type (rev 0)
// a -> String

const getType = x => Object.prototype.toString.call(x).split(" ")[1].slice(0, -1);


// instance of (rev 0)
// a -> Boolean

const instanceOf = cons => o => cons.prototype.isPrototypeOf(o);


// introspect (rev 0)
// a -> [String]

const introspect = x => {
  switch (typeof x) {
    case "undefined": return ["Undefined"];

    case "number": {
      if (isNaN(x)) return ["Number", "NaN"];
      if (!isFinite(x)) return  ["Number", "Infinity"];
      return ["Number"];
    }

    case "string": return ["String"];
    case "boolean": return ["Boolean"];
    case "symbol": return ["Symbol"];
    case "function": return ["Function"];

    case "object": {
      if (x === null) return ["Null"];
      return Array.from(new Set([
        "Object",
        getType(x),
        x.constructor.name
      ]));
    }
  }
};


// --[ CONTRACTS ]-------------------------------------------------------------


// length of (rev 0)
// Number -> [a] -> [a]|TypeError (String [?])

const lenOf = n => xs => xs.length === n ? xs : Err(TypeError) (introspect(xs));


// number (rev0)
// Number -> Number|TypeError (String [?])

const num = x => typeof x === "number" ? x : Err(TypeError) (introspect(x));


// to string (rev 0)
// () -> String

num.toString = () => "Number";


/******************************************************************************
*******************************************************************************
*******************************[ 3. PROTOTYPES ]*******************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
********************************[ 3.1. ERROR ]*********************************
******************************************************************************/


// --[ CONSTRUCTOR ]-----------------------------------------------------------


// Error (rev 0)
// (String -> Error) -> (...?) -> Error (String [?])

const Err = cons => (...args) => {
  const e = new cons();
  e[Symbol.for("ftor/errArgs")] = args;
  return e;
};


// --[ SUBCLASS CONSTRUCTOR ]--------------------------------------------------


// Arity Error (rev 0)
// String -> ArityError

class ArityError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ArityError);
  }
};


// Return Type Error (rev 0)
// String -> ReturnTypeError

class ReturnTypeError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ReturnTypeError);
  }
};


// --[ THROWING ]--------------------------------------------------------------


// throw (rev 0)
// String -> Error -> IO

const _throw = msg => e => {e.message = msg; throw e};


// throw if not (rev 0)
// todo: replace with sum type
// a -> (a -> String) -> a|IO

const throwIfNot = x => f => {
  if (Error.prototype.isPrototypeOf(x)) {x.message = f(x); throw x};
  return x;
};


/******************************************************************************
*******************************************************************************
*****************************[ 4. PRODUCT TYPES ]******************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
********************************[ 4.1. TUPLES ]********************************
******************************************************************************/


// Tuple (rev 0)
// (...? -> ?) -> (...?) -> (?)

const Tuple = (...cs) => {
  const Tuple = (...args) => {
    throwIfNot(lenOf(cs.length) (args)) (_ => `${type} expects ${cs.length} field(s) (${args.length} field(s) received)`);

    args.forEach((x, i) => {
      throwIfNot(cs[i] (x)) (x => `${type} expects ${cs[i]} at ${i + 1} (${get$("errArgs") (x).join("/")} received)`);
    });

    args.cs = cs;
    args.type = type;
    return Object.freeze(args);
  };

  const type = "(" + cs.reduce((acc, c) => `${acc}${c},`, "").slice(0, -1) + ")";
  Tuple.ofArr = xs => Tuple(...xs);
  Tuple.ofObj = k => o => Tuple(k, o[k]);
  return Tuple.toString = () => type, Tuple;
};


// of Array
// (...? -> ?) -> [?] -> (String, ?)

Tuple.ofArr = (...cs) => xs => Tuple(...cs) (...xs);


// of Object
// (...? -> ?) -> {?} -> (String, ?)

Tuple.ofObj = (...cs) => k => o => Tuple(...cs) (k, o[k]);


/******************************************************************************
*******************************************************************************
*********************************[ 10. MISC ]**********************************
*******************************************************************************
******************************************************************************/


// get symbol (rev 0)
// Error (String [?]) -> [?]

const get$ = s => o => o[Symbol.for(SYM_PREFIX + s)];


// API


module.exports = {
  ArityError,
  Err,
  get$,
  getType,
  handleType,
  instanceOf,
  introspect,
  lenOf,
  num,
  ReturnTypeError,
  _throw,
  throwIfNot,
  Tuple,
  virtualize
};