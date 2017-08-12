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


// --[ FUNCTION VIRTUALIZATION ]-----------------------------------------------


// Function (rev 0.2)
// virtualize function
// (String, Function, (...Function) -> Function

const Fun = (fname, f, ...cs) => {
  if (TYPE_CHECK) {
    const g = new Proxy(f, handleFun(fname, f, cs, 1, {}));
    g.toString = Function.prototype.toString.bind(f);
    return g;
  }

  return f;
};


// handle function (rev 0.2)
// internal
// handle apply trap for virtualized function
// (String, Contract (a), (...Contract (a) -> Contract (a)), Number) -> Function

const handleFun = (fname, f, [c, ...cs], n, tvars) => {
  if (!isStr(fname)) throw new TypeSysError(
    `handleFun expects argument #1 of type String \u2BC8\u2BC8\u2BC8 ${introspect(fname)} received`
  );

  if (!isFun(f)) throw new TypeSysError(
    `handleFun expects argument #2 of type Function \u2BC8\u2BC8\u2BC8 ${introspect(f)} received`
  );

  cs.concat(c).forEach((c, m) => {
    if (!isFun(c)) throw new TypeSysError(
      `handleFun expects argument #3 of type [Function] \u2BC8\u2BC8\u2BC8 ${introspect(c)} received`
    );

    if ($("length", of(c), gt(1))) throw new TypeSysError(
      `handleFun expects argument #3 of type [Nullary]/[Unary] \u2BC8\u2BC8\u2BC8 ${arityMap[c.length]} at index #${m} received`
    );

    if (isNullary(c) && !isUnary(c())) throw new TypeSysError(
      `handleFun expects argument #3 of type [() -> ? -> ?] \u2BC8\u2BC8\u2BC8 () -> (${arityType(c())}) -> ? at index #${m} received`
    );
  });

  if (!isNat(n)) throw new TypeSysError(
    `handleFun expects argument #4 of type Natural \u2BC8\u2BC8\u2BC8 ${introspect(n)} received`
  );

  return {
    apply: (g, _, args) => {
      try {isNullary(c) ? c() (args) : c(args)}

      catch (e) {
        const o = JSON.parse(e.message);
        let e_;

        switch (o.type) {
          case "arity": {
            if (n > 1 || cs.length > 1) e_ = new ArityError(
              `${fname} excpects ${o.nominal} argument(s) at invocation #${n} \u2BC8\u2BC8\u2BC8 ${o.real} received`
            );

            else e_ = new ArityError(`${fname} excpects ${o.nominal} argument(s) \u2BC8\u2BC8\u2BC8 ${o.real} received`);
            break;
          }

          case "type": {
            if (n > 1 || cs.length > 1) e_ = new TypeError(
              `${fname} excpects argument #${o.pos} of type ${o.nominal} at invocation #${n} \u2BC8\u2BC8\u2BC8 ${o.real} received`
            );

            else e_ = new TypeError(
              `${fname} excpects argument #${o.pos} of type ${o.nominal} \u2BC8\u2BC8\u2BC8 ${o.real} received`
            );

            break;
          }

          default: throw new TypeSysError(
            `handleFun received invalid error type ${o.type} during argument check`
          );
        }

        e_.stack = e.stack;
        throw e_;
      }

      const tvars_ = bindTypeVars((isNullary(c) ? c() : c).toString(), tvars, args, fname);

      if (cs.length === 1) {
        const r = g(...args);

        try {cs[0] (r)}

        catch (e) {
          const o = JSON.parse(e.message);
          let e_;

          switch (o.type) {
            case "type": {
              e_ = new ReturnTypeError(
                `${fname} must return value of type ${o.nominal} \u2BC8\u2BC8\u2BC8 ${o.real} returned`
              );

              break;
            }

            default: throw new TypeSysError(
              `handleFun received invalid error type ${o.type} during return value check`
            );
          }

          e_.stack = e.stack;
          throw e_;
        }

        bindTypeVars(cs[0].toString(), Object.assign({}, tvars, tvars_), [r], fname);
        return r;
      }

      const r = new Proxy(f(...args), handleFun(fname, g, cs, n + 1, Object.assign({}, tvars, tvars_)))
      r.toString = Function.prototype.toString.bind(f);
      return r;
    },

    get: (o, k, _) => k === "name" ? fname : o[k]
  };
};


