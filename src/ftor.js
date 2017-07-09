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

const TYPE_CHECK = true;


/******************************************************************************
*******************************************************************************
****************************[ 2. META PROGRAMMING ]****************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
********************************[ 2.1. TYPES ]*********************************
******************************************************************************/


// --[ ARITY CONTRACTS ]-------------------------------------------------------


// arity (rev 0)
// Number -> (...(? -> ?)) -> Array -> {status: String -> Error}

const arity = n => (...cs) => args => {
  if (args.length !== n) return {status: ArityError, nominal: n, real: args.length};

  const aux = ([c, ...cs], n) => {
    const r = c(args[n]);
    if (r.status === TypeError) return (r.pos = n, r);
    if (cs.length === 0) return {status: NoError};
    return aux(cs, n + 1);
  };

  return aux(cs, 0);
};


// nullary (rev 0)
// (...(? -> ?)) -> [] -> {status: String -> Error}

const nullary = (...cs) => args => {
  if (args.length !== 0) return {status: TypeError, nominal: 0, real: args.length};
  return {status: NoError};
};


// unary (rev 0)
// (...(? -> ?)) -> [a] -> {status: String -> Error}

const unary = arity(1);


// binary (rev 0)
// (...(? -> ?)) -> [a, b] -> {status: String -> Error}

const binary = arity(2);


// ternary (rev 0)
// (...(? -> ?)) -> [a, b, c] -> {status: String -> Error}

const ternary = arity(3);


// compare by (rev 0)
// String -> (a -> Boolean) -> Array -> {status: String -> Error}

const compareBy = s => p => xs => p(xs.length)
 ? {status: NoError}
 : {status: TypeError, nominal: s, real: xs.length};


// length of (rev 0)
// Number -> [a] -> Object

const lenOf = n => compareBy(n) (eq);


// --[ MONOMORPHIC CONTRACTS ]-------------------------------------------------


// array (rev0)
// a -> {status: String -> Error}

const arr = xs => Array.isArray(x)
 ? {status: NoError}
 : {status: TypeError, nominal: "Array", real: introspect(xs).join("/")};

arr.toString = () => "Array";


// boolean (rev0)
// a -> {status: String -> Error}

const boo = b => typeof b === "boolean"
 ? {status: NoError}
 : {status: TypeError, nominal: "Boolean", real: introspect(b).join("/")};

boo.toString = () => "Boolean";


// number (rev0)
// a -> {status: String -> Error}

const num = n => typeof n === "number"
 ? {status: NoError}
 : {status: TypeError, nominal: "Number", real: introspect(n).join("/")};

num.toString = () => "Number";


// string (rev0)
// a -> {status: String -> Error}

const str = s => typeof s === "string"
 ? {status: NoError}
 : {status: TypeError, nominal: "String", real: introspect(s).join("/")};

str.toString = () => "String";


// --[ POLYMORPHIC CONTRACTS ]-------------------------------------------------


// array of (rev 0)
// (...(? -> ?)) -> a -> {status: String -> Error}

const arrOf = c => xs => {
  if (!Array.isArray(xs)) return {status: TypeError, nominal: `[${c}]`, real: introspect(xs).join("/")};
  if (!("type" in xs)) return {status: TypeError, nominal: `[${c}]`, real: "heterogeneous Array"};
  if (xs.type !== `[${c}]`) return {status: TypeError, nominal: `[${c}]`, real: xs.type};
  return {status: NoError};
};


// --[ PROXY ]-----------------------------------------------------------------


// virtualize (rev 0)
// (String, Function, [? -> ?]) -> Function

const virt = (name, f, ...cs) => {
  if (TYPE_CHECK) {
    const g = new Proxy(f, handleType(name, cs));
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
        throw new TypeError(`${name} expects value of type ${nominal} (${real} received)`);
      }

      case NoError: break;

      default: throw new TypeSysError(`Error constructor expected (${introspect(r.constructor).join("/")} received)`);
    }

    if (cs.length === 1) {
      const x = f(...args),
       r = cs[0] (x);

      switch (r.status) {
        case ReturnTypeError: {
          const {nominal, real} = r;
          throw new ReturnTypeError(`${name} must return a(n) ${nominal} (${real} returned)`);
        }
      }

      return x;
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

    case "function": return x.name !== ""
     ? ["Function", x.name]
     : ["Function"];

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


// --[ MISC ]------------------------------------------------------------------


// contract
// defer contract composition
// (((a -> b) -> [c] -> d), (a -> b)) -> [c] -> d

const con = (f, g) => xs => f(g) (xs);


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


// Type System Error (rev 0)
// String -> TypeSysError

class TypeSysError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, TypeSysError);
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

/*const Tuple = (...cs) => {
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
};*/


/******************************************************************************
*******************************************************************************
*******************************[ 5. SUM TYPES ]********************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
*******************************************************************************
**************************[ 6. ABSTRACT DATA TYPES ]***************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
*******************************************************************************
*******************************[ 7. PRIMITIVES ]*******************************
*******************************************************************************
******************************************************************************/


// equal (rev 0)
// a -> a -> Boolean

const eq = x => y => Object.is(x, y);


/******************************************************************************
*******************************************************************************
******************************[ 8. COMBINATORS ]*******************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
*******************************************************************************
*********************************[ 9. ARROWS ]*********************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
*******************************************************************************
*******************************[ 10. DEBUGGING ]*******************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
*******************************************************************************
*********************************[ 99. MISC ]**********************************
*******************************************************************************
******************************************************************************/


// get symbol (rev 0)
// String -> Object -> [?]

const get$ = s => o => o[Symbol.for(SYM_PREFIX + s)];


// API


module.exports = {
  arity,
  ArityError,
  arr,
  arrOf,
  binary,
  boo,
  compareBy,
  eq,
  Err,
  get$,
  getType,
  instanceOf,
  introspect,
  lenOf,
  NoError,
  nullary,
  num,
  ReturnTypeError,
  str,
  _throw,
  ternary,
  throwIfNot,
  /*Tuple,*/
  TypeSysError,
  unary,
  virt
};