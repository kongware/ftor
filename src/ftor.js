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


// Function (rev 0.1)
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


// handle function (rev 0.1)
// internal
// handle apply trap for virtualized function
// (String, Contract (a), (...Contract (a) -> Contract (a)), Number) -> Function

const handleFun = (fname, g, [c, ...cs], n) => {
  if (!isStr(fname)) throw new TypeSysError(
    `Fun expects value of type "String" at 1/1 ("${introspect(fname)}" received)`
  );

  if (!isFun(g)) throw new TypeSysError(
    `Fun expects value of type "Function" at 1/2 ("${introspect(g)}" received)`
  );

  cs.concat(c).forEach(c => {
    if (!isFun(c) || $("length", of(c), gt(1))) throw new TypeSysError(
      `Fun expects Array either of type "[? -> ?]" or of type "[() -> ? -> ?]" at 1/3 ("${introspect(c)}" received)`
    );

    if (isNullary(c) && !isUnary(c())) throw new TypeSysError(
      `Fun expects Array of type "[() -> ? -> ?]" at 1/3 ("${introspect(c)}" received)`
    );
  });

  if (!isNat(n)) throw new TypeSysError(
    `Fun expects value of type natural "Number" at 1/4 ("${introspect(n)}" received)`
  );

  return {
    apply: (f, _, args) => {
      const o = isNullary(c) ? c() (Type(args, fname, n, 1)) : c(Type(args, fname, n, 1));

      if (!$_(o, isSumOf, Contract)) throw new TypeSysError(
        `${c} contract must return value of type "Contract (a)" ("${introspect(o)}" returned)`
      );

      if (cs.length === 1) {
        const r = f(...args),
         o = cs[0] (ReturnType(r, fname));

        if (!$_(o, isSumOf, Contract)) throw new TypeSysError(
          `${cs[0]} must return value of type "Contract (a)" ("${introspect(o)}" returned)`
        );

        return r;
      }

      const r = new Proxy(f(...args), handleFun(fname, g, cs, n + 1))
      r.toString = Function.prototype.toString.bind(f);
      return r;
    },

    get: (o, k, _) => k === "name" ? fname : o[k]
  };
};


// --[ CONTRACT GADT ]---------------------------------------------------------


// Contract (rev 0.1)
// internal
// a -> String

const Contract = x => `Contract (${introspect(x)})`;

Contract.toString = () => "Contract (a)";

// catamorphism (rev 0.1)
// Object -> Object -> a

Contract[$cata] = pattern => {
  if (!isObj(pattern)) throw new TypeSysError(
    `cata expects value of type "Object" at 1/1 ("${introspect(pattern)}" received)`
  );

  const cata2 = o => {
    if (!isObj(o)) throw new TypeSysError(
      `cata expects value of type "Object" at 2/1 ("${introspect(o)}" received)`
    );

    return pattern[o[$tag]] (o);
  };

  return cata2;
};


// Type (rev 0.1)
// internal
// (a, String, Number, Number) -> Contract (a)

const Type = (x, fname, nf, nargs) => {
  if (!isStr(fname)) throw new TypeSysError(
    `Type expects value of type "String" at 1/2 ("${introspect(fname)}" received)`
  );

  if (!isNum(nf)) throw new TypeSysError(
    `Type expects value of type "String" at 1/3 ("${introspect(nf)}" received)`
  );

  if (!isNum(nargs)) throw new TypeSysError(
    `Type expects value of type "String" at 1/4 ("${introspect(nargs)}" received)`
  );

  const r = {
    [$cons]: "Contract (a)",
    [$type]: Contract(x),
    [$tag]: Type,
    toString: () => `Type (${x},${fname},${nf},${nargs})`,
    x, fname, nf, nargs
  };

  return Object.freeze(r);
};

Type.toString = () => "Type";


// Return Type (rev 0.1)
// internal
// (a, String) -> Contract (a)