// --[ AUXILIARY HELPER ]------------------------------------------------------


// arity map (rev 0.2)
// [String]

const arityMap = ["Nullary", "Unary", "Binary", "Ternary", "4-ary", "5-ary"];


// arity type (rev 0.2)
// Function -> String

const arityType = c => repeat(Monoid.arr) (c.length) ("?") . join(",");


// type tokens (rev 0.2)
// {String}

const typeTokens = {"(": ")", "[": "]", "{": "}"};


// --[ PARSING / BINDING ]-----------------------------------------------------


// bind type variables types (rev 0.2)
// ([String], Object(String), Array, String) -> Object(String)

const bindTypeVars = (ss, tvars, args, fname) => ss.reduce((acc, s, n) => {
  if (isPrimitive(s)) return acc;
  if (isComposite(s)) return bindTypeVars(splitTypes(unwrapType(s)), acc, args[n], fname);

  if (s in acc) {
    if (acc[s] !== typeof args[n]) throw new TypeError(`${fname}'s type var "${s}" already bound to ${acc[s]}`);
    return acc;
  }

  return (acc[s] = typeof args[n], acc);
}, Object.assign({}, tvars));


// split types (rev 0.2)
// String -> [String]

const splitTypes = s => {
  const aux = ([c, ...s_], acc, stack) => {
    if (c === undefined) return acc;
    if (c in typeTokens && (stack.length === 0 || stack[0] === typeTokens[c])) stack.push(typeTokens[c]);
    else if (c === stack[0]) stack.pop();
    if (c === "," && stack.length === 0) return aux(s_, acc.concat(""), stack);
    return aux(s_, (acc[acc.length - 1] += c, acc), stack);
  };

  return aux(s, [""], []);
};


// split types recursively (rev 0.2)
// String -> [String]

const splitTypesRec = s => {
  const aux = xs => xs.reduce((acc, s, n) => isComposite(s) 
   ? acc.concat(s, aux(splitTypes(unwrapType(s))))
   : acc.concat(s), []);

  return aux(splitTypes(s));
};


// filter types (rev 0.2)
// (...String -> Boolean) -> [String] -> [String]

const filterTypes = (...preds) => xs => xs.filter(s => preds.some(p => p(s)));


// is atomic type (rev 0.2)
// String -> Boolean

const isAtomic = s => !(s[0] in typeTokens);


// is composite type (rev 0.2)
// String -> Boolean

const isComposite = s => s[0] in typeTokens && typeTokens[s[0]] === s[s.length - 1];


// is primitive type (rev 0.2)
// String -> Boolean

const isPrimitive = s => isAtomic(s) && s[0] !== s[0].toLowerCase();


// is type variable (rev 0.2)
// String -> Boolean

const isTypeVar = s => isAtomic(s) && s.length === 1 && s === s.toLowerCase();


// replace types (rev 0.2)
// String -> (...String -> Boolean) -> [String] -> [String]

const replaceTypes = surrogate => (...preds) => xs => xs.reduce((acc, s) => preds.some(p => p(s))
 ? acc.concat(surrogate)
 : acc.concat(s), []);


// unwrap type (rev 0.2)
// String -> Boolean

const unwrapType = s => s.slice(1, -1);


