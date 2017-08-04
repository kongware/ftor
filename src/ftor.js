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


// constructor (rev 0.1)
// internal

const $cons = Symbol.for(SYM_PREFIX + "cons");


// monomorphic type (rev 0.1)
// internal

const $type = Symbol.for(SYM_PREFIX + "type");


// tag (rev 0.1)

const $tag = Symbol.for(SYM_PREFIX + "tag");


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


// --[ FUNCTION PROXY ]--------------------------------------------------------


// Function (rev 0.2)
// virtualize function
// (String, Function, (...Function) -> Function

const Fun = (fname, f, ...cs) => {
  if (TYPE_CHECK) {
    const g = new Proxy(f, handleFun(fname, f, cs, 1));
    g.toString = Function.prototype.toString.bind(f);
    return g;
  }

  return f;
};


// handle function (rev 0.2)
// internal
// handle apply trap for virtualized function
// (String, Contract (a), (...Contract (a) -> Contract (a)), Number) -> Function

const handleFun = (fname, f, [c, ...cs], n) => {
  if (!isStr(fname)) throw new TypeSysError(
    `handleFun expects argument #1 of type "String" ("${introspect(fname)}" received)`
  );

  if (!isFun(f)) throw new TypeSysError(
    `handleFun expects argument #2 of type "Function" ("${introspect(f)}" received)`
  );

  cs.concat(c).forEach(c => {
    if (!isFun(c)) throw new TypeSysError(
      `handleFun expects argument #3 of type "[Function]" ("${introspect(c)}" received)`
    );

    if ($("length", of(c), gt(1))) throw new TypeSysError(
      `handleFun expects argument #3 of type "[Nullary]"/"[Unary]" ("${arityMap[c.length]}" element received)`
    );

    if (isNullary(c) && !isUnary(c())) throw new TypeSysError(
      `handleFun expects argument #3 of type "[() -> ? -> ?]" ("() -> (${repeat(Monoid.arr) (c() . length) ("?") . join(",")}) -> ?" element received)`
    );
  });

  if (!isNat(n)) throw new TypeSysError(
    `handleFun expects argument #4 of type "Natural" ("${introspect(n)}" received)`
  );

  return {
    apply: (g, _, args) => {
      try {isNullary(c) ? c() (args) : c(args)}

      catch (e) {
        const o = JSON.parse(e.message);
        let e_;

        switch (o.type) {
          case "arity": {
            if (n > 1 || cs.length > 1) {
              e_ = new ArityError(`${fname} excpects ${o.nominal} argument(s) at invocation #${n} (${o.real} received)`);
            }

            else e_ = new ArityError(`${fname} excpects ${o.nominal} argument(s) (${o.real} received)`);
            break;
          }

          case "type": {
            if (n > 1 || cs.length > 1) {
              e_ = new TypeError(`${fname} excpects argument #${o.pos} of type ${o.nominal} at invocation #${n} (${o.real} received)`);
            }

            else e_ = new TypeError(`${fname} excpects argument #${o.pos} of type ${o.nominal} (${o.real} received)`);
            break;
          }

          default: throw new TypeSysError(`handleFun received invalid error type "${o.type}" during argument check`);
        }

        e_.stack = e.stack;
        throw e_;
      }

      if (cs.length === 1) {
        const r = g(...args);

        try {cs[0] (r)}

        catch (e) {
          const o = JSON.parse(e.message);
          let e_;

          switch (o.type) {
            case "type": {
              e_ = new ReturnTypeError(`${fname} must return value of type "${o.nominal}" ("${o.real}" returned)`);
              break;
            }

            default: throw new TypeSysError(`handleFun received invalid error type "${o.type}" during return value check`);
          }

          e_.stack = e.stack;
          throw e_;
        }

        return r;
      }

      const r = new Proxy(f(...args), handleFun(fname, g, cs, n + 1))
      r.toString = Function.prototype.toString.bind(f);
      return r;
    },

    get: (o, k, _) => k === "name" ? fname : o[k]
  };
};


// --[ AUXILIARY ]-------------------------------------------------------------