const ReturnType = (x, fname) => {
  if (!isStr(fname)) throw new TypeSysError(
    `ReturnType expects value of type "String" at 1/2 ("${introspect(fname)}" received)`
  );
  
  const r = {
    [$cons]: "Contract (a)",
    [$type]: Contract(x),
    [$tag]: ReturnType,
    toString: () => `ReturnType (${x},${fname})`,
    x, fname
  };

  return Object.freeze(r);
};

ReturnType.toString = () => "ReturnType";


// Arity (rev 0.1)
// internal
// (a, String, Number, Number) -> Contract (a)

const Arity = (x, fname, nf, n) => {
  if (!isStr(fname)) throw new TypeSysError(
    `Arity expects value of type "String" at 1/2 ("${introspect(fname)}" received)`
  );

  if (!isNat(nf)) throw new TypeSysError(
    `Arity expects value of type "natural Number" at 1/3 ("${introspect(nf)}" received)`
  );

  if (!isNat(n)) throw new TypeSysError(
    `Arity expects value of type "natural Number" at 1/4 ("${introspect(n)}" received)`
  );
  
  const r = {
    [$cons]: "Contract (a)",
    [$type]: Contract(x),
    [$tag]: Arity,
    toString: () => `Arity (${x},${fname},${nf},${n})`,
    x, fname, nf, n
  };

  return Object.freeze(r);
};

Arity.toString = () => "Arity";


// Length (rev 0.1)
// internal
// (a, String, Number, Number, Number) -> Contract (a)

const Length = (x, fname, nf, nargs, n) => {
  if (!isStr(fname)) throw new TypeSysError(
    `Length expects value of type "String" at 1/2 ("${introspect(fname)}" received)`
  );

  if (!isNum(nf)) throw new TypeSysError(
    `Length expects value of type "String" at 1/3 ("${introspect(nf)}" received)`
  );

  if (!isNum(nargs)) throw new TypeSysError(
    `Length expects value of type "String" at 1/4 ("${introspect(nargs)}" received)`
  );

  if (!isNum(n)) throw new TypeSysError(
    `Length expects value of type "String" at 1/5 ("${introspect(n)}" received)`
  );

  const r = {
    [$cons]: "Contract (a)",
    [$type]: Contract(x),
    [$tag]: Length,
    toString: () => `Length (${x},${fname},${nf},${nargs},$)`,
    x, fname, nf, nargs, n
  };

  return Object.freeze(r);
};

Length.toString = () => "Length";


// --[ ARITY CONTRACTS ]-------------------------------------------------------


// arity (rev 0.1)
// Number -> (...Contract (a) -> Contract (a)) -> Contract (Array) -> Contract (Array)

