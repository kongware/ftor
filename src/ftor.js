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


// symbol prefix (rev 0.1)
// internal
// String

const SYM_PREFIX = "ftor/";


// type check (rev 0.1)
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
// (String, Function, (...() -> Contract (a) -> Contract (a))) -> Function

const virt = (fname, f, ...cs) => {
  if (TYPE_CHECK) {
    if (!isStr(fname)) throw new TypeSysError(
      `virt expects value of type "String" at 1/1 ("${introspect(fname)}" received)`
    );

    if (!isFun(f)) throw new TypeSysError(
      `virt expects value of type "Function" at 1/2 ("${introspect(f)}" received)`
    );

    cs.forEach(c => {
      if (!isNullary(c)) throw new TypeSysError(
        `virt expects Array of type "() -> Contract (a) -> Contract (a)" at 1/3 ("${introspect(c)}" received)`
      );
    });

    const g = new Proxy(f, handleF(fname, cs.map(c => c()), 1));
    g.toString = Function.prototype.toString.bind(f);
    return g;
  }

  return f;
};


// handle function (rev 0.1)
// internal
// handle apply traps for virtualized functions
// (String, Contract (a), (...Contract (a) -> Contract (a)), Number) -> Function

const handleF = (fname, [c, ...cs], n) => ({
  apply: (f, _, args) => {
    const o = c(Type(args, fname, n, 1));

    if (!isSumOf(Contract) (o)) throw new TypeSysError(
      `${c} must return value of type "Contract (a)" ("${introspect(o)}" returned)`
    );

    if (cs.length === 1) {
      const r = f(...args),
       o = cs[0] (ReturnType(r, fname));

      if (!isSumOf(Contract) (o)) throw new TypeSysError(
        `${cs[0]} must return value of type "Contract (a)" ("${introspect(o)}" returned)`
      );

      return r;
    }

    const g = new Proxy(f(...args), handleF(fname, cs, n + 1))
    g.toString = Function.prototype.toString.bind(f);
    return g;
  },

  get: (o, k, _) => k === "name" ? fname : o[k]
});


// --[ CONTRACT GADT ]---------------------------------------------------------


// Contract (rev 0.1)
// a -> String

const Contract = x => `Contract (${introspect(x)})`;

Contract.toString = () => "Contract (a)";

// Contract[$cata] see @ section XX. DERIVED


// Arity (rev 0.1)
// (a, String, Number, Number) -> Contract a

const Arity = (x, fname, nf, n) => {
  if (TYPE_CHECK) {
    if (!isStr(fname)) throw new TypeSysError(
      `Arity expects value of type "String" at 1/2 ("${introspect(fname)}" received)`
    );

    if (!isNat(nf)) throw new TypeSysError(
      `Arity expects value of type "natural Number" at 1/3 ("${introspect(nf)}" received)`
    );

    if (!isNat(n)) throw new TypeSysError(
      `Arity expects value of type "natural Number" at 1/4 ("${introspect(n)}" received)`
    );
  }
  
  const r = {
    [$tag]: Arity,
    toString: () => `Arity (${x}, ${fname}, ${nf}, ${n})`,
    x, fname, nf, n
  };

  if (TYPE_CHECK) {
    r[$poly] = "Contract (a)";
    r[$mono] = Contract(x);
  }

  return Object.freeze(r);
};


Arity.toString = () => "Arity";


// Type (rev 0.1)
// (a, String, Number, Number) -> Contract a