/*
// parse composite types (rev 0.1)
// String -> [String]

const parseCompTypes = tokens => s => {
  if (!isObj(tokens)) throw new TypeSysError(
    `splitTypes expects argument #1 of type Object \u2BC8\u2BC8\u2BC8 ${introspect(tokens)} received`
  );

  // TODO: add isObjOf/isDictOf

  if (!isStr(s)) throw new TypeSysError(
    `parseType expects argument #1 of type String \u2BC8\u2BC8\u2BC8 ${introspect(s)} received`
  );

  const aux = ([c, ...s], acc, stack, inter, n) => {
    if (c === undefined) return acc;
    else if (c in tokens) return aux(s, acc, stack.map(job => job + c).concat(c), inter, n + 1);

    else if (c in closed) {
      stack = stack.map(job => job + c);
      const job = stack.pop();
      if (n === 1) return aux(s, acc.concat(job, inter), stack, [], n - 1);
      else return aux(s, acc, stack, [job].concat(inter), n - 1);
    }

    else {
      return aux(s, acc, stack.map(job => job + c), inter, n);
    }
  };

  return aux(s, [], [], [], 0);
};


// split types (rev 0.2)
// {String} -> String -> [String]

const splitTypes = tokens => s => {
  if (!isObj(tokens)) throw new TypeSysError(
    `splitTypes expects argument #1 of type Object \u2BC8\u2BC8\u2BC8 ${introspect(tokens)} received`
  );

  // TODO: add isObjOf/isDictOf

  if (!isStr(s)) throw new TypeSysError(
    `splitTypes expects argument #2 of type String \u2BC8\u2BC8\u2BC8 ${introspect(s)} received`
  );

  const aux = ([c, ...s_], acc, stack) => {
    if (c === undefined) {
      if (!stack.length !== 0) throw new TypeSysError(
        `splitTypes received an invalid type "${s}" for its argument #1`
      );

      return acc;
    }

    if (c in tokens && (stack.length === 0 || stack[0] === tokens[c])) stack.push(tokens[c]);
    else if (c === stack[0]) stack.pop();
    if (c === "," && stack.length === 0) return aux(s_, acc.concat(""), stack);
    return aux(s_, (acc[acc.length - 1] += c, acc), stack);
  };

  return aux(s, [""], []);
};


// unwrapType (rev 0.2)
// {String} -> String -> String

const unwrapType = tokens => s => {
  if (!isObj(tokens)) throw new TypeSysError(
    `unwrapType expects argument #1 of type Object \u2BC8\u2BC8\u2BC8 ${introspect(tokens)} received`
  );

  // TODO: add isObjOf/isDictOf

  if (!isStr(s)) throw new TypeSysError(
    `unwrapType expects argument #2 of type String \u2BC8\u2BC8\u2BC8 ${introspect(s)} received`
  );

  if (!(s[0] in tokens)) throw new TypeSysError(
    `unwrapType expects argument #2 to start with one of "${Object.keys(tokens)}" chars \u2BC8\u2BC8\u2BC8 "${s[0]}" received`
  );

  if (!tokens.includes(s[s.length - 1])) throw new TypeSysError(
    `unwrapType expects argument #2 to end with one of "${Object.values(tokens)}" chars \u2BC8\u2BC8\u2BC8 "${s[s.length - 1]}" received`
  );

  return s.slice(1, -1);
};
*/


// virtualize recursively (rev 0.1)
// ([String], [a]) -> [a]

const virtRec = ([type, ...types], xs) => {
  types.forEach((type, n) => {
    if (!isStr(type)) throw new TypeSysError(
    `virtRec expects argument #1 of type [String] \u2BC8\u2BC8\u2BC8 ${introspect(type)} at index #${n} received`
    );
  });

  if (!isArr(xs)) throw new TypeSysError(
    `virtRec expects argument #2 of type Array \u2BC8\u2BC8\u2BC8 ${introspect(xs)} received`
  );

  return xs.map(x => {
    if (isArr(x)) return new Proxy(virtRec(types, x), handleProd(type));
    return x;
  });
};