const arityMap = ["Nullary", "Unary", "Binary", "Ternary", "4-ary", "5-ary"];


// --[ ARITY CONTRACTS ]-------------------------------------------------------


// arity (rev 0.2)
// Number -> (...a -> a) -> Array -> Array

const arity = n => {
  if (!(isNat(n) || isInf(n))) throw new TypeSysError(
    `arity expects argument #1 of type "Natural"/"Infinite" ("${introspect(n)}" received)`
  );

  const arity2 = (...cs) => {
    if (isFin(n)) {
      if (cs.length !== n) throw new TypeSysError(
        `arity2 expects argument #1 of type "[? -> ?]" of ${n} element(s) ("${introspect(cs.length)}" received)`
      );
    }

    else {
      if (cs.length !== 1) throw new TypeSysError(
        `arity2 expects argument #1 of type "[? -> ?]" of 1 element ("${introspect(cs.length)}" received)`
      );
    }

    cs.forEach(c => {
      if (!isUnary(c)) throw new TypeSysError(
        `arity2 expects argument #1 of type "[? -> ?]" ("(${repeat(Monoid.arr) (c.length) ("?") . join(",")}) -> ?" element received)`
      );
    });

    const arity3 = args => {
      if (!isArr(args)) throw new TypeSysError(
        `arity3 expects argument #1 of type "Array" ("${introspect(args)}" received)`
      );

      if (isFin(n)) {
        if (args.length !== n) throw new Error(JSON.stringify({type: "arity", nominal: n, real: args.length}));
      }

      args.forEach((x, m) => {
        try {isFin(n) ? cs[m] (x) : cs[0] (x)}

        catch (e) {
          const o = JSON.parse(e.message);
          o.pos = m + 1;
          const e_ = new Error(JSON.stringify(o));
          e_.stack = e.stack;
          throw e_;
        }
      });

      return args;
    };

    return arity3;
  };

  return arity2;
};


// nullary see @ section XX. DERIVED


// unary see @ section XX. DERIVED


// binary see @ section XX. DERIVED


// ternary see @ section XX. DERIVED


// variadic see @ section XX. DERIVED


// --[ MONOMORPHIC CONTRACTS ]-------------------------------------------------


// boolean (rev 0.2)
// Boolean -> Boolean

const boo = b => {
  if (isBoo(b)) return b;
  throw new Error(JSON.stringify({type: "type", nominal: "\"Boolean\"", real: `"${introspect(b)}"`}));
};

boo.toString = () => "Boolean";


// number (rev 0.2)
// Number -> Number

const num = n => {
  if (isNum(n)) return n;
  throw new Error(JSON.stringify({type: "type", nominal: "\"Number\"", real: `"${introspect(n)}"`}));
};

num.toString = () => "Number";


// string (rev 0.2)
// String -> String

const str = s => {
  if (isStr(s)) return s;
  throw new Error(JSON.stringify({type: "type", nominal: "\"String\"", real: `"${introspect(s)}"`}));
};

str.toString = () => "String";


// --[ POLYMORPHIC CONTRACTS ]-------------------------------------------------


// any (rev 0.2)
// a -> a

const any = x => x;

any.toString = () => "any";


// array (rev 0.2)
// Array -> Array

const arr = xs => {
  if (isArr(xs)) return xs;
  throw new Error(JSON.stringify({type: "type", nominal: "\"Array\"", real: `"${introspect(s)}"`}));
};

arr.toString = () => "Array";


// array of (rev 0.2)
// (a -> a) -> [a] -> [a]

const arrOf = c => {
  if (!isFun(c)) throw new TypeSysError(
    `arrOf expects argument #1 of type "Function" ("${introspect(c)}" received)`
  );

  if (!isUnary(c)) throw new TypeSysError(
    `arrOf expects argument #1 of type "Unary" ("${arityMap[c.length]}" received)`
  );

  const arrOf2 = xs => {
    if (!isArr(xs)) throw new Error(JSON.stringify({type: "type", nominal: "\"Array\"", real: `"${introspect(xs)}"`}));

    if ($type in xs) {
      if (xs[$type] === type) return xs;
      else throw new Error(JSON.stringify({type: "type", nominal: `"${type}"`, real: `"${introspect(xs)}"`}));
    }

    xs.forEach((x, n) => {
      try {c(x)}

      catch (e) {
        const o = JSON.parse(e.message);
        o.nominal = `"${type}"`;
        o.real = `${o.real} element at index #${n}`;
        const e_ = new Error(JSON.stringify(o));
        e_.stack = e.stack;
        throw e_;
      }
    });

    return xs;
  };

  const type = `[${c}]`;
  return arrOf2.toString = () => type, arrOf2;
};