const Type = (x, fname, nf, nargs) => {
  if (TYPE_CHECK) {
    if (!isStr(fname)) throw new TypeSysError(
      `Type expects value of type "String" at 1/2 ("${introspect(fname)}" received)`
    );

    if (!isNum(nf)) throw new TypeSysError(
      `Type expects value of type "String" at 1/3 ("${introspect(nf)}" received)`
    );

    if (!isNum(nargs)) throw new TypeSysError(
      `Type expects value of type "String" at 1/4 ("${introspect(nargs)}" received)`
    );
  }

  const r = {
    [$tag]: Type,
    toString: () => `Type (${x}, ${fname}, ${nf}, ${nargs})`,
    x, fname, nf, nargs
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

const ReturnType = (x, fname) => {
  if (TYPE_CHECK) {
    if (!isStr(fname)) throw new TypeSysError(
      `ReturnType expects value of type "String" at 1/2 ("${introspect(fname)}" received)`
    );
  }
  
  const r = {
    [$tag]: ReturnType,
    toString: () => `ReturnType (${x}, ${fname})`,
    x, fname
  };

  if (TYPE_CHECK) {
    r[$poly] = "Contract (a)";
    r[$mono] = Contract(x);
  }

  return Object.freeze(r);
};

ReturnType.toString = () => "ReturnType";


// --[ ARITY CONTRACTS ]-------------------------------------------------------


// arity (rev 0.1)
// Number -> (...Contract (a) -> Contract (a)) -> Contract (a) -> Contract (a)

const arity = n => {
  if (!isNat(n) && !isInfinite) throw new TypeSysError(
    `arity expects value of type "natural Number" at 1/1 ("${introspect(n)}" received)`
  );

  const arity = (...cs) => {
    if (!isArrOf(isUnary) (cs)) throw new TypeSysError(
      `arity expects value of type "[Contract (a) -> Contract (a)]" at 2/1 ("${introspect(cs)}" received)`
    );

    const arity = o => {
      if (!isSumOf(Contract) (o)) throw new TypeSysError(
        `arity expects value of type "Contract (a)" at 3/1 ("${introspect(o)}" received)`
      );

      if (isFinite(n)) nary(Arity(o.x, o.fname, o.nf, n));

      o.x.forEach((x, m) => {
        const r = isFinite(n)
         ? cs[m] (Type(x, o.fname, o.nf, m + 1))
         : cs[0] (Type(x, o.fname, o.nf, m + 1));

        if (!isSumOf(Contract) (r)) throw new TypeSysError(
          `${cs[m]} must return value of type "Contract (a)" ("${introspect(r)}" returned)`
        );
      });

      return o
    };

    return arity;
  };

  return arity;
};


// nullary see @ section XX. DERIVED


// unary see @ section XX. DERIVED


// binary see @ section XX. DERIVED


// ternary see @ section XX. DERIVED


// variadic see @ section XX. DERIVED


// --[ MONOMORPHIC CONTRACTS ]-------------------------------------------------


// array (rev 0.1)
// Contract (a) -> Contract (Array)

const arr = o => {
  if (!isSumOf(Contract) (o)) throw new TypeSysError(
    `arr expects value of type "Contract (a)" at 1/1 ("${introspect(o.x)}" received)`
  );

  if (o[$mono] === "Contract (Array)") return o;
  
  Contract[$cata] ({
    Arity: ({fname}) => {
      throw new TypeSysError(`arr cannot handle values of type "Contract (a)" tagged with "Arity" for ${fname}`);
    },

    Type: ({x, fname, nf, nargs}) => {
      throw new TypeError(`${fname} expects value of type "Array" at ${nf}/${nargs} ("${introspect(x)}" received)`)
    },
    
    ReturnType: ({x, fname}) => {
      throw new ReturnTypeError(`${fname} must return value of type "Array" ("${introspect(x)}" returned)`);
    }
  }) (o);
};

arr.toString = () => "Array";


// boolean (rev 0.1)
// Contract (Boolean) -> Contract (Boolean)

const boo = o => {
  if (!isSumOf(Contract) (o)) throw new TypeSysError(
    `boo expects value of type "Contract (a)" at 1/1 ("${introspect(o)}" received)`
  );

  if (o[$mono] === "Contract (Boolean)") return o;
  
  Contract[$cata] ({
    Arity: ({fname}) => {
      throw new TypeSysError(`boo cannot handle values of type "Contract (a)" tagged with "Arity" for ${fname}`);
    },

    Type: ({x, fname, nf, nargs}) => {
      throw new TypeError(`${fname} expects value of type "Boolean" at ${nf}/${nargs} ("${introspect(x)}" received)`)
    },
    
    ReturnType: ({x, fname}) => {
      throw new ReturnTypeError(`${fname} must return value of type "Boolean" ("${introspect(x)}" returned)`);
    }
  }) (o);
};

boo.toString = () => "Boolean";


// number (rev 0.1)
// Contract (Number) -> Contract (Number)

const num = o => {
  if (!isSumOf(Contract) (o)) throw new TypeSysError(
    `num expects value of type "Contract (a)" at 1/1 ("${introspect(o)}" received)`
  );

  if (o[$mono] === "Contract (Number)") return o;
  
  Contract[$cata] ({
    Arity: ({fname}) => {
      throw new TypeSysError(`num cannot handle values of type "Contract (a)" tagged with "Arity" for ${fname}`);
    },

    Type: ({x, fname, nf, nargs}) => {
      throw new TypeError(`${fname} expects value of type "Number" at ${nf}/${nargs} ("${introspect(x)}" received)`)
    },
    
    ReturnType: ({x, fname}) => {
      throw new ReturnTypeError(`${fname} must return value of type "Number" ("${introspect(x)}" returned)`);
    }
  }) (o);
};

num.toString = () => "Number";


// string (rev 0.1)
// Contract (String) -> Contract (String)

const str = o => {
  if (!isSumOf(Contract) (o)) throw new TypeSysError(
    `str expects value of type "Contract (a)" at 1/1 ("${introspect(o)}" received)`
  );

  if (o[$mono] === "Contract (String)") return o;
  
  Contract[$cata] ({
    Arity: ({fname}) => {
      throw new TypeSysError(`str cannot handle values of type "Contract (a)" tagged with "Arity" for ${fname}`);
    },

    Type: ({x, fname, nf, nargs}) => {
      throw new TypeError(`${fname} expects value of type "String" at ${nf}/${nargs} ("${introspect(x)}" received)`)
    },
    
    ReturnType: ({x, fname}) => {
      throw new ReturnTypeError(`${fname} must return value of type "String" ("${introspect(x)}" returned)`);
    }
  }) (o);
};

str.toString = () => "String";


// --[ POLYMORPHIC CONTRACTS ]-------------------------------------------------


// any (rev 0.1)
// Contract (a) -> Contract (Array)

const any = o => {
  if (!isSumOf(Contract) (o)) throw new TypeSysError(
    `arr expects value of type "Contract (a)" at 1/1 ("${introspect(o.x)}" received)`
  );

  return o;
};

any.toString = () => "a";


// array of (rev 0.1)
// (Contract (a) -> Contract (a)) -> Contract (a) -> Contract (a)

const arrOf = c => {
  if (!isUnary(c)) throw new TypeSysError(
    `arrOf expects function of type "Contract (a) -> Contract (a)" at 1/1 ("${introspect(c)}" received)`
  );

  const arrOf = o => {
    if (!isSumOf(Contract) (o)) throw new TypeSysError(
      `arrOf expects value of type "Contract (a)" at 2/1 ("${introspect(o)}" received)`
    );

    if (o[$mono] !== "Contract (Array)") throw new TypeError(
      Contract[$cata] ({
        Arity: ({fname}) => {
          throw new TypeSysError(
            `arrOf cannot handle values of type "Contract (a)" tagged with "Arity" for ${fname}`
          );
        },

        Type: ({x, fname, nf, nargs}) => {
          throw new TypeError(
            `${fname} expects value of type "[${c}]" at ${nf}/${nargs} ("${introspect(x)}" received)`
          );
        },
        
        ReturnType: ({x, fname}) => {
          throw new ReturnTypeError(
            `${fname} must return value of type "[${c}]" ("${introspect(x)}" returned)`
          );
        }
      }) (o)
    );

    if (o.x[$mono] === type) return o;

    Contract[$cata] ({
      Arity: ({fname}) => {
        throw new TypeSysError(
          `arrOf cannot handle values of type "Contract (a)" tagged with "Arity" for ${fname}`
        );
      },

      Type: ({x: xs, fname, nf, nargs}) => xs.forEach(x => c(Type(x, fname, nf, nargs))),

      ReturnType: ({x: xs, fname}) => xs.forEach(x => c(ReturnType(x, fname)))
    }) (o);

    return o;
  };

  const type = `[${c}]`;
  return arrOf.toString = () => type, arrOf;
};

arrOf.toString = () => "[a]";


// n-ary (rev 0.1)
// Contract (a) -> Contract (a)

const nary = o => {
  if (!isSumOf(Contract) (o)) throw new TypeSysError(
    `ary expects value of type "Contract (a)" at 1/1 ("${introspect(o)}" received)`
  );

  if (o.x.length !== o.n) {  
    Contract[$cata] ({
      Arity: ({x, fname, nf, n}) => {
        throw new ArityError(`${fname} expects ${n} argument(s) at ${nf} (${x.length} received)`)
      },
      
      Type: ({fname}) => {
        throw new TypeSysError(`ary cannot handle values of type "Contract (a)" tagged with "Type" for ${fname}`);
      },

      ReturnType: ({fname}) => {
        throw new TypeSysError(`ary cannot handle values of type "Contract (a)" tagged with "ReturnType" for ${fname}`);
      },
    }) (o);
  }

  return o;
};


// --[ REFLECTION ]------------------------------------------------------------


// get type (rev 0.1)
// a -> String

const getType = x => Object.prototype.toString.call(x).split(" ")[1].slice(0, -1);


// instance of (rev 0.1)
// a -> Boolean

const instanceOf = cons => o => cons.prototype.isPrototypeOf(o);


// is array (rev 0.1)
// a -> Boolean

const isArr = x => Array.isArray(x);


// is array of (rev 0.1)
// (a -> Boolean) -> a -> Boolean

const isArrOf = p => x => isArr(x) && x.every(y => p(y));


// is array (rev 0.1)
// a -> Boolean

const isArrLike = x => isObj(x) && length in x;


// is binary (rev 0.1)
// a -> Boolean

const isBinary = x => isFun(x) && x.length === 2;


// is boolean (rev 0.1)
// a -> Boolean

const isBoo = x => typeof x === "boolean";


// is finite (rev 0.1)
// a -> Boolean

const isEmpty = x => isArrLike(x) && x.length === 0;


// is finite (rev 0.1)
// a -> Boolean

const isFinite = x => Number.isFinite(x);


// is float (rev 0.1)
// a -> Boolean

const isFloat = x => isNum(x) && x >= 0 && x % 1 > 0


// is function (rev 0.1)
// a -> Boolean

const isFun = x => typeof x === "function";


// is infinite (rev 0.1)
// a -> Boolean

const isInfinite = x => isNum(x) && !isFinite(x);


// is integer (rev 0.1)
// a -> Boolean

const isInt = x => Number.isInteger(x);


// is not a number (rev 0.1)
// a -> Boolean

const isNaN = x => Number.isNaN(x);


// is natural number (rev 0.1)
// a -> Boolean

const isNat = x => isInt(x) && x >= 0;


// is negative number (rev 0.1)
// a -> Boolean

const isNeg = x => isNum(x) && x < 0;


// is null (rev 0.1)
// a -> Boolean

const isNull = x => x === null;


// is nullary (rev 0.1)
// a -> Boolean

const isNullary = x => isFun(x) && x.length === 0;


// is number (rev 0.1)
// a -> Boolean

const isNum = x => typeof x === "number";


// is object (rev 0.1)
// a -> Boolean

const isObj = instanceOf(Object);


// is object of (rev 0.1)
// (a -> Boolean) -> a -> Boolean

const isObjOf = p => x => instanceOf(Object) (x) && p(x);


// is positive number (rev 0.1)
// a -> Boolean

const isPos = x => isNum(x) && x >= 0;


// is string (rev 0.1)
// a -> Boolean

const isStr = x => typeof x === "string";


// is sum of (rev 0.1)
// Function -> a -> Boolean

const isSumOf = cons => x => isObj(x) && x[$poly] === cons.toString();


// is symbol (rev 0.1)
// a -> Boolean

const isSym = x => typeof x === "symbol";


// is ternary (rev 0.1)
// a -> Boolean

const isTernary = x => isFun(x) && x.length === 3;


// is unary (rev 0.1)
// a -> Boolean

const isUnary = x => isFun(x) && x.length === 1;


// is undefined (rev 0.1)
// a -> Boolean

const isUndef = x => x === undefined;


// is value
// a -> Boolean

const isValue = x => isUndef(x) || isNull(x);


// is variadic (rev 0.1)
// a -> Boolean

const isVariadic = isNullary;


// introspect (rev 0.1)
// a -> String

const introspect = x => {
  switch (typeof x) {
    case "undefined": return "Undefined";

    case "number": {
      if (isNaN(x)) return "NaN";
      if (!isFinite(x)) return "Infinity";
      return ["Number"];
    }

    case "string": return "String";
    case "boolean": return "Boolean";
    case "symbol": return "Symbol";
    case "function": return "Function";

    case "object": {
      if (x === null) return "Null";
      if ($mono in x) return x[$mono];
      return Array.from(new Set([
        getType(x),
        x.constructor.name
      ])).reduce((acc, s) => s !== "Object" ? s : acc, "Object");
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


// Arity Error (rev 0.1)
// String -> ArityError

class ArityError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ArityError);
  }
};


// Return Type Error (rev 0.1)
// String -> ReturnTypeError

class ReturnTypeError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ReturnTypeError);
  }
};


