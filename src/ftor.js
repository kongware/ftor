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


// --[ GENERAL ]---------------------------------------------------------------


// symbol prefix (rev 0)
// internal
// String

const SYM_PREFIX = "ftor/";


// type check (rev 0)
// internal
// Boolean

const TYPE_CHECK = true;


// --[ SYMBOLS ]---------------------------------------------------------------


// polymorphic type (rev 0.1)
// internal

const $poly = Symbol.for(SYM_PREFIX + "poly");


// monomorphic type (rev 0.1)
// internal

const $mono = Symbol.for(SYM_PREFIX + "mono");


// tag (rev 0.1)

const $tag = Symbol.for(SYM_PREFIX + "tag");


// x (rev 0.1)

const $x = Symbol.for(SYM_PREFIX + "x");


// catamorphism (rev 0.1)

const $cata = Symbol.for(SYM_PREFIX + "cata");



/******************************************************************************
*******************************************************************************
****************************[ 2. META PROGRAMMING ]****************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
********************************[ 2.1. TYPES ]*********************************
******************************************************************************/


// --[ PROXY ]-----------------------------------------------------------------


// virtualize (rev 0.1)
// (String, Function, [? -> ?]) -> Function

const virt = (name, f, ...cs) => {
  if (TYPE_CHECK) {
    if (!isStr(name)) throw new TypeSysError(
      `virt expects value of type "String" at 1 ("${introspect(name).join("/")}" received)`
    );

    if (!isFun(f)) throw new TypeSysError(
      `virt expects value of type "Function" at 2 ("${introspect(f).join("/")}" received)`
    );

    cs.forEach(c => {
      if (!isUnary(c)) throw new TypeSysError(
        `virt expects Array of type "? -> ?" at 3 ("${introspect(c).join("/")}" received)`
      );
    });

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

    if (!isSumOf(Contract) (r)) throw new TypeSysError(
      `${c} must return value of type "Contract (a)" ("${introspect(r).join("/")}" returned)`
    );

    switch(r.status) {
      case ArityError: {
        const {nominal, real} = r;
        throw new ArityError(`${name} expects ${nominal} argument(s) (${real} received)`);
      }

      case TypeError: {
        const {nominal, real, pos} = r;
        throw new TypeError(`${name} expects value of type ${nominal} at ${pos + 1} (${real} received)`);
      }

      case NoError: break;

      default: throw new TypeSysError(`Error constructor expected (${introspect(r.status).join("/")} received)`);
    }

    if (cs.length === 1) {
      const x = f(...args),
       r = cs[0] (x);

      if (!isObj(r) || !has("status") (r) || !isFun(r.status)) throw new TypeSysError(
        `${c.name} must return value of type {status: String -> Error} (${introspect(r).join("/")} returned)`
      );

      switch (r.status) {
        case ReturnTypeError: {
          const {nominal, real} = r;
          throw new ReturnTypeError(`${name} must return value of type ${nominal} (${real} returned)`);
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


// --[ CONTRACT GADT ]---------------------------------------------------------


// Contract (rev 0.1)
// a -> String

const Contract = x => `Contract (${introspect(x).join("/")})`;

Contract.toString = () => "Contract (a)";

Contract[$cata] = cata(Contract, ["Type", "ReturnType"]);


// Type (rev 0.1)
// (a, String, String) -> Contract a

const Type = (x, caller, pos) => {
  if (TYPE_CHECK) {
    if (!isStr(caller)) throw new TypeSysError(
      `Contract expects value of type "String" at 2 ("${introspect(caller).join("/")}" received)`
    );

    if (!isStr(pos)) throw new TypeSysError(
      `Contract expects value of type "String" at 3 ("${introspect(pos).join("/")}" received)`
    );
  }

  const r = {
    [$tag]: Type,
    toString: () => `Type (${x}, ${caller}, ${pos})`,
    x, caller, pos
  };

  if (TYPE_CHECK) {
    r[$poly] = "Contract (a)";
    r[$mono] = Contract(x);
  }

  return Object.freeze(r);
};

Type.toString = () => "Type";


// Return Type (rev 0.1)
// (a, String) -> Contract a

const ReturnType = (x, caller) => {
  if (TYPE_CHECK) {
    if (!isStr(caller)) throw new TypeSysError(
      `Contract expects value of type "String" at 2 ("${introspect(caller).join("/")}" received)`
    );
  }
  
  const r = {
    [$tag]: ReturnType,
    toString: () => `ReturnType (${x}, ${caller})`,
    x, caller
  };

  if (TYPE_CHECK) {
    r[$poly] = "Contract (a)";
    r[$mono] = Contract(x);
  }

  return Object.freeze(r);
};

Type.toString = () => "ReturnType";


// --[ ARITY CONTRACTS ]-------------------------------------------------------


// arity (rev 0)
// Number -> (...Contract (a)) -> Array -> Contract (a)

const arity = n => {
  if (!isNum(n)) throw new TypeSysError(
    `arity expects value of type "Number" at 1 ("${introspect(n).join("/")}" received)`
  );

  const arity = (...cs) => {
    if (!isArrOf(isSumOf(Contract) (cs))) throw new TypeSysError(
      `arity expects value of type "[Contract (a)]" at 2 ("${introspect(cs).join("/")}" received)`
    );

    const arity = args => {
      if (!isArr(args)) throw new TypeSysError(
        `arity expects value of type "Array" at 3 ("${introspect(args).join("/")}" received)`
      );

      if (isFinite(n)) {
        if (args.length !== n) return Violated({err: ArityError, nominal: n, real: args.length});
      }

      const aux = ([c, ...cs], n) => {
        const r = c(args[n]);

        if (!isSumOf(Contract) (r)) throw new TypeSysError(
          `${c} must return value of type Contract (a) (${introspect(r).join("/")} returned)`
        );

        switch (r[$tag]) {
          case Violated: return Object.assign(r, {pos: n});
          case ViolatedAt: return r;
        }

        if (cs.length === 0) return Fulfilled(args);
        return aux(cs, n + 1);
      };

      return aux(cs, 0);
    };

    return arity;
  };

  return arity;
};


// nullary (rev 0)
// [] -> {status: String -> Error}

const nullary = c => {
  if (!isUnary(c)) throw new TypeSysError(
    `arity expects value of type ? -> ? at 1 (${introspect(c).join("/")} received)`
  );

  const nullary = args => {
    if (!isArr(args)) throw new TypeSysError(
      `arity expects value of type Array at 2 (${introspect(args).join("/")} received)`
    );

    if (!isEmpty(args)) return Violated({err: ArityError, nominal: 0, real: args.length});
    return Fulfilled(args);
  };

  return nullary;
};


// unary see at section XX. DERIVED


// binary see at section XX. DERIVED


// ternary see at section XX. DERIVED


// variadic see at section XX. DERIVED


// --[ MONOMORPHIC CONTRACTS ]-------------------------------------------------


// array (rev 0)
// a -> {status: String -> Error}

const arr = x => isArr(x)
 ? {status: NoError}
 : {status: TypeError, nominal: "Array", real: introspect(x).join("/")};

arr.toString = () => "Array";


// boolean (rev 0.1)
// Contract (a) -> Contract (Boolean)

const boo = o => {
  if (!isSumOf(Contract) (o)) throw new TypeSysError(
    `boo expects value of type "Contract (a)" at 1 ("${introspect(o.x).join("/")}" received)`
  );

  if (o[$mono] === "Contract (Boolean)") return o;
  
  Contract.cata({
    Type: ({caller, pos, x}) => {
      throw new TypeError(`${caller} expects value of type "Boolean" at ${pos} ("${introspect(x).join("/")}" received)`)
    },
    
    ReturnType: ({caller, x}) => {
      throw new ReturnTypeError(`${caller} must return value of type "Boolean" ("${introspect(x).join("/")}" returned)`);
    }
  }) (o);
};

boo.toString = () => "Boolean";


// number (rev 0)
// a -> {status: String -> Error}

const num = x => isNum(x)
 ? {status: NoError}
 : {status: TypeError, nominal: "Number", real: introspect(x).join("/")};

num.toString = () => "Number";


// string (rev 0)
// a -> {status: String -> Error}

const str = x => isStr(x)
 ? {status: NoError}
 : {status: TypeError, nominal: "String", real: introspect(x).join("/")};

str.toString = () => "String";


// --[ POLYMORPHIC CONTRACTS ]-------------------------------------------------


// array of (rev 0)
// (...(? -> ?)) -> a -> {status: String -> Error}

const arrOf = c => {
  if (!isFun(c)) throw new TypeSysError(
    `arrOf expects value of type ? -> ? at 1 (${introspect(n).join("/")} received)`
  );

  const arrOf = xs => {
    if (!isArr(xs)) return {status: TypeError, nominal: type, real: introspect(xs).join("/")};

    if (has($type) (xs)) {
      if (xs[$type] !== type) return {status: TypeError, nominal: type, real: xs[$type]};
      return {status: NoError};
    }

    xs.forEach((x, i) => {
      const r = c(x);

      switch (r.status) {
        case TypeError: {
          const {nominal, real} = r;
          throw new TypeError(`Arr expects value of type ${nominal} at ${i + 1} (${real} received)`);
        }
      }
    });

    xs[$type] = type;
    Object.freeze(xs);
    return {status: NoError};
  };

  const type = `[${c}]`;
  return arrOf.toString = () => type, arrOf;
};

arrOf.toString = () => "[a]";


// compare by (rev 0)
// String -> (a -> Boolean) -> Array -> {status: String -> Error}

const compareBy = s => p => xs => p(xs.length)
 ? {status: NoError}
 : {status: TypeError, nominal: s, real: xs.length};


// length of (rev 0)
// Number -> [a] -> Object

const lenOf = n => compareBy(n) (eq);


// --[ REFLECTION ]------------------------------------------------------------


// get type (rev 0)
// a -> String

const getType = x => Object.prototype.toString.call(x).split(" ")[1].slice(0, -1);


// instance of (rev 0)
// a -> Boolean

const instanceOf = cons => o => cons.prototype.isPrototypeOf(o);


// is array (rev 0)
// a -> Boolean

const isArr = x => Array.isArray(x);


// is array of (rev 0)
// (a -> Boolean) -> a -> Boolean

const isArrOf = p => x => isArr(x) && x.every(y => p(y));


// is array (rev 0)
// a -> Boolean

const isArrLike = x => isObj(x) && length in x;


// is binary (rev 0)
// a -> Boolean

const isBinary = x => isFun(x) && x.length === 2;


// is boolean (rev 0)
// a -> Boolean

const isBoo = x => typeof x === "boolean";


// is finite (rev 0)
// a -> Boolean

const isEmpty = x => isArrLike(x) && x.length === 0;


// is finite (rev 0)
// a -> Boolean

const isFinite = x => Number.isFinite(x);


// is float (rev 0)
// a -> Boolean

const isFloat = x => isNum(x) && x >= 0 && x % 1 > 0


// is function (rev 0)
// a -> Boolean

const isFun = x => typeof x === "function";


// is integer (rev 0)
// a -> Boolean

const isInt = x => isNum(x) && x % 1 === 0


// is not a number (rev 0)
// a -> Boolean

const isNaN = x => Number.isNaN(x);


// is finite (rev 0)
// a -> Boolean

const isNotEmpty = x => isArrLike(x) && x.length > 0;


// is null (rev 0)
// a -> Boolean

const isNull = x => x === null;


// is nullary (rev 0)
// a -> Boolean

const isNullary = x => isFun(x) && x.length === 0;


// is number (rev 0)
// a -> Boolean

const isNum = x => typeof x === "number";


// is object (rev 0)
// a -> Boolean

const isObj = instanceOf(Object);


// is object of (rev 0)
// (a -> Boolean) -> a -> Boolean

const isObjOf = p => x => instanceOf(Object) (x) && p(x);


// is string (rev 0)
// a -> Boolean

const isStr = x => typeof x === "string";


// is sum of (rev 0.1)
// Function -> a -> Boolean

const isSumOf = cons => x => isObj(x) && x[$poly] === cons.toString();


// is symbol (rev 0)
// a -> Boolean

const isSym = x => typeof x === "symbol";


// is ternary (rev 0)
// a -> Boolean

const isTernary = x => isFun(x) && x.length === 3;


// is unsigned float (rev 0)
// a -> Boolean

const isUFloat = x => isFloat(x) && x >= 0;


// is unsigned integer (rev 0)
// a -> Boolean

const isUInt = x => isInt(x) && x >= 0;


// is unary (rev 0)
// a -> Boolean

const isUnary = x => isFun(x) && x.length === 1;


// is undefined (rev 0)
// a -> Boolean

const isUndef = x => x === undefined;


// is value
// a -> Boolean

const isValue = x => isUndef(x) || isNull(x);


// is variadic (rev 0)
// a -> Boolean

const isVariadic = isNullary;


// introspect (rev 0.1)
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
      if ($mono in x) return [x[$mono]];
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


// --[ SUBCLASS CONSTRUCTORS ]-------------------------------------------------


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


// Type System Error (rev 0)
// String -> TypeSysError

class TypeSysError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, TypeSysError);
  }
};


// --[ THROWING ]--------------------------------------------------------------


// throw (rev 0.1)
// (String -> Error) -> String -> IO

const _throw = cons => s => {throw new cons(s)};


// throw arity (rev 0.1)
// (String -> TypeError) -> String -> IO

const throwArity = _throw(ArityError);


// throw range (rev 0.1)
// (String -> RangeError) -> String -> IO

const throwRange = _throw(RangeError);


// throw return type (rev 0.1)
// (String -> TypeError) -> String -> IO

const throwReturnType = _throw(ReturnTypeError);


// throw type (rev 0.1)
// (String -> TypeError) -> String -> IO

const throwType = _throw(TypeError);


// throw type system (rev 0.1)
// (String -> TypeSysError) -> String -> IO

const throwTypeSys = _throw(TypeSysError);


/******************************************************************************
*******************************************************************************
*****************************[ 4. PRODUCT TYPES ]******************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
********************************[ 4.1. OBJECT ]********************************
******************************************************************************/


// has (rev 0)
// String -> Object -> Boolean

const has = k => o => k in o;


/******************************************************************************
********************************[ 4.2. ARRAY ]*********************************
******************************************************************************/


// Array (rev 0)
// (? -> ?) -> [a] -> [a]

/*const Arr = c => {
  const Arr = xs => {
    xs.forEach((x, i) => {
      const r = c(x);

      if ("status" in r) {
        if (!isFun(r.status)) throw new TypeSysError(
          `${c.name} must return value of type {status: String -> Error} (${introspect(r).join("/")} returned)`
        );

        switch (r.status) {
          case TypeError: {
            const {nominal, real} = r;
            throw new TypeError(`Arr expects value of type ${nominal} at ${i + 1} (${real} received)`);
          }
        }
      }
    });

    xs[$type] = type;
    return Object.freeze(xs);
  };

  const type = `[${c}]`;
  return (Arr.toString = () => type, Arr);
};*/


/******************************************************************************
*******************************************************************************
*******************************[ 5. SUM TYPES ]********************************
*******************************************************************************
******************************************************************************/


// catamorphism (rev 0.1)
// (Function, [String]) -> Object -> Object -> a

const cata = (cons, xs) => pattern => {
  if (TYPE_CHECK && xs.forEach(k => {
    if (!(k in pattern)) throw new TypeError(`missing case "${k}" for type "${cons(o[$x])}"`);
  }));

  const cata = o => {
    return pattern[o[$tag]] (o);
  };

  return cata;
};


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


/******************************************************************************
*******************************************************************************
********************************[ XX. DERIVED ]********************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
********************************[ 2.1. TYPES ]*********************************
******************************************************************************/


// --[ ARITY CONTRACTS ]-------------------------------------------------------


// unary (rev 0)
// (...(? -> ?)) -> [a] -> {status: String -> Error}

const unary = arity(1);


// binary (rev 0)
// (...(? -> ?)) -> [a, b] -> {status: String -> Error}

const binary = arity(2);


// ternary (rev 0)
// (...(? -> ?)) -> [a, b, c] -> {status: String -> Error}

const ternary = arity(3);


// variadic (rev 0)
// (...(? -> ?)) -> [?] -> {status: String -> Error}

const variadic = arity(Infinity);


// API


module.exports = {
  arity,
  ArityError,
  Arr,
  arr,
  arrOf,
  binary,
  boo,
  compareBy,
  eq,
  Err,
  get$,
  getType,
  has,
  instanceOf,
  introspect,
  isArr,
  isBoo,
  isFinite,
  isFun,
  isNaN,
  isNull,
  isNum,
  isObj,
  isStr,
  isSym,
  isUndef,
  lazy,
  lenOf,
  NoError,
  nullary,
  num,
  ReturnTypeError,
  str,
  _throw,
  ternary,
  throwIfNot,
  TypeSysError,
  unary,
  virt
};