// length (rev 0.1)
// internal
// Contract (a) -> Contract (a)

const length = o => {
  if (!$_(o, isSumOf, Contract)) throw new TypeSysError(
    `length expects value of type "Contract (a)" at 1/1 ("${introspect(o)}" received)`
  );

  if (!isArr(o.x)) throw new TypeSysError(
    `length expects value of type "Array" at 1/1 at property "x" ("${introspect(o.x)}" received)`
  );

  if (o.x.length !== o.n) {
    Contract[$cata] ({
      Length: ({x, fname, nf, nargs, n}) => {
        throw new TypeError(`${fname} expects Array including ${n} element(s) at ${nf}/${nargs} (${x.length} received)`)
      }
    }) (o);
  }

  return o;
};


// tuple of (rev 0.1)
// (Contract (a) -> Contract (a)) -> Contract (a) -> Contract (a)

const tupOf = cs => {
  if (!$_(cs, isArrOf, isUnary)) throw new TypeSysError(
    `tupOf expects function of type "Contract (a) -> Contract (a)" at 1/1 ("${introspect(cs)}" received)`
  );

  const tupOf2 = o => {
    if (!$_(o, isSumOf, Contract)) throw new TypeSysError(
      `tupOf2 expects value of type "Contract (a)" at 1/1 ("${introspect(o)}" received)`
    );

    if (o.x[$type] === type) return o;

    if (!isArr(o.x)) Contract[$cata] ({
      Type: ({x, fname, nf, nargs}) => {
        throw new TypeError(
          `${fname} expects value of type "${type}" at ${nf}/${nargs} at property "x" ("${introspect(o.x)}" received)`
        );
      },
      
      ReturnType: ({x, fname}) => {
        throw new ReturnTypeError(
          `${fname} must return value of type "${type}" at property "x" ("${introspect(o.x)}" returned)`
        );
      }
    }) (o)

    Contract[$cata] ({
      Type: ({x: xs, fname, nf, nargs}) => xs.forEach(x => c(Type(x, fname, nf, nargs))),
      ReturnType: ({x: xs, fname}) => xs.forEach(x => c(ReturnType(x, fname)))
    }) (o);

    return o;
  };

  const type = `(${cs.map(c => c + "").join(",")})`;
  return tupOf2.toString = () => type, tupOf2;
};


// --[ REFLECTION ]------------------------------------------------------------


// get type (rev 0.1)
// a -> String

const getType = x => Object.prototype.toString.call(x).split(" ")[1].slice(0, -1);


// instance of (rev 0.1)
// a -> Boolean

const instanceOf = cons => o => cons.prototype.isPrototypeOf(o);


// has (rev 0.1)
// String -> a -> Boolean

const has = k => x => x[k] !== undefined;


// is array (rev 0.1)
// a -> Boolean

const isArr = x => Array.isArray(x);


// isArrLike (rev 0.1)
// a -> Boolean

const isArrLike = has("length");


// is array of (rev 0.1)
// (b -> Boolean) -> a -> Boolean

const isArrOf = p => x => isArr(x) && x.every(y => p(y));


// is binary (rev 0.1)
// a -> Boolean

const isBinary = x => isFun(x) && x.length === 2;


// is boolean (rev 0.1)
// a -> Boolean

const isBoo = x => typeof x === "boolean";


// is char (rev 0.1)
// a -> Boolean

const isChr = x => isStr(x) && x.length === 1;


// is empty (rev 0.1)
// a -> Boolean

const isEmpty = x => "length" in x ? x.length === 0 : x.size === 0;


// is finite (rev 0.1)
// a -> Boolean