// Type System Error (rev 0.1)
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


// has (rev 0.1)
// String -> Object -> Boolean

const has = k => o => k in o;


/******************************************************************************
********************************[ 4.2. ARRAY ]*********************************
******************************************************************************/

// Array (rev 0.1)
// (() -> Contract (a) -> Contract (a)) -> [a] -> [a]

const Arr = (c, xs) => {
  if (TYPE_CHECK) {
    if (!isNullary(c)) throw new TypeSysError(
      `Arr expects function of type "() -> Contract (a) -> Contract (a)" at 1/1 ("${introspect(c)}" received)`
    );

    if (!isArr(xs)) throw new TypeSysError(
      `Arr expects value of type "Array" at 1/2 ("${introspect(xs)}" received)`
    );

    c = c();

    const poly = "[a]",
     mono = `[${c}]`;

    return new Proxy(arrOf(c) (Type(xs, "Arr", 1, 2)).x, {
      get: (o, k, _) => {
        if (k === $poly) return poly;
        if (k === $mono) return mono;
        if (!(k in o)) throw new TypeError(`invalid property request "${k}"" for type ${mono}`);
        return o[k];
      },

      set: (o, k, v, _) => {
        throw new TypeError(`invalid destructive set of "${k}: ${v}" for immutable type "${mono}"`);
      }
    });
  }

  return xs;
};

Arr.of = (c, ...xs) => Arr(c, xs);

Arr.from = (c, iter) => Arr(c, Array.from(iter));


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


// equal (rev 0.1)
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


// get symbol (rev 0.1)
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

// --[ CONTRACT GADT ]-------------------------------------------------------


Contract[$cata] = cata(Contract, ["Arity", "Type", "ReturnType"]);


// --[ ARITY CONTRACTS ]-------------------------------------------------------


// nullary (rev 0.1)
// [a] -> {status: String -> Error}

const nullary = arity(0) ();


// unary (rev 0.1)
// (...? -> ?) -> [a] -> {status: String -> Error}

const unary = arity(1);


// binary (rev 0.1)
// (...? -> ?) -> [a, b] -> {status: String -> Error}

const binary = arity(2);


// ternary (rev 0.1)
// (...? -> ?) -> [a, b, c] -> {status: String -> Error}

const ternary = arity(3);


// variadic (rev 0.1)
// (...? -> ?) -> [a, b, c] -> {status: String -> Error}

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