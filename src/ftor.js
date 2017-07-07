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
// internal
// String

const SYM_PREFIX = "ftor/";


// type check (rev 0)
// internal
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


// --[ CONTRACTS ]-------------------------------------------------------------


// unary (rev 0)
// (? -> ?) -> [a] -> {x: a, status: String -> Error}

const unary = c => args => args.length === 1
 ? c(args[0])
 : {x: args[0], status: ArityError, nominal: 1, real: args.length};


// length of (rev 0)
// Number -> [a] -> Object

const lenOf = n => xs => xs.length === n
 ? {x: xs, status: NoError}
 : {x: xs, status: TypeError, nominal: n, real: xs.length};


// number (rev0)
// a -> {x: a, status: String -> Error}

const num = x => typeof x === "number"
 ? {x: x, status: NoError}
 : {x: x, status: TypeError, nominal: "Number", real: introspect(x).join("/")};


// to string
// () -> String

num.toString = () => "Number";


// --[ PROXY ]-----------------------------------------------------------------


// virtualize (rev 0)
// (String, Function, [() -> ? -> ?]) -> Function

const virt = (name, f, ...cs) => {
  if (TC) {
    const g = new Proxy(f, handleType(name, cs.map(f => f())));
    g.toString = Function.prototype.toString.bind(f);
    return g;
  }

  return f;
};


// handle type (rev 0)
// internal
// handle apply traps for virtualized functions
// (String, [? -> ?]) -> Function

const handleType = (name, [c, ...cs]) => ({
  apply: (f, _, args) => {
    const r = c(args);

    switch(r.status) {
      case ArityError: {
        const {nominal, real} = r;
        throw new ArityError(`${name} expects ${nominal} argument(s) (${real} received)`);
      }

      case TypeError: {
        const {nominal, real} = r;
        throw new TypeError(`${name} expects a(n) ${nominal} (${real} received)`);
      }

      case NoError: break;

      default: throw new TypeError(`Error constructor expected (${introspect(r.constructor).join("/")} received)`);
    }

    if (cs.length === 1) {
      const r = cs[0] (f(...args));

      switch (r.status) {
        case ReturnTypeError: {
          const {nominal, real} = r;
          throw new ReturnTypeError(`${name} must return a(n) ${nominal} (${real} returned)`);
        }
      }

      return r.x;
    }

    const g = new Proxy(f(...args), handle(type, name, cs))
    g.toString = Function.prototype.toString.bind(f);
    return g;
  },

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
    case "function": return x.name !== "" ? ["Function", x.name] : ["Function"];

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
// (String -> Error) -> Object -> Error

const Err = cons => o => {
  const e = new cons();
  e[Symbol.for(SYM_PREFIX + "errArgs")] = o;
  return e;
};


// --[ SUBCLASS CONSTRUCTORS ]-------------------------------------------------


// Arity Error (rev 0)
// String -> ArityError

class ArityError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ArityError);
  }
};


// No Error (rev 0)
// String -> NoError

class NoError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, NoError);
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
// (String -> Error) -> String -> IO

const _throw = cons => s => {throw new cons(s)};


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
  Tuple.of = iter => Tuple(...iter);
  return Tuple.toString = () => type, Tuple;
};


/******************************************************************************
*******************************************************************************
*********************************[ 10. MISC ]**********************************
*******************************************************************************
******************************************************************************/


// get symbol (rev 0)
// String -> Object -> [?]

const get$ = s => o => o[Symbol.for(SYM_PREFIX + s)];


// API


module.exports = {
  ArityError,
  Err,
  get$,
  getType,
  instanceOf,
  introspect,
  lenOf,
  NoError,
  num,
  ReturnTypeError,
  _throw,
  throwIfNot,
  Tuple,
  virt
};