const isFin = x => Number.isFinite(x);


// is float (rev 0.1)
// a -> Boolean

const isFloat = x => x % 1 > 0;


// is function (rev 0.1)
// a -> Boolean

const isFun = x => typeof x === "function";


// is infinite (rev 0.1)
// a -> Boolean

const isInf = x => !isFin(x);


// is integer (rev 0.1)
// a -> Boolean

const isInt = x => Number.isInteger(x);


// is map (rev 0.2)
// a -> Boolean

const isMap = x => getType(x) === "Map";


// is not a number (rev 0.1)
// a -> Boolean

const isNaN = x => Number.isNaN(x);


// is not a number (rev 0.1)
// a -> Boolean

const isNat = x => isInt(x) && isPos(x);


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


// is positive number (rev 0.1)
// a -> Boolean

const isPos = x => x >= 0;


// is scalar value (rev 0.1)
// a -> Boolean

const isSca = x => !isObj(x);


// is set (rev 0.2)
// a -> Boolean

const isSet = x => getType(x) === "Set";


// is string (rev 0.1)
// a -> Boolean

const isStr = x => typeof x === "string";


// is sum of (rev 0.1)
// Function -> a -> Boolean

//const isSumOf = cons => x => $_(x, has, $cons) && x[$cons] === cons.toString();


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

const isValue = x => !(isUndef(x) || isNull(x));


// is variadic (rev 0.1)
// a -> Boolean

const isVariadic = isNullary;


// is weak map (rev 0.2)
// a -> Boolean

const isWeakMap = x => getType(x) === "WeakMap";


// is weak set (rev 0.2)
// a -> Boolean

const isWeakSet = x => getType(x) === "WeakSet";


// of (rev 0.1)
// a -> String -> (b -> Boolean) -> Boolean

const of = x => k => p => p(x[k]);


// introspect (rev 0.1)
// a -> String