const arity = n => {
  if (!isNat(n)) throw new TypeSysError(
    `arity expects value of type "natural Number" at 1/1 ("${introspect(n)}" received)`
  );

  const arity2 = (...cs) => {
    if (!$_(cs, isArrOf, isUnary)) throw new TypeSysError(
      `arity2 expects value of type "[Contract (a) -> Contract (a)]" at 1/1 ("${introspect(cs)}" received)`
    );

    if (cs.length !== n) throw new TypeSysError(
      `arity2 expects ${n} functions of type "Contract (a) -> Contract (a)" at 1/1 ("${introspect(cs.length)}" received)`
    );

    const arity3 = o => {
      if (!$_(o, isSumOf, Contract)) throw new TypeSysError(
        `arity3 expects value of type "Contract (a)" at 1/1 ("${introspect(o)}" received)`
      );

      if (isFinite(n)) nary(Arity(o.x, o.fname, o.nf, n));

      o.x.forEach((x, m) => {
        const r = isFinite(n)
         ? cs[m] (Type(x, o.fname, o.nf, m + 1))
         : cs[0] (Type(x, o.fname, o.nf, m + 1));

        if (!$_(r, isSumOf, Contract)) throw new TypeSysError(
          `${cs[isFinite(n) ? m : 0]} must return value of type "Contract (a)" ("${introspect(r)}" returned)`
        );
      });

      return o
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


// boolean (rev 0.1)
// Contract (Boolean) -> Contract (Boolean)

const boo = o => {
  if (!$_(o, isSumOf, Contract)) throw new TypeSysError(
    `boo expects value of type "Contract (a)" at 1/1 ("${introspect(o)}" received)`
  );

  if (o[$type] === "Contract (Boolean)") return o;
  
  Contract[$cata] ({
    Type: ({x, fname, nf, nargs}) => {
      throw new TypeError(`${fname} expects value of type "Boolean" at ${nf}/${nargs} ("${introspect(x)}" received)`)
    },
    
    ReturnType: ({x, fname}) => {
      throw new ReturnTypeError(`${fname} must return value of type "Boolean" ("${introspect(x)}" returned)`);
    },

    Arity: ({fname}) => {
      throw new TypeSysError(`boo cannot handle values of type "Contract (a)" tagged with "Arity" for ${fname}`);
    },

    Length: ({fname}) => {
      throw new TypeSysError(`boo cannot handle values of type "Contract (a)" tagged with "Length" for ${fname}`);
    }
  }) (o);
};

boo.toString = () => "Boolean";


// number (rev 0.1)
// Contract (Number) -> Contract (Number)

const num = o => {
  if (!$_(o, isSumOf, Contract)) throw new TypeSysError(
    `num expects value of type "Contract (a)" at 1/1 ("${introspect(o)}" received)`
  );

  if (o[$type] === "Contract (Number)") return o;
  
  Contract[$cata] ({
    Type: ({x, fname, nf, nargs}) => {
      throw new TypeError(`${fname} expects value of type "Number" at ${nf}/${nargs} ("${introspect(x)}" received)`)
    },
    
    ReturnType: ({x, fname}) => {
      throw new ReturnTypeError(`${fname} must return value of type "Number" ("${introspect(x)}" returned)`);
    },

    Arity: ({fname}) => {
      throw new TypeSysError(`num cannot handle values of type "Contract (a)" tagged with "Arity" for ${fname}`);
    },

    Length: ({fname}) => {
      throw new TypeSysError(`num cannot handle values of type "Contract (a)" tagged with "Length" for ${fname}`);
    }
  }) (o);
};

num.toString = () => "Number";


// string (rev 0.1)
// Contract (String) -> Contract (String)

const str = o => {
  if (!$_(o, isSumOf, Contract)) throw new TypeSysError(
    `str expects value of type "Contract (a)" at 1/1 ("${introspect(o)}" received)`
  );

  if (o[$type] === "Contract (String)") return o;
  
  Contract[$cata] ({
    Type: ({x, fname, nf, nargs}) => {
      throw new TypeError(`${fname} expects value of type "String" at ${nf}/${nargs} ("${introspect(x)}" received)`)
    },
    
    ReturnType: ({x, fname}) => {
      throw new ReturnTypeError(`${fname} must return value of type "String" ("${introspect(x)}" returned)`);
    },

    Arity: ({fname}) => {
      throw new TypeSysError(`str cannot handle values of type "Contract (a)" tagged with "Arity" for ${fname}`);
    },

    Length: ({fname}) => {
      throw new TypeSysError(`str cannot handle values of type "Contract (a)" tagged with "Length" for ${fname}`);
    }
  }) (o);
};

str.toString = () => "String";


// --[ POLYMORPHIC CONTRACTS ]-------------------------------------------------


// any (rev 0.1)
// Contract (a) -> Contract (a)

const any = o => {
  if (!$_(o, isSumOf, Contract)) throw new TypeSysError(
    `any expects value of type "Contract (a)" at 1/1 ("${introspect(o)}" received)`
  );

  return o;
};

any.toString = () => "any";


// array (rev 0.1)
// Contract (Array) -> Contract (Array)

const arr = o => {
  if (!$_(o, isSumOf, Contract)) throw new TypeSysError(
    `arr expects value of type "Contract (a)" at 1/1 ("${introspect(o)}" received)`
  );

  if (o[$type] === "Contract ([any])" || o[$type] === "Contract (Array)") return o;
  
  Contract[$cata] ({
    Type: ({x, fname, nf, nargs}) => {
      throw new TypeError(`${fname} expects value either of type "[any]" or of type "Array" at ${nf}/${nargs} ("${introspect(x)}" received)`)
    },
    
    ReturnType: ({x, fname}) => {
      throw new ReturnTypeError(`${fname} must return value either of type "[any]" or of type "Array" ("${introspect(x)}" returned)`);
    },

    Arity: ({fname}) => {
      throw new TypeSysError(`arr cannot handle values of type "Contract (a)" tagged with "Arity" for ${fname}`);
    },

    Length: ({fname}) => {
      throw new TypeSysError(`arr cannot handle values of type "Contract (a)" tagged with "Length" for ${fname}`);
    }
  }) (o);
};

arr.toString = () => "Array";


// array of (rev 0.1)
// (Contract (a) -> Contract (a)) -> Contract (a) -> Contract (a)

const arrOf = c => {
  if (!isUnary(c)) throw new TypeSysError(
    `arrOf expects function of type "Contract (a) -> Contract (a)" at 1/1 ("${introspect(c)}" received)`
  );

  const arrOf2 = o => {
    if (!$_(o, isSumOf, Contract)) throw new TypeSysError(
      `arrOf2 expects value of type "Contract (a)" at 1/1 ("${introspect(o)}" received)`
    );

    if (o[$type] !== "Contract ([any])" && o[$type] !== "Contract (Array)") throw new TypeError(
      Contract[$cata] ({
        Type: ({x, fname, nf, nargs}) => {
          throw new TypeError(
            `${fname} expects value of type "${type}" at ${nf}/${nargs} ("${introspect(x)}" received)`
          );
        },
        
        ReturnType: ({x, fname}) => {
          throw new ReturnTypeError(
            `${fname} must return value of type "${type}" ("${introspect(x)}" returned)`
          );
        },

        Arity: ({fname}) => {
          throw new TypeSysError(
            `arrOf2 cannot handle values of type "Contract (a)" tagged with "Arity" for ${fname}`
          );
        },

        Length: ({fname}) => {
          throw new TypeSysError(
            `arrOf2 cannot handle values of type "Contract (a)" tagged with "Length" for ${fname}`
          );
        }
      }) (o)
    );

    if (!isArr(o.x)) throw new TypeSysError(
      `length expects value of type "Array" at 1/1 at property "x" ("${introspect(o.x)}" received)`
    );

    if (o.x[$type] === type) return o;

    Contract[$cata] ({
      Type: ({x: xs, fname, nf, nargs}) => xs.forEach(x => c(Type(x, fname, nf, nargs))),

      ReturnType: ({x: xs, fname}) => xs.forEach(x => c(ReturnType(x, fname))),

      Arity: ({fname}) => {
        throw new TypeSysError(
          `arrOf2 cannot handle values of type "Contract (a)" tagged with "Arity" for ${fname}`
        );
      },

      Length: ({fname}) => {
        throw new TypeSysError(
          `arrOf2 cannot handle values of type "Contract (a)" tagged with "Length" for ${fname}`
        );
      }
    }) (o);

    return o;
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
      Type: ({fname}) => {
        throw new TypeSysError(`length cannot handle values of type "Contract (a)" tagged with "Type" for ${fname}`);
      },

      ReturnType: ({fname}) => {
        throw new TypeSysError(`length cannot handle values of type "Contract (a)" tagged with "ReturnType" for ${fname}`);
      },

      Arity: ({fname}) => {
        throw new TypeSysError(`length cannot handle values of type "Contract (a)" tagged with "Arity" for ${fname}`);
      },

      Length: ({x, fname, nf, nargs, n}) => {
        throw new TypeError(`${fname} expects Array with ${n} element(s) at ${nf}/${nargs} (${x.length} received)`)
      }
    }) (o);
  }

  return o;
};


// n-ary (rev 0.1)
// internal
// Contract (a) -> Contract (a)

const nary = o => {
  if (!isSumOf(Contract) (o)) throw new TypeSysError(
    `nary expects value of type "Contract (a)" at 1/1 ("${introspect(o)}" received)`
  );

  if (!isArr(o.x)) throw new TypeSysError(
    `nary expects value of type "Array" at 1/1 at property "x" ("${introspect(o.x)}" received)`
  );

  if (o.x.length !== o.n) {  
    Contract[$cata] ({
      Type: ({fname}) => {
        throw new TypeSysError(`nary cannot handle values of type "Contract (a)" tagged with "Type" for ${fname}`);
      },

      ReturnType: ({fname}) => {
        throw new TypeSysError(`nary cannot handle values of type "Contract (a)" tagged with "ReturnType" for ${fname}`);
      },

      Arity: ({x, fname, nf, n}) => {
        throw new ArityError(`${fname} expects ${n} argument(s) at ${nf} (${x.length} received)`)
      },
      
      Length: ({x, fname, nf, nargs, n}) => {
        throw new TypeError(`${fname} expects ${x} with ${n} field(s) at ${nf}/${nargs} (${x.length} received)`)
      }
    }) (o);
  }

  return o;
};


// tuple of (rev 0.1)
// (Contract (a) -> Contract (a)) -> Contract (a) -> Contract (a)

const tupOf = cs => {
  if (!isArrOf(isUnary) (cs)) throw new TypeSysError(
    `tupOf expects function of type "Contract (a) -> Contract (a)" at 1/1 ("${introspect(cs)}" received)`
  );

  const tupOf = o => {
    if (!isSumOf(Contract) (o)) throw new TypeSysError(
      `tupOf expects value of type "Contract (a)" at 2/1 ("${introspect(o)}" received)`
    );

    if (o[$mono] !== "Contract (Array)") throw new TypeError(
      Contract[$cata] ({
        Type: ({x, fname, nf, nargs}) => {
          throw new TypeError(
            `${fname} expects value of type "${mono}" at ${nf}/${nargs} ("${introspect(x)}" received)`
          );
        },
        
        ReturnType: ({x, fname}) => {
          throw new ReturnTypeError(
            `${fname} must return value of type "${mono}" ("${introspect(x)}" returned)`
          );
        },

        Arity: ({fname}) => {
          throw new TypeSysError(
            `tupOf cannot handle values of type "Contract (a)" tagged with "Arity" for ${fname}`
          );
        },

        Length: ({fname}) => {
          throw new TypeSysError(
            `tupOf cannot handle values of type "Contract (a)" tagged with "Length" for ${fname}`
          );
        }
      }) (o)
    );

    if (o.x[$mono] === mono) return o;

    Contract[$cata] ({
      Type: ({x: xs, fname, nf, nargs}) => xs.forEach(x => c(Type(x, fname, nf, nargs))),

      ReturnType: ({x: xs, fname}) => xs.forEach(x => c(ReturnType(x, fname))),

      Arity: ({fname}) => {
        throw new TypeSysError(
          `tupOf cannot handle values of type "Contract (a)" tagged with "Arity" for ${fname}`
        );
      },

      Length: ({fname}) => {
        throw new TypeSysError(
          `tupOf cannot handle values of type "Contract (a)" tagged with "Length" for ${fname}`
        );
      }
    }) (o);

    return o;
  };

  const mono = `(${cs.map(c => c + "").join(",")})`;
  return tupOf.toString = () => mono, tupOf;
};

tupOf.toString = () => "(?)";


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


// hasLen (rev 0.1)
// a -> Boolean

const hasLen = has("length");


// is array (rev 0.1)
// a -> Boolean

const isArr = x => Array.isArray(x);


// is array of (rev 0.1)
// (b -> Boolean) -> a -> Boolean

const isArrOf = p => x => isArr(x) && x.every(y => p(y));


// is binary (rev 0.1)
// a -> Boolean

const isBinary = x => x.length === 2;


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

const isFinite = x => Number.isFinite(x);


// is float (rev 0.1)
// a -> Boolean

const isFloat = x => x % 1 > 0;


// is function (rev 0.1)
// a -> Boolean

const isFun = x => typeof x === "function";


// is integer (rev 0.1)
// a -> Boolean

const isInt = x => Number.isInteger(x);


// is not a number (rev 0.1)
// a -> Boolean

const isNaN = x => Number.isNaN(x);


// is not a number (rev 0.1)
// a -> Boolean

const isNat = x => isNum(x) && isPos(x);


// is negative number (rev 0.1)
// a -> Boolean

const isNeg = x => isNum(x) && x < 0;


// is null (rev 0.1)
// a -> Boolean

const isNull = x => x === null;


// is nullary (rev 0.1)
// a -> Boolean

const isNullary = x => x.length === 0;


// is number (rev 0.1)
// a -> Boolean

const isNum = x => typeof x === "number";


// is object (rev 0.1)
// a -> Boolean

const isObj = instanceOf(Object);


// is positive number (rev 0.1)
// a -> Boolean

const isPos = x => x >= 0;


// is string (rev 0.1)
// a -> Boolean

const isStr = x => typeof x === "string";


// is sum of (rev 0.1)
// Function -> a -> Boolean

const isSumOf = cons => x => $_(x, has, $cons) && x[$cons] === cons.toString();


// is symbol (rev 0.1)
// a -> Boolean

const isSym = x => typeof x === "symbol";


// is ternary (rev 0.1)
// a -> Boolean

const isTernary = x => x.length === 3;


// is unary (rev 0.1)
// a -> Boolean

const isUnary = x => x.length === 1;


// is undefined (rev 0.1)
// a -> Boolean

const isUndef = x => x === undefined;


// is value
// a -> Boolean

const isValue = x => !(isUndef(x) || isNull(x));


// is variadic (rev 0.1)
// a -> Boolean

const isVariadic = isNullary;


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
      if (!isFinite(x)) return "Infinity";
      return ["Number"];
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

const handleProd = (poly, mono) => ({
  get: (o, k, _) => {
    if (k === $poly) return poly;
    if (k === $mono) return mono;
    if (k === Symbol.toStringTag) return o[k];
    if (!(k in o)) throw new TypeError(`invalid property request "${k}" for type ${mono}`);
    return o[k];
  },

  set: (o, k, v, _) => {
    throw new TypeError(`invalid mutation of property "${k}" with value "${v}" for immutable type "${mono}"`);
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


// Array (rev 0.1)
// ((Contract (a) -> Contract (a)), [a]) -> [a]

const Arr = (c, xs) => {
  if (TYPE_CHECK) {
    if (!isUnary(c)) throw new TypeSysError(
      `Arr expects function of type "Contract (a) -> Contract (a)" at 1/1 ("${introspect(c)}" received)`
    );

    if (!isArr(xs)) throw new TypeSysError(
      `Arr expects value of type "Array" at 1/2 ("${introspect(xs)}" received)`
    );

    const poly = "[a]",
     mono = `[${c}]`;

    arrOf(c) (Type(xs, "Arr", 1, 2));
    return new Proxy(xs, handleProd(poly, mono));
  }

  return xs;
};

Arr.of = (c, ...xs) => Arr(c, xs);

Arr.from = (c, iter) => Arr(c, Array.from(iter));


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
******************************[ 8. COMBINATORS ]*******************************
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
  isArr,
  isArrOf,
  isBinary,
  isBoo,
  isChr,
  isEmpty,
  isFinite,
  isFloat,
  isFun,
  isInt,
  isNaN,
  isNat,
  isNeg,
  isNull,
  isNullary,
  isNum,
  isObj,
  isPos,
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