// --[ ARITY CONTRACTS ]-------------------------------------------------------


// arity (rev 0.2)
// Number -> (...a -> a) -> Array -> Array

const arity = n => {
  if (!(isNat(n) || isInf(n))) throw new TypeSysError(
    `arity expects argument #1 of type Natural/Infinite \u2BC8\u2BC8\u2BC8 ${introspect(n)} received`
  );

  const arity2 = (...cs) => {
    if (isFin(n)) {
      if (cs.length !== n) throw new TypeSysError(
        `arity2 expects argument #1 of type [? -> ?] of ${n} element(s) \u2BC8\u2BC8\u2BC8 ${cs.length} element(s) received`
      );
    }

    else {
      if (cs.length !== 1) throw new TypeSysError(
        `arity2 expects argument #1 of type [? -> ?] of 1 element \u2BC8\u2BC8\u2BC8 ${cs.length} element(s) received`
      );
    }

    cs.forEach((c, m) => {
      if (!isUnary(c)) throw new TypeSysError(
        `arity2 expects argument #1 of type [? -> ?] \u2BC8\u2BC8\u2BC8 (${arityType(c)}) -> ? at index #${m} received`
      );
    });

    const arity3 = args => {
      if (!isArr(args)) throw new TypeSysError(
        `arity3 expects argument #1 of type Array \u2BC8\u2BC8\u2BC8 ${introspect(args)} received`
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

    arity3.toString = () => cs.join(",");
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
  throw new Error(JSON.stringify({type: "type", nominal: "Boolean", real: `${introspect(b)}`}));
};

boo.toString = () => "Boolean";


// number (rev 0.2)
// Number -> Number

const num = n => {
  if (isNum(n)) return n;
  throw new Error(JSON.stringify({type: "type", nominal: "Number", real: `${introspect(n)}`}));
};

num.toString = () => "Number";


// string (rev 0.2)
// String -> String

const str = s => {
  if (isStr(s)) return s;
  throw new Error(JSON.stringify({type: "type", nominal: "String", real: `${introspect(s)}`}));
};

str.toString = () => "String";


// --[ POLYMORPHIC CONTRACTS ]-------------------------------------------------


// any (rev 0.2)
// String -> a -> a

const any = c => {
  if (!isLC(c)) throw new TypeSysError(
    `any expects argument #1 of type Char/lower case letter \u2BC8\u2BC8\u2BC8 ${introspect(c)} received`
  );

  const any2 = x => x;
  any2.toString = () => c;
  return any2;
};

any.toString = () => "any";


// array (rev 0.2)
// Array -> Array

const arr = xs => {
  if (isArr(xs)) return xs;
  throw new Error(JSON.stringify({type: "type", nominal: "Array", real: `${introspect(s)}`}));
};

arr.toString = () => "Array";


// tuple (rev 0.2)
// Array -> Array

const tup = arr;

tup.toString = () => "Tuple";


// array of (rev 0.2)
// (a -> a) -> [a] -> [a]

const arrOf = c => {
  if (!isFun(c)) throw new TypeSysError(
    `arrOf expects argument #1 of type Function \u2BC8\u2BC8\u2BC8 ${introspect(c)} received`
  );

  if (!isUnary(c)) throw new TypeSysError(
    `arrOf expects argument #1 of type Unary \u2BC8\u2BC8\u2BC8 ${arityMap[c.length]} received`
  );

  const arrOf2 = xs => {
    if (!isArr(xs)) throw new Error(
      JSON.stringify({type: "type", nominal: "Array", real: `${introspect(xs)}`})
    );

    if ($type in xs) {
      if (xs[$type] === type) return xs;
      else throw new Error(JSON.stringify({type: "type", nominal: `${type}`, real: `${xs[$type]}`}));
    }

    xs.forEach((x, n) => {
      try {c(x)}

      catch (e) {
        const o = JSON.parse(e.message);
        o.nominal = `${type} \u2BC8 ${o.nominal}`;
        o.real = `${o.real} at index #${n}`;
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

arrOf.toString = () => "[a]";


// tuple of (rev 0.2)
// [? -> ?] -> Array -> Array

const tupOf = cs => {
  cs.forEach((c, n) => {
    if (!isFun(c)) throw new TypeSysError(
      `tupOf expects argument #1 of type [Function] \u2BC8\u2BC8\u2BC8 ${introspect(c)} at index #${n} received`
    );
  });
  
  cs.forEach((c, n) => {
    if (!isUnary(c)) throw new TypeSysError(
      `tupOf expects argument #1 of type [Unary] \u2BC8\u2BC8\u2BC8 ${arityMap[c.length]} at index #${n} received`
    );
  });

  const tupOf2 = xs => {
    if (!isArr(xs)) throw new Error(
      JSON.stringify({type: "type", nominal: "Array", real: `${introspect(xs)}`})
    );

    if (cs.length !== xs.length) throw new Error(
      JSON.stringify({type: "length", nominal: cs.length, real: xs.length})
    );

    if ($type in xs) {
      if (xs[$type] === type) return xs;
      else throw new Error(JSON.stringify({type: "type", nominal: `${type}`, real: `${xs[$type]}`}));
    }

    cs.forEach((c, n) => {
      try {c(xs[n])}

      catch (e) {
        const o = JSON.parse(e.message);
        let e_;

        switch (o.type) {
          case "length": {
            o.real = `length ${o.real} at index #${n}`;
            e_ = new Error(JSON.stringify(o));
            e_.stack = e.stack;
            throw e_;
          }

          case "type": {
            o.nominal = `${type} \u2BC8 ${o.nominal}`;
            o.real = `${o.real} at index #${n}`;
            e_ = new Error(JSON.stringify(o));
            e_.stack = e.stack;
            throw e_;
          }

          default: TypeSysError(`tupOf2 received invalid error type ${o.type}`);
        }
      }
    });

    return xs;
  };

  const type = `(${cs})`;
  return tupOf2.toString = () => type, tupOf2;
};

tupOf.toString = () => "Tuple";


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


// is lower case (rev 0.1)
// a -> Boolean

const isLC = x => isChr(x) && x.search(/[a-z]/) === 0;


// is letter (rev 0.1)
// a -> Boolean

const isLetter = x => isChr(x) && x.search(/[a-z]/i) === 0;


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


// is number string (rev 0.1)
// a -> Boolean

const isNumStr = x => isStr(x) && x * 1 + "" === x;


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


// is upper case (rev 0.1)
// a -> Boolean

const isUC = x => isChr(x) && x.search(/[A-Z]/) === 0;


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


// Length Error (rev 0.1)
// String -> LenghError

class LengthError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, LengthError);
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
      case Symbol.toPrimitive: return o[k]
      case Symbol.toStringTag: return o[k]
      
      default: {
        if (!(k in o)) throw new TypeError(
          `value of type ${type} received invalid get operation for unknown ${isNumStr(k) ? `index #${k}` : `property "${k}"`}`
        );

        return o[k];
      }
    }
  },

  set: (o, k, v, _) => {
    if (isStr(v)) v = `"${v}"`;

    throw new TypeError(
      `immutable value of type ${type} received invalid set operation for ${isNumStr(k) ? `index #${k}` : `property "${k}"`} with value ${v}`
    );
  }
});


/******************************************************************************
********************************[ 4.1. TUPLE ]*********************************
******************************************************************************/


// Tuple (rev 0.2)
// ([? -> ?], Array) -> Array

const Tup = (cs, xs) => {
  if (TYPE_CHECK) {
    if (!isArr(cs)) throw new TypeError(
      `Tup expects argument #1 of type Array \u2BC8\u2BC8\u2BC8 ${introspect(cs)} received`
    );

    cs.forEach((c, n) => {
      if (!isFun(c)) throw new TypeSysError(
        `Tup expects argument #1 of type [Function] \u2BC8\u2BC8\u2BC8 ${introspect(c)} at index #${n} received`
      );

      if ($("length", of(c), gt(1))) throw new TypeSysError(
        `Tup expects argument #1 of type [Nullary]/[Unary] \u2BC8\u2BC8\u2BC8 ${arityMap[c.length]} at index #${n} received`
      );

      if (isNullary(c) && !isUnary(c())) throw new TypeSysError(
        `Tup expects argument #1 of type [() -> ? -> ?] \u2BC8\u2BC8\u2BC8 () -> (${arityType(c())}) -> ? at index #${n} received`
      );
    });

    if (!isArr(xs)) throw new TypeError(
      `Tup expects argument #2 of type Array \u2BC8\u2BC8\u2BC8 ${introspect(xs)} received`
    );

    if (cs.length !== xs.length) throw new LengthError(
      `Tup expects argument #2 of type Array of length ${cs.length} \u2BC8\u2BC8\u2BC8 length ${xs.length} received`
    );

    cs = cs.map(c => isNullary(c) ? c() : c);
    const type = `(${cs})`;
    try{tupOf(cs) (xs)}

    catch (e) {
      const o = JSON.parse(e.message);
      let e_;

      switch (o.type) {
        case "length": {
          e_ = new LengthError(`Tup expects argument #2 of type Array of length ${o.nominal} \u2BC8\u2BC8\u2BC8 ${o.real} received`);
          break;
        }

        case "type": {
          e_ = new TypeError(`Tup expects argument #2 of type ${o.nominal} \u2BC8\u2BC8\u2BC8 ${o.real} received`);
          break;
        }

        default: throw new TypeSysError(`Tup received invalid error type ${o.type}`);
      }

      e_.stack = e.stack;
      throw e_;
    }

    return new Proxy(virtRec(unwrapTypeRec(typeTokens) (type).slice(1), xs), handleProd(type));
  }

  return xs;
};

Tup.of = (cs, ...xs) => Tup(cs, xs);

Tup.from = (cs, iter) => Tup(cs, Array.from(iter));


/******************************************************************************
********************************[ 4.2. RECORD ]********************************
******************************************************************************/


// Record (rev 0.2)
// ({String: ? -> ?}, Object) -> Object

/*const Rec = (o, p) => {
  if (TYPE_CHECK) {
    if (!isObj(o)) throw new TypeError(
      `Rec expects argument #1 of type Object \u2BC8\u2BC8\u2BC8 ${introspect(o)} received`
    );

    Object.keys(o).forEach((k => {
      const c = o[k];

      if (!isFun(c)) throw new TypeSysError(
        `Rec expects argument #1 of type {String:Function} \u2BC8\u2BC8\u2BC8 ${introspect(c)} at key "${k}" received`
      );

      if ($("length", of(c), gt(1))) throw new TypeSysError(
        `Rec expects argument #1 of type {String:Nullary}/{String:Unary} \u2BC8\u2BC8\u2BC8 ${arityMap[c.length]} at key "${k}" received`
      );

      if (isNullary(c) && !isUnary(c())) throw new TypeSysError(
        `Rec expects argument #1 of type {String:() -> ? -> ?} \u2BC8\u2BC8\u2BC8 () -> (${arityType(c())}) -> ? at key "${k}" received`
      );
    });

    if (!isObj(p)) throw new TypeError(
      `Rec expects argument #2 of type Object \u2BC8\u2BC8\u2BC8 ${introspect(p)} received`
    );

    if (Object.keys(o).length !== Object.keys(p).length) throw new LengthError(
      `Rec expects argument #2 of type Object with ${cs.length} propert(y/ies) \u2BC8\u2BC8\u2BC8 ${xs.length} propert(y/ies) received`
    );

    o = Object.keys(o).reduce((acc, k) => (acc[k] = isNullary(o[k]) ? o[k] () : o[k], acc), {});
    const type = `{${Object.keys(o).map(k => o[k]).join(",")}}`;
    try{recOf(o) (p)}

    catch (e) {
      const q = JSON.parse(e.message);
      let e_;

      switch (q.type) {
        case "length": {
          e_ = new LengthError(`Tup expects argument #2 of type Array of length ${q.nominal} \u2BC8\u2BC8\u2BC8 ${q.real} received`);
          break;
        }

        case "type": {
          e_ = new TypeError(`Tup expects argument #2 of type ${q.nominal} \u2BC8\u2BC8\u2BC8 ${q.real} received`);
          break;
        }

        default: throw new TypeSysError(`Tup received invalid error type ${q.type}`);
      }

      e_.stack = e.stack;
      throw e_;
    }

    return new Proxy(virtRec(unwrapTypeRec(typeTokens) (type).slice(1), xs), handleProd(type));
  }

  return xs;
};*/


/******************************************************************************
********************************[ 4.3. ARRAY ]*********************************
******************************************************************************/


// --[ CONSTRUCTOR ]-----------------------------------------------------------


// Array (rev 0.2)
// ((a -> a), [a]) -> [a]

const Arr = (c, xs) => {
  if (TYPE_CHECK) {
    if (!isFun(c)) throw new TypeSysError(
      `Arr expects argument #1 of type Function \u2BC8\u2BC8\u2BC8 ${introspect(xs)} received`
    );

    if ($("length", of(c), gt(1))) throw new TypeSysError(
      `Arr expects argument #1 of type Nullary/Unary \u2BC8\u2BC8\u2BC8 ${arityMap[c.length]} received`
    );

    if (isNullary(c) && !isUnary(c())) throw new TypeSysError(
      `Arr expects argument #1 of type () -> ? -> ? \u2BC8\u2BC8\u2BC8 () -> (${arityType(c())}) -> ? received`
    );

    if (!isArr(xs)) throw new TypeError(
      `Arr expects argument #2 of type Array \u2BC8\u2BC8\u2BC8 ${introspect(xs)} received`
    );

    if (isNullary(c)) c = c();
    const type = `[${c}]`;
    try{arrOf(c) (xs)}

    catch (e) {
      const o = JSON.parse(e.message);
      const e_ = new TypeError(`Arr expects argument #2 of type ${type} \u2BC8\u2BC8\u2BC8 ${o.real} received`);
      e_.stack = e.stack;
      throw e_;
    }

    return new Proxy(virtRec(unwrapTypeRec(typeTokens) (type).slice(1), xs), handleProd(type));
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
        return `${name} (${os.reduce((acc, o) => acc.concat(Object.keys(o).map(k => o[k] + "")), []).join(",")})`; // + ""?
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


// greater than
// a -> a -> Boolean

const gt = y => x => x > y;


/******************************************************************************
********************************[ 7.1. BOOLEAN ]*******************************
******************************************************************************/


// xor
// Boolean -> Boolean -> Boolean

const xor = x => y => !x === !y ? false : true;


/******************************************************************************
********************************[ 7.2. STRING ]********************************
******************************************************************************/


// interpolate
// Object -> String -> String

const interpolate = o => s => s.replace(/\${(\w+)}/g, (_, k) => o[k]);


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
  arityMap,
  arityType,
  Arr,
  arr,
  arrOf,
  binary,
  bindTypeVars,
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
  isNumStr,
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
  removeNested,
  ReturnTypeError,
  rol,
  ror,
  $tag,
  splitTypes,
  str,
  succ,
  ternary,
  _throw,
  Tup,
  tupOf,
  typeTokens,
  unary,
  unwrapType,
  unwrapTypeRec,
  variadic,
  virtRec
};