const introspect = x => {
  switch (typeof x) {
    case "undefined": return "Undefined";

    case "number": {
      if (isNaN(x)) return "NaN";
      if (!isFin(x)) return "Infinity";
      return "Number";
    }

    case "string": return "String";
    case "boolean": return "Boolean";
    case "symbol": return "Symbol";
    case "function": return "Function";

    case "object": {
      if (x === null) return "Null";
      if ($type in x) return x[$type];

      return Array.from(new Set([
        getType(x),
        constructor in x ? x.constructor.name : "Object"
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
// internal
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


/******************************************************************************
*******************************************************************************
*****************************[ 4. PRODUCT TYPES ]******************************
*******************************************************************************
******************************************************************************/


// handle product type (rev 0.1)
// internal
// handle get/set traps for virtualized product types
// (String, String) -> Array

const handleProd = type => ({
  get: (o, k, _) => {
    switch (k) {
      case $type: return type;
      case Symbol.toStringTag: return o[k]
      
      default: {
        if (!(k in o)) throw new TypeError(`"${type}" received invalid get request for unknown property "${k}"`);
        return o[k];
      }
    }
  },

  set: (o, k, v, _) => {
    if (k === "toString") return o[k] = v;
    throw new TypeError(`immutable "${type}" received invalid set request for property "${k}" with value "${v}"`);
  }
});


/******************************************************************************
********************************[ 4.1. TUPLE ]*********************************
******************************************************************************/


// Tuple (rev 0.1)
// ([Contract (a) -> Contract (a)], Array) -> [a]

const Tup = (cs, xs) => {
  if (TYPE_CHECK) {
    if (!isArrOf(isUnary) (cs)) throw new TypeSysError(
      `Arr expects array of type "[Contract (a) -> Contract (a)]" at 1/1 ("${introspect(cs)}" received)`
    );

    if (!isArr(xs)) throw new TypeSysError(
      `Arr expects value of type "Array" at 1/2 ("${introspect(xs)}" received)`
    );

    const poly = "(" + ranger((_, n) => n < xs.length, succ) ("a") + ")",
     mono = "(" + cs.map(c => c + "").join(",") + ")";

    length(Length(xs, "Tup", 1, 2, cs.length));
    cs.forEach((c, i) => cs[i] (Type(xs[i], "Tup", 1, 2)));
    return new Proxy(xs, handleProd(poly, mono));
  }

  return xs;
};

Tup.of = (cs, ...xs) => Tup(cs, xs);

Tup.from = (cs, iter) => Tup(cs, Array.from(iter));


/******************************************************************************
********************************[ 4.2. RECORD ]********************************
******************************************************************************/


/******************************************************************************
********************************[ 4.3. ARRAY ]*********************************
******************************************************************************/


// --[ CONSTRUCTOR ]-----------------------------------------------------------


// Array (rev 0.2)
// (a -> a), [a]) -> [a]

const Arr = (c, xs) => {
  if (TYPE_CHECK) {
    if (!isFun(c)) throw new TypeSysError(
      `Arr expects argument #1 of type "Function" ("${introspect(xs)}" received)`
    );

    if ($("length", of(c), gt(1))) throw new TypeSysError(
      `Arr expects argument #1 of type "Nullary"/"Unary" ("${arityMap[c.length]}" received)`
    );

    if (isNullary(c) && !isUnary(c())) throw new TypeSysError(
      `Arr expects argument #1 of type "() -> ? -> ?" ("() -> (${repeat(Monoid.arr) (c() . length) ("?") . join(",")}) -> ?" received)`
    );

    if (!isArr(xs)) throw new TypeError(
      `Arr expects argument #2 of type "Array" ("${introspect(xs)}" received)`
    );

    const type = `[${c}]`;
    try{arrOf(c) (xs)}

    catch (e) {
      const o = JSON.parse(e.message);
      const e_ = new TypeError(`Arr expects argument #2 of type ${type} (${o.real} received)`);
      e_.stack = e.stack;
      throw e_;
    }

    const r = new Proxy(xs, handleProd(type));
    r.toString = Array.prototype.toString.bind(xs);
    return r;
  }

  return xs;
};

Arr.of = (c, ...xs) => Arr(c, xs);

Arr.from = (c, iter) => Arr(c, Array.from(iter));


// --[ MONOID ]----------------------------------------------------------------


// empty array (rev 0.2)
// [a]

const emptyArr = [];


// append array (rev 0.2)
// [a] -> [a] -> [a]

const appendArr = ys => xs => xs.concat(ys);


// prepend array (rev 0.2)
// [a] -> [a] -> [a]

const prependArr = xs => ys => xs.concat(ys);


// --[ MISC ]------------------------------------------------------------------


// range (rev 0.1)
// ((a -> Boolean), a -> a) -> a -> [a]

const range = (p, step) => x => {
  const aux = (acc, y) => p(y) ? aux(acc.concat([y]), step(y)) : acc;
  return aux([], x);
};


// range (rev 0.1)
// (((a, [a]) -> Boolean), a -> a) -> a -> [a]

const range_ = (p, step) => x => {
  const aux = (acc, y) => p(y, acc) ? aux(acc.concat([y]), step(y)) : acc;
  return aux([], x);
};


/******************************************************************************
******************************[ 4.4. DICTIONARY ]******************************
******************************************************************************/


/******************************************************************************
*******************************************************************************
*******************************[ 5. SUM TYPES ]********************************
*******************************************************************************
******************************************************************************/


// --[ CONSTRUCTOR ]-----------------------------------------------------------

const Tcons = (name, o) => {
  const r = Object.keys(o).reduce((p, k) => {
    p[k] = o[k] (name, k);
    return p;
  }, {});

  r[name] = {cata: pattern => p => pattern[p.tag] (p)};
  if (TYPE_CHECK) r[name].cata = new Proxy(r[name].cata, handleCata(Object.keys(o)));
  return r;
};

const handleCata = cases => ({
  apply: (f, _, args) => {
    const [pattern] = args;
    if (args.length !== 1) throw new TypeError("wrong arity");

    cases.forEach(_case => {
      if (!(_case in pattern)) throw new TypeError("missing case");
      if (cases.length != Object.keys(pattern).length) throw new TypeError("superfluous cases");
    });

    return f(pattern);
  }
});

const Dcons = (...os) => {
  const Dcons2 = (name, tag) => {
    const Dcons3 = acc => {
      const Dcons4 = (...args) => {
        const acc_ = acc.concat([args]);

        if (acc_.length === os.length) {
          const r = os.reduce((p, o, n) => {
            Object.keys(o).forEach((k, m) => p[k] = acc_[n] [m]);
            return p;
          }, {});

          r.tag = tag;
          return TYPE_CHECK ? new Proxy(r, handleSum(os, acc_, name)) : r;
        }

        else return Dcons3(acc_);
      };

      Dcons4.toString = () => tag;
      return TYPE_CHECK ? new Proxy(Dcons4, handleArgs(os, acc)) : Dcons4;
    };

    return Dcons3([], "");
  };

  return TYPE_CHECK ? new Proxy(Dcons2, handleCons(os)) : Dcons2;
};

const handleCons = os => ({
  apply: (f, _, args) => {
    const [name, tag] = args;
    if (args.length !== 2) throw new TypeError("wrong arity");
    if (!Array.isArray(os)) throw new TypeError("Array expected");

    os.forEach(o => {
      if (typeof o !== "object") throw new TypeError("Object expected");

      Object.keys(o).forEach(k => {
        if (typeof o[k] !== "function") throw new TypeError("Function expected");
        if (o[k].length > 1) throw new TypeError("Unary expected");
        else if (o[k].length === 0) {
          const c = o[k] ();
          if (typeof c !== "function") throw new TypeError("Function expected");
          if (c.length !== 1) throw new TypeError("Unary expected");
        }
      });
    });
    
    if (typeof name !== "string") throw new TypeError("String expected");
    if (typeof tag !== "string") throw new TypeError("String expected");
    return f(name, tag);
  }
});

const handleArgs = (os, acc) => ({
  apply: (f, _, args) => {
    if (Object.keys(os[acc.length]).length !== args.length) throw new TypeError("invalid arity");
    
    Object.keys(os[acc.length]).forEach((k, n) => os[acc.length] [k].length === 0
     ? os[acc.length] [k] () (args[n])
     : os[acc.length] [k] (args[n]));
    
    return f(...args);
  }
});

const handleSum = (os, acc, name) => ({
  get: (o, k, _) => {
    switch (k) {
      case "cons": return name;
      
      case "type": {
        return `${name} (${os.reduce((acc, o) => acc.concat(Object.keys(o).map(k => o[k] + "")), []).join(",")})`;
      }

      case "toString":

      case Symbol.toPrimitive: {
        return () => `${name} (${acc.reduce((acc, xs) => acc.concat(xs.map(x => typeof x === "string" ? "\"" + x + "\"" : x)), []).join(",")})`;
      }

      default: {
        if (!(k in o)) throw new TypeError("invalid property");
        return o[k];
      }
    }
  },

  set: (o, k, v, _) => {
    throw new TypeError("illegal mutation");
  }
});

const Dconst = c => (name, tag) => {
  const r = {tag: tag};
  return TYPE_CHECK ? new Proxy(r, handleConst(c, name, tag)) : r;
};

const handleConst = (c, name, tag) => ({
  get: (o, k, _) => {
    switch (k) {
      case "cons": return name;
      
      case "type": {
        return `${name} (${c})`;
      }

      case "toString":

      case Symbol.toPrimitive: {
        return () => tag;
      }

      default: {
        if (!(k in o)) throw new TypeError("invalid property");
        return o[k];
      }
    }
  },

  set: (o, k, v, _) => {
    throw new TypeError("illegal mutation");
  }
});


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


// interpolate
// Object -> String -> String

const interpolate = o => s => s.replace(/\${(\w+)}/g, (_, k) => o[k]);


// greater than
// a -> a -> Boolean

const gt = y => x => x > y;


/******************************************************************************
********************************[ 7.1. STRING ]********************************
******************************************************************************/


// successor (rev 0.1)
// String -> String

const succ = x => String.fromCharCode(x.charCodeAt(0) + 1);


/******************************************************************************
*******************************************************************************
******************************[ 8. POLYMORPHIC ]*******************************
*******************************************************************************
******************************************************************************/


// infix applicator
// (a, a -> b -> c, b) -> c

const $ = (x, f, y) => f(x) (y);


// flipped infix applicator
// (a, a -> b -> c, b) -> c

const $_ = (y, f, x) => f(x) (y);


// prefix applicator (rev 0.1)
// (a, a -> b -> c, b) -> c

const _$ = (f, y) => x => f(x) (y);


// function composition (rev 0.1)
// (...? -> ?) -> ? -> ?

const co = (...fs) => x => fs.reduceRight((y, f) => f(y), x);


// binary function composition (rev 0.1)
// (...Function) -> ? -> ? -> ?

const co2 = (...fs) => x => y => fs.slice(0, -1).reduceRight((z, f) => f(z), fs[fs.length - 1] (x) (y));


// ternary function composition (rev 0.1)
// (...Function) -> ? -> ? -> ? -> ?

const co3 = (...fs) => x => y => z => fs.slice(0, -1).reduceRight((w, f) => f(w), fs[fs.length - 1] (x) (y) (z));


// reverse function composition (rev 0.1)
// (...? -> ?) -> ? -> ?

const contra = (...fs) => x => fs.reduce((y, f) => f(y), x);


// binary reverse function composition (rev 0.1)
// (...Function) -> ? -> ? -> ?

const contra2 = (...fs) => x => y => fs.slice(1).reduce((z, f) => f(z), fs[0] (x) (y));


// ternary reverse function composition (rev 0.1)
// (...Function) -> ? -> ? -> ? -> ?

const contra3 = (...fs) => x => y => z => fs.slice(1).reduce((w, f) => f(w), fs[0] (x) (y) (z));


// flip (rev 0.1)
// (a -> b -> c) -> b -> a -> c

const flip = f => y => x => f(x) (y);


// repeat (rev 0.2)
// {append: a -> a -> a, empty: a} -> Number -> a -> Monoid a

const repeat = monoid => n => x => {
  const aux = (acc_, m) => m === 0 ? acc_ : aux(monoid.append(acc_) (x), m - 1);
  return aux(monoid.empty, n);
};


// rotate left
// (a -> b -> c -> d) -> b -> c -> a -> d

const rol = f => y => z => x => f(x) (y) (z);


// rotate right
// (a -> b -> c -> d) -> c -> a -> b -> d

const ror = f => z => x => y => f(x) (y) (z);


/******************************************************************************
*******************************************************************************
*********************************[ 9. ARROWS ]*********************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
*******************************************************************************
**************************[ 10. TYPE REPRESENTATIVES ]*************************
*******************************************************************************
******************************************************************************/


const Monoid = {
  arr: {
    empty: emptyArr,
    append: appendArr,
    prepend: prependArr
  }
};


/******************************************************************************
*******************************************************************************
*******************************[ 11. DEBUGGING ]*******************************
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


// --[ ARITY CONTRACTS ]-------------------------------------------------------


// nullary (rev 0.1)
// [a] -> {status: String -> Error}

const nullary = arity(0);


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
  $,
  $_,
  _$,
  any,
  arity,
  ArityError,
  Arr,
  arr,
  arrOf,
  binary,
  boo,
  $cata,
  co,
  co2,
  co3,
  contra,
  contra2,
  contra3,
  flip,
  Fun,
  get$,
  getType,
  gt,
  has,
  hasLen,
  instanceOf,
  interpolate,
  isArr,
  isArrOf,
  isBinary,
  isBoo,
  isChr,
  isEmpty,
  isFin,
  isFloat,
  isFun,
  isInf,
  isInt,
  isNaN,
  isNat,
  isNeg,
  isNull,
  isNullary,
  isNum,
  isObj,
  isPos,
  isSca,
  isStr,
  isSumOf,
  isSym,
  isTernary,
  isUnary,
  isUndef,
  isValue,
  isVariadic,
  nullary,
  num,
  of,
  range,
  ranger,
  ReturnTypeError,
  rol,
  ror,
  $tag,
  str,
  succ,
  ternary,
  _throw,
  Tup,
  tupOf,
  unary,
  variadic,
};