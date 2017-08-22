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


// symbol prefix (rev 1)
// internal
// String

const SYM_PREFIX = "ftor/";


// type check (rev 1)
// internal
// Boolean

const TYPE_CHECK = true;


// --[ SYMBOLS ]---------------------------------------------------------------


// constructor (rev 1)
// internal

const $cons = Symbol.for(SYM_PREFIX + "cons");


// monomorphic type (rev 1)
// internal

const $type = Symbol.for(SYM_PREFIX + "type");


// tag (rev 1)

const $tag = Symbol.for(SYM_PREFIX + "tag");


// catamorphism (rev 1)

const $cata = Symbol.for(SYM_PREFIX + "cata");


/******************************************************************************
*******************************************************************************
****************************[ 2. META PROGRAMMING ]****************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
********************************[ 2.1. TYPES ]*********************************
******************************************************************************/


// --[ SUBTYPING ]-------------------------------------------------------------


// char (rev 1)
// Char -> Char

class Char extends String {
  constructor(x) {
    if (!isChr(x)) throw new TypeError(
      `Char expects\n\nChar -> Char\n${ulAtCall("Char -> Char", 0)}\n\n${introspect(x)} received\n`
    );

    super(x);
  }
}


// --[ FUNCTION VIRTUALIZATION ]-----------------------------------------------


// Function (rev 1)
// virtualize function
// (String, Function) -> Function

const Fun = (s, f) => {
  if (TYPE_CHECK) {
    if (!isStr(s)) throw new TypeSysError(
      `Fun expects\n\n(String, Function) -> Function\n${ul(1, 6)}\n\n${introspect(typeSig)} received\n`
    );

    if (!isFun(f)) throw new TypeSysError(
      `Fun expects\n\n(String, Function) -> Function\n${ul(9, 8)}\n\n${introspect(typeSig)} received\n`
    );
    
    const [fname, type] = splitTypeSig(s),
     g = new Proxy(f, handleFun(fname, f, type, defineContract(type), 0, {}));

    g.toString = Function.prototype.toString.bind(f);
    return g;
  }

  return f;
};


// handle function (rev 1)
// internal
// handle apply trap for virtualized function
// (String, Function, String, [? -> ?], PositiveInteger, {String}) -> Function

const handleFun = (fname, f, type, [c, ...cs], nf, bindings) => {
  return {
    apply: (g, _, args) => {
      try {c(args)}

      catch (e) {
        const o = JSON.parse(e.message);
        let e_;

        switch (o.type) {
          case "arity": {
            e_ = new ArityError(
              `${fname} expects ${numIndex[o.nominal]} argument(s)\n\n${type}\n${ulAtCall(type, nf)}\n\n${numIndex[o.real]} argument(s) received\n`
            );

            break;
          }

          case "type": {
            e_ = new TypeError(
              `${fname} expects\n\n${type}\n${ulAtArg(type, nf, o.pos)}\n\n${o.real} received\n`
            );

            break;
          }

          default: throw new TypeSysError(
            `handleFun received invalid error type\n\n${o.type}\n\nduring argument validation`
          );
        }

        e_.stack = e.stack;
        throw e_;
      }

      const bindings_ = bindTypeVars(fname, type, [c.toString()], args, bindings, {}, nf);

      if (cs.length === 1) {
        const r = g(...args);

        try {cs[0] ([r])}

        catch (e) {
          const o = JSON.parse(e.message);
          let e_;

          switch (o.type) {
            case "type": {
              e_ = new ReturnTypeError(
                `${fname} must return\n\n${type}\n${ulAtCall(type, nf)}\n\n${o.real} returned\n`
              );

              break;
            }

            default: throw new TypeSysError(
              `handleFun received invalid error type\n\n${o.type}\n\nduring return value validation\n`
            );
          }

          e_.stack = e.stack;
          throw e_;
        }

        bindTypeVars(fname, type, [cs[0].toString()], [r], Object.assign({}, bindings, bindings_), {}, nf + 1);
        return r;
      }

      const r = new Proxy(
        f(...args),
        handleFun(fname, g, cs, nf + 1, Object.assign({}, bindings, bindings_))
      );

      r.toString = Function.prototype.toString.bind(f);
      return r;
    },

    get: (o, k, _) => k === "name" ? fname : o[k]
  };
};


// --[ AUXILLIARY HELPER ]-----------------------------------------------------


// arity index (rev 0.1)
// {{f: ? -> ?, s: String}}

const arityIndex = ["nullary", "unary", "binary", "ternary", "4-ary", "5-ary"];


// brackets (rev 0.1)
// {String}

const brackets = {"[": "]", "{": "}", "(": ")"};


// curly brackets (rev 0.1)
// {String}

const curlyBrackets = {"{": "}"};


// round brackets (rev 0.1)
// {String}

const roundBrackets = {"(": ")"};


// square brackets (rev 0.1)
// {String}

const squareBrackets = {"[": "]"};


//const compareTypes = x => y => 


// monoMap see @ section XX. DERIVED


// number index (rev 0.1)
// [String]

const numIndex = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];


// ordinal index (rev 0.1)
// [String]

const ordIndex = ["0th", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];


// underline (rev 1)
// (PositiveInteger, PositiveInteger) -> String

const ul = (n, m) => Array(n + 1).join(" ") + Array(m + 1).join("^")


// underline at call (rev 1)
// (String, PositiveInteger) -> String

const ulAtCall = (s, n) => splitFunT(s).reduce((acc, t, n_) => {
  if (n_ < n) return acc + ul(t.length + 4, 0);

  else if (n_ === n) {
    if (t[0] === "(") return acc + ul(1, t.length - 2);
    else return acc + ul(0, t.length);
  }
  
  else return acc;
}, "");


// underline at argument (rev 1)
// (String, PositiveInteger, PositiveInteger) -> String

const ulAtArg = (s, n, m) => splitFunT(s).reduce((acc, t, n_) => {
  if (n_ < n) return acc + ul(t.length + 4, 0);
  
  else if (n_ === n) return t.split(", ").reduce((acc_, t_, m_) => {
    if (m_ < m) return acc_ + ul(t_.length + 2, 0);

    else if (m_ === m) {
      if (t_[0] === "(") return acc_ + ul(1, t_.length - 1);
      else if (t_[t_.length - 1] === ")") return acc_ + ul(0, t_.length - 1);
      else return acc_ + ul(0, t_.length);
    }
    
    else return acc_;
  }, acc);
  
  else return acc;
}, "");


// --[ PARSING / BINDING ]-----------------------------------------------------


// validate type (ref 1)
// String -> String

const validateType = s => {
  if (s.search(/,[^ ]/) !== -1) throw new TypeError(`invalid type annotation\n\n${s}\n\nmissing " " after ","`);
  if (s.search(/[^ ]->/) !== -1) throw new TypeError(`invalid type annotation\n\n${s}\n\nmissing " " before "->"`);
  if (s.search(/->[^ ]/) !== -1) throw new TypeError(`invalid type annotation\n\n${s}\n\nmissing " " after "->"`);
  if (s.search(/[^\-]>/) !== -1) throw new TypeError(`invalid type annotation\n\n${s}\n\nmissing "-" before ">"`);
  if (s.search(/ {2}/) !== -1) throw new TypeError(`invalid type annotation\n\n${s}\n\nseveral consecutive " "`);
  if (s.search(/\.{1-2}/) !== -1) throw new TypeError(`invalid type annotation\n\n${s}\n\nmissing "."`);
  return s;
};


// is literal (ref 1)
// {String} -> String -> Boolean

const isLiteralT = selection => s => {
  const aux = (n, cs) => {
    const c = s[n];

    if (cs.length === 0) {
      if (c === ",") throw new TypeError("invalid type enumeration");
      
      if (c === " ") {
        if (s[n + 2] === ">") return false;
        throw new TypeError("invalid type enumeration");
      }
    }

    if (n === 0) {
      if (c in selection) return aux(n + 1, cs.concat(c));
      return false;
    }

    else if (n === s.length - 1) {
      if (c === selection[cs[0]] && cs.length === 1) return true;
      throw new TypeError("bracket mismatch");
    }

    else {
      if (c in brackets) return aux(n + 1, cs.concat(c));

      if (c === brackets[cs[cs.length - 1]]) {
        if (cs.length === 0) throw new TypeError("bracket mismatch");
        if (cs.length === 1) return false;
        return aux(n + 1, cs.slice(0, -1));
      }

      return aux(n + 1, cs);
    }
  };

  validateType(s);
  return aux(0, []);
};


// is array type (ref 1)
// {String} -> String -> Boolean

const isArrT = isLiteralT(squareBrackets);


// is tuple type (ref 1)
// {String} -> String -> Boolean

const isTupT = isLiteralT(squareBrackets);


// is object type (ref 1)
// {String} -> String -> Boolean

const isObjT = isLiteralT(curlyBrackets);


// get object type (ref 1)
// String -> String

const getObjT = s => {
  const aux = (n, dict, cs) => {
    const c = s[n];

    if (cs.length === 0) {
      if (c === ",") throw new TypeError("invalid type enumeration");
      
      if (c === " ") {
        if (s[n + 2] === ">") throw new TypeError("object literal expected");
        throw new TypeError("invalid type enumeration");
      }
    }

    if (n === 0) {
      if (c === "{") {
        if (s[s.length - 1] !== "}") throw new TypeError("object literal expected");
        return aux(n + 1, dict, cs.concat(c));
      }

      throw new TypeError("object literal expected");
    }

    else if (n === s.length - 1) {
      if (c === "}" && cs.length === 1) {
        if (dict[":"] > 0) {
          if (dict[":"] !== dict[","] + 1) throw new TypeError("invalid object literal");
          return "Record";
        }

        else return "Dict";
      }

      throw new TypeError("curly bracket mismatch");
    }

    else {
      if (c in brackets) return aux(n + 1, dict, cs.concat(c));

      if (c === brackets[cs[cs.length - 1]]) {
        if (cs.length === 0) throw new TypeError("bracket mismatch");
        if (cs.length === 1) return false;
        return aux(n + 1, dict, cs.slice(0, -1));
      }

      if ((c === ":" || c === ",") && cs.length === 1) return aux(n + 1, (dict[c]++, dict), cs);
      return aux(n + 1, dict, cs);
    }
  };

  validateType(s);
  return aux(0, {":": 0, ",": 0}, []);
};


// is dictionary type (ref 1)
// String -> Boolean

const isDictT = s => getObjT(s) === "Dict";


// is record type (ref 1)
// String -> Boolean

const isRecT = s => getObjT(s) === "Record";


// is constructed type (ref 1)
// String -> Boolean

const isConstructedT = s => {
  const aux = (n, cs) => {
    const c = s[n];

    if (cs.length === 0) {
      if (c === ",") throw new TypeError("invalid type enumeration");
      
      if (c === " ") {
        if (s[n + 2] === ">") return false;
        throw new TypeError("invalid type enumeration");
      }
    }

    if (n === 0) {
      if (isUC(c)) return aux(n + 1, cs);
      return false;
    }

    else if (n === s.length - 1) {
      if (c === ")" && cs.length === 1) return true;
      throw new TypeError("bracket mismatch");
    }

    else {
      if (cs.length === 0) {
        if (c === "(") return aux(n + 1, cs.concat(c));
        if (c in brackets) throw new TypeError("constructed type expected");
      }

      else {
        if (c in brackets) return aux(n + 1, cs.concat(c));

        if (c === brackets[cs[cs.length - 1]]) {
          if (cs.length === 0) throw new TypeError("bracket mismatch");
          if (cs.length === 1) return false;
          return aux(n + 1, cs.slice(0, -1));
        }
      }

      return aux(n + 1, cs);
    }
  };

  validateType(s);
  return aux(0, []);
};


// is function type (ref 1)
// String -> Boolean

const isFunT = s => {
  const aux = (n, b, cs) => {
    const c = s[n];

    if (cs.length === 0) {
      if (c === ",") throw new TypeError("invalid type enumeration");
      if (c === " " && s[n + 2] !== ">") throw new TypeError("invalid type enumeration");
    }

    if (c === undefined) {
      if (cs.length === 0) return b;
      throw new TypeError("bracket mismatch");
    }

    if (c === ">") return aux(n + 2, true, cs);
    if (c in brackets) return aux(n + 1, b, cs.concat(c));

    if (c === brackets[cs[cs.length - 1]]) {
      if (cs.length === 0) throw new TypeError("bracket mismatch");
      return aux(n + 1, b, cs.slice(0, -1));
    }

    return aux(n + 1, b, cs);
  };

  validateType(s);
  return aux(0, false, []);
};


// is polymorphic type (ref 1)
// Char -> Boolean

const isPolyT = c => c.search(/^[a-z]$/) !== -1;


// is monomorphic type (ref 1)
// String -> Boolean

const isMonoT = s => s.search(/^[A-Z][a-z]*$/) !== -1;


// is value type (ref 1)
// String -> Boolean

const isValueT = s => isMonoT(s);


// is reference type (ref 1)
// String -> Boolean

const isRefT = s => !(isMonoT(s) || isPolyT(s));


// is composite type (ref 1)
// String -> Boolean

const isCompositeT = s => !(isMonoT(s) || isPolyT(s) || isFunT(s));


// parse type (ref 1)
// String -> String

const parseType = s => {
  const c = s[0], d = s[s.length - 1];

  if (c in brackets && d === brackets[c] && isLiteralT(s)) {
    if (c in squareBrackets && isArrT(s)) return "Array";
    if (c in squareBrackets && isTupT(s)) return "Tuple";
    if (c in curlyBrackets && isObjT(s)) return getObjT(s);
  }

  if (isUC(s[0])) {
    if (isMonoT(s)) return "Mono";
    if (isConstructedT(s)) return "Cons";
  }

  if (s.length === 1 && isPolyT(s)) return "Poly";
  if (isFunT(s)) return "Function";
  throw new TypeError("invalid type");
};


// split types (ref 1)
// String -> [String]

const splitTypes = s => {
  const aux = (n, acc, cs) => {
    const c = s[n];

    if (c === undefined) {
      if (cs.length === 0) return acc;
      throw new TypeError("bracket mismatch");
    }

    if (cs.length === 0) {
      if (c === " " && s[n + 2] !== ">") return aux(n + 1, acc.concat(""), cs);
      if (c === ",") return aux(n + 2, acc.concat(""), cs);
      if (c === ">") return aux(n + 2, acc, cs);
    }
    
    acc[acc.length - 1] += c;
    if (c in brackets) return aux(n + 1, acc, cs.concat(c));
    
    if (c === brackets[cs[cs.length - 1]]) {
      if (cs.length === 0) throw new TypeError("bracket mismatch");
      return aux(n + 1, acc, cs.slice(0, -1));
    }
    
    return aux(n + 1, acc, cs);
  };

  validateType(s);
  return aux(0, [""], []);
};


// split function type (ref 1)
// String -> [String]

const splitFunT = s => {
  const aux = (n, acc, buf, cs) => {
    const c = s[n];

    if (c === undefined) {
      if (cs.length === 0) return acc.concat(buf);
      throw new TypeError("bracket mismatch");
    }

    if (cs.length === 0) {
      if (c === ">") return aux(n + 2, acc.concat(buf.slice(0, -2)), "", cs);
      if (c === ",") throw new TypeError("invalid type enumeration");
      if (c === " " && s[n + 2] !== ">") throw new TypeError("invalid type enumeration");
    }

    if (c in brackets) return aux(n + 1, acc, buf + c, cs.concat(c));

    if (c === brackets[cs[cs.length - 1]]) {
      if (cs.length === 0) throw new TypeError("bracket mismatch");
      return aux(n + 1, acc, buf + c, cs.slice(0, -1));
    }

    return aux(n + 1, acc, buf + c, cs);
  };

  validateType(s);
  return aux(0, [], "", []);
};


// split multi-arguments (ref 1)
// String -> [String]

const splitMultiArgs = s => s === "()" ? [] : s.slice(1, -1).split(", ");


// split type signature (rev 1)
// String -> [String]

const splitTypeSig = s => {
  if (!isStr(s)) throw new TypeSysError(
    `splitTypeSig expects\n\nString -> [String]\n${re(6)}\n\n${introspect(s)} received\n`
  );

  if (!s.includes("::")) throw new TypeSysError(
    `splitTypeSig received a type signature without a name component\n\n${s}\n`
  );
  
  if (s.search(/^[a-z]+ :: [^ ]/i) === -1) throw new TypeSysError(
    `splitTypeSig received a type signature with an invalid name component\n\n${s}\n`
  );

  return s.split(" :: ");
};


// unwrap type (ref 1)
// String -> String

const unwrapType = s => {
  switch (parseType(s)) {
    case "Array":
    case "Tuple":
    case "Dict": return s.slice(1, -1);
    case "Record": {
      const aux = (n, acc, buf, cs) => {
        const c = s[n];

        if (n === 0) return aux(n + 1, acc, buf, cs);
        else if (n === s.length - 1) return acc + buf;

        else {
          if (cs.length === 0) {
            if (c === ":") return aux(n + 1, acc, "", cs);
            if (c === ",") return aux(n + 1, acc + buf + ", ", "", cs)
          }

          if (c in brackets) return aux(n + 1, acc, buf + c, cs.concat(c));
          if (c === brackets[cs[cs.length - 1]]) return aux(n + 1, acc, buf + c, cs.slice(0, -1));
          return aux(n + 1, acc, buf + c, cs);
        }
      };

      return aux(0, "", "", []);
    }

    case "Cons": return s.slice(s.indexOf("(") + 1, -1);
    default: return "";
  }
};


// define contract (ref 1)
// String -> ? -> ?

const defineContract = s => {
  switch (parseType(s)) {
    case "Mono": {
      if (s in monoMap) return monoMap[s];
      throw new TypeError("unknown monomorphic type");
    }

    case "Poly": return anyT(s);

    case "Function": return splitFunT(s).map(s_ => {
      const args = s_[0] === "(" ? splitMultiArgs(s_) : [s_];
      return arity(args.length) (...args.map(type => defineContract(type)));
    });

    case "Array": return arrOfT;
    case "Tuple": return tupOfT;
    case "Dict": return dictOfT;
    case "Record": return recOfT;
    case "Cons": return consOfT;
    default: throw new TypeError("unknown type");
  }
};


// bind type variables (rev 1)
// (String, String, [String], Array, {String}, {String}, PositiveInteger) -> {String}

const bindTypeVars = (fname, type, ss, args, bindings, acc, nf) => ss.reduce((acc, s, narg) => {
  if (isPolyT(s)) {
    if (s in acc) {
      if (acc[s] !== introspect(args[narg])) throw new TypeError(
        `${fname} expects bounded type variable\n\n"${s}" to be of type ${acc[s]}\n\nfor all occurances in\n\n${type}\n${ulAtArg(type, nf, narg)}\n\n${introspect(args[narg])} received\n`
      );

      else return acc;
    }

    else return (acc[s] = introspect(args[narg]), acc);
  }
  
  else if (isCompositeT(s)) return bindTypeVars(fname, type, splitTypes(unwrapType(s)), args[narg], acc, nf);
  else return acc;
}, Object.assign({}, bindings));


// virtualize recursively (rev 0.1)
// ([String], [a]) -> [a]

const virtualizeRec = ([type, ...types], xs) => {
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


// arity (rev 0.1)
// Number -> (...a -> a) -> Array -> Array

const arity = n => {
  if (!(isPositiveInt(n) || isInfinite(n))) throw new TypeSysError(
    `arity expects argument #1 of type Natural/Infinite \u2BC8\u2BC8\u2BC8 ${introspect(n)} received`
  );

  const arity2 = (...cs) => {
    if (isFinite(n)) {
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
        `arity2 expects argument #1 of type [? -> ?] \u2BC8\u2BC8\u2BC8 (${arityScheme(c)}) -> ? at index #${m} received`
      );
    });

    const arity3 = args => {
      if (!isArr(args)) throw new TypeSysError(
        `arity3 expects argument #1 of type Array \u2BC8\u2BC8\u2BC8 ${introspect(args)} received`
      );

      if (isFinite(n)) {
        if (args.length !== n) throw new Error(JSON.stringify({type: "arity", nominal: n, real: args.length}));
      }

      args.forEach((x, m) => {
        try {isFinite(n) ? cs[m] (x) : cs[0] (x)}

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


// _4ary see @ section XX. DERIVED


// _5ary see @ section XX. DERIVED


// variadic see @ section XX. DERIVED


// --[ MONOMORPHIC CONTRACTS ]-------------------------------------------------


// boolean (rev 0.1)
// Boolean -> Boolean

const booT = x => {
  if (isBoo(x)) return x;
  throw new Error(JSON.stringify({type: "type", nominal: "Boolean", real: `${introspect(x)}`}));
};

booT.toString = () => "Boolean";


// null (rev 0.1)
// Null -> Null

const nullT = x => {
  if (isNull(x)) return x;
  throw new Error(JSON.stringify({type: "type", nominal: "Null", real: `${introspect(x)}`}));
};

nullT.toString = () => "Null";


// number (rev 0.1)
// Number -> Number

const numT = x => {
  if (isNum(x)) return x;
  throw new Error(JSON.stringify({type: "type", nominal: "Number", real: `${introspect(x)}`}));
};

numT.toString = () => "Number";


// string (rev 0.1)
// String -> String

const strT = x => {
  if (isStr(x)) return x;
  throw new Error(JSON.stringify({type: "type", nominal: "String", real: `${introspect(x)}`}));
};

strT.toString = () => "String";


// symbol (rev 0.1)
// Symbol -> Symbol

const symT = x => {
  if (isSym(x)) return x;
  throw new Error(JSON.stringify({type: "type", nominal: "Symbol", real: `${introspect(x)}`}));
};

symT.toString = () => "Symbol";


// --[ POLYMORPHIC CONTRACTS ]-------------------------------------------------


// any (rev 0.1)
// String -> a -> a

const anyT = c => {
  if (!isLC(c)) throw new TypeSysError(
    `anyT expects argument #1 of type Char/lower case letter \u2BC8\u2BC8\u2BC8 ${introspect(c)} received`
  );

  const anyT2 = x => x;
  anyT2.toString = () => c;
  return anyT2;
};


// array (rev 0.1)
// Array -> Array

const arr = xs => {
  if (isArr(xs)) return xs;
  throw new Error(JSON.stringify({type: "type", nominal: "Array", real: `${introspect(s)}`}));
};

arr.toString = () => "Array";


// tuple (rev 0.1)
// Array -> Array

const tup = arr;

tup.toString = () => "Tuple";


// array of (rev 0.1)
// (a -> a) -> [a] -> [a]

const arrOf = c => {
  if (!isFun(c)) throw new TypeSysError(
    `arrOf expects argument #1 of type Function \u2BC8\u2BC8\u2BC8 ${introspect(c)} received`
  );

  if (!isUnary(c)) throw new TypeSysError(
    `arrOf expects argument #1 of type ? -> ? \u2BC8\u2BC8\u2BC8 ${arityScheme(c)} received`
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


// tuple of (rev 0.1)
// [? -> ?] -> Array -> Array

const tupOf = cs => {
  cs.forEach((c, n) => {
    if (!isFun(c)) throw new TypeSysError(
      `tupOf expects argument #1 of type [Function] \u2BC8\u2BC8\u2BC8 ${introspect(c)} at index #${n} received`
    );
  });
  
  cs.forEach((c, n) => {
    if (!isUnary(c)) throw new TypeSysError(
      `tupOf expects argument #1 of type [? -> ?] \u2BC8\u2BC8\u2BC8 ${arityScheme(c)} at index #${n} received`
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


// get string tag (rev 1)
// a -> String

const getStringTag = x => Object.prototype.toString.call(x).split(" ")[1].slice(0, -1);


// instance of (rev 1)
// Function -> Object -> Boolean

const instanceOf = cons => o => cons.prototype.isPrototypeOf(o);


// has (rev 1)
// String -> Object -> Boolean

const has = k => o => o[k] !== undefined;


// has all (rev 1)
// (...String) -> Object -> Boolean

const hasAll = (...ks) => o => ks.every(k => o[k] !== undefined);


// has of (rev 1)
// (a -> Boolean, String) -> Object -> Boolean

const hasOf = (p, k) => o => o[k] !== undefined && p(o[k]);


// has all of (rev 1)
// {a -> Boolean} -> Object -> Boolean

const hasAllOf = pattern => o => Object.keys(pattern).every(k => hasOf(pattern[k], k) (o));


// is array (rev 1)
// a -> Boolean

const isArr = x => Array.isArray(x);


// isArrLike (rev 1)
// a -> Boolean

const isArrLike = x => isObj(x) && has("length") (x);


// is array of (rev 1)
// (b -> Boolean) -> a -> Boolean

const isArrOf = p => x => isArr(x) && x.every(y => p(y));


// is assigned (rev 1)
// a -> Boolean

const isAssigned = x => !(isUndef(x) || isNull(x));


// is binary (rev 1)
// a -> Boolean

const isBinary = x => isFun(x) && x.length === 2;


// is boolean (rev 1)
// a -> Boolean

const isBoo = x => typeof x === "boolean";


// is boolean string (rev 1)
// a -> Boolean

const isBooStr = x => isStr(x) && (x === "true" || x === "false");


// is char (rev 1)
// a -> Boolean

const isChr = x => isStr(x) && x.length === 1;


// is composite type (rev 1)
// a -> Boolean

const isComposite = x => isObj(x) && !isFun(x);


// const isConsOf


// const isDictOf


// is finite number (rev 1)
// a -> Boolean

const isFinite = x => Number.isFinite(x);


// is float (rev 1)
// a -> Boolean

const isFloat = x => x % 1 > 0;


// is function (rev 1)
// a -> Boolean

const isFun = x => typeof x === "function";


// is infinite number (rev 1)
// a -> Boolean

const isInfinite = x => x === Number.POSITIVE_INFINITY || x === Number.NEGATIVE_INFINITY;


// is integer (rev 1)
// a -> Boolean

const isInt = x => Number.isInteger(x);


// is lower case (rev 1)
// a -> Boolean

const isLC = x => isLetter(x) && x.toLowerCase() === x;


// is letter (rev 1)
// a -> Boolean

const isLetter = x => isChr(x) && x.search(/[a-z]/i) === 0;


// is map (rev 1)
// a -> Boolean

const isMap = x => getStringTag(x) === "Map";


// const isMapOf


// is not a number (rev 1)
// a -> Boolean

const isNaN = x => Number.isNaN(x);


// is negative number (rev 1)
// a -> Boolean

const isNegative = x => isNum(x) && x < 0;


// is negative float (rev 1)
// a -> Boolean

const isNegativeFloat = x => isFloat(x) && x < 0;


// is negative integer (rev 1)
// a -> Boolean

const isNegativeInt = x => isInt(x) && x < 0;


// is negative infinite number (rev 1)
// a -> Boolean

const isNegativeInfinite = x => x === Number.NEGATIVE_INFINITY;


// is non zero number (rev 1)
// a -> Boolean

const isNonZero = x => isNum(x) && x !== 0;


// is non zero float (rev 1)
// a -> Boolean

const isNonZeroFloat = x => isFloat(x) && x !== 0;


// is non zero integer (rev 1)
// a -> Boolean

const isNonZeroInt = x => isInt(x) && x !== 0;


// is non zero positive number (rev 1)
// a -> Boolean

const isNonZeroPositive = x => isNum(x) && x > 0;


// is non zero positive float (rev 1)
// a -> Boolean

const isNonZeroPositiveFloat = x => isFloat(x) && x > 0;


// is non zero positive integer (rev 1)
// a -> Boolean

const isNonZeroPositiveInt = x => isInt(x) && x > 0;


// is null (rev 1)
// a -> Boolean

const isNull = x => x === null;


// is nullary (rev 1)
// a -> Boolean

const isNullary = x => isFun(x) && x.length === 0;


// is number (rev 1)
// a -> Boolean

const isNum = x => typeof x === "number" && !(isNaN(x) || isInfinite(x));


// is number string (rev 1)
// a -> Boolean

const isNumStr = x => isStr(x) && x * 1 + "" === x;


// isObj see @ section XX. DERIVED


// const isObjOf


// is positive number (rev 1)
// a -> Boolean

const isPositive = x => isNum(x) && x >= 0;


// is positive float (rev 1)
// a -> Boolean

const isPositiveFloat = x => isFloat(x) && x >= 0;


// is positive integer (rev 1)
// a -> Boolean

const isPositiveInt = x => isInt(x) && x >= 0;


// is positive infinite number (rev 1)
// a -> Boolean

const isPositiveInfinite = x => x === Number.POSITIVE_INFINITY;


// const isRecOf


// is reference type (rev 1)
// a -> Boolean

const isRef = x => Object(x) === x;


// is set (rev 1)
// a -> Boolean

const isSet = x => getStringTag(x) === "Set";


// const isSetOf


// is string (rev 1)
// a -> Boolean

const isStr = x => typeof x === "string";


// is string of (rev 1)
// a -> Boolean

const isStrOf = p => x => isStr(x) && x.every(y => p(y));


// is symbol (rev 1)
// a -> Boolean

const isSym = x => typeof x === "symbol";


// is ternary (rev 1)
// a -> Boolean

const isTernary = x => isFun(x) && x.length === 3;


// const isTupOf


// is upper case (rev 1)
// a -> Boolean

const isUC = x => isLetter(x) && x.toUpperCase() === x;


// is unary (rev 1)
// a -> Boolean

const isUnary = x => isFun(x) && x.length === 1;


// is undefined (rev 1)
// a -> Boolean

const isUndef = x => x === undefined;


// is value type (rev 1)
// a -> Boolean

const isValue = x => !isObj(x);


// is variadic (rev 1)
// a -> Boolean

const isVariadic = isNullary;


// is weak map (rev 1)
// a -> Boolean

const isWeakMap = x => getStringTag(x) === "WeakMap";


// is weak set (rev 1)
// a -> Boolean

const isWeakSet = x => getStringTag(x) === "WeakSet";


// of (rev 1)
// a -> String -> (b -> Boolean) -> Boolean

const of = x => k => p => p(x[k]);


// introspect (rev 1)
// a -> String

const introspect = x => {
  switch (typeof x) {
    case "undefined": return "Undefined";

    case "number": {
      if (isNaN(x)) return "NaN";
      else if (!isFinite(x)) return "Infinity";
      else return "Number";
    }

    case "string": return "String";
    case "boolean": return "Boolean";
    case "symbol": return "Symbol";
    case "function": return "Function";

    case "object": {
      if (x === null) return "Null";
      else if ($type in x) return x[$type];
      else if ("constructor" in x && x.constructor.name !== "Object") return x.constructor.name;
      else return getStringTag(x);
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


// Tuple (rev 0.1)
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
        `Tup expects argument #1 of type [Nullary]/[Unary] \u2BC8\u2BC8\u2BC8 ${arityScheme(c)} at index #${n} received`
      );

      if (isNullary(c) && !isUnary(c())) throw new TypeSysError(
        `Tup expects argument #1 of type [() -> ? -> ?] \u2BC8\u2BC8\u2BC8 () -> (${arityScheme(c())}) -> ? at index #${n} received`
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


/******************************************************************************
********************************[ 4.3. ARRAY ]*********************************
******************************************************************************/


// --[ CONSTRUCTOR ]-----------------------------------------------------------


// Array (rev 0.1)
// ((a -> a), [a]) -> [a]

const Arr = (c, xs) => {
  if (TYPE_CHECK) {
    if (!isFun(c)) throw new TypeSysError(
      `Arr expects argument #1 of type Function \u2BC8\u2BC8\u2BC8 ${introspect(xs)} received`
    );

    if ($("length", of(c), gt(1))) throw new TypeSysError(
      `Arr expects argument #1 of type () -> ?/? -> ? \u2BC8\u2BC8\u2BC8 ${arityScheme(c)} received`
    );

    if (isNullary(c) && !isUnary(c())) throw new TypeSysError(
      `Arr expects argument #1 of type () -> ? -> ? \u2BC8\u2BC8\u2BC8 () -> (${arityScheme(c())}) -> ? received`
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


// empty array (rev 0.1)
// [a]

const emptyArr = [];


// append array (rev 0.1)
// [a] -> [a] -> [a]

const appendArr = ys => xs => xs.concat(ys);


// prepend array (rev 0.1)
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


// repeat (rev 0.1)
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


// 4-ary (rev 0.1)
// (...? -> ?) -> [a, b, c, d] -> {status: String -> Error}

const _4ary = arity(4);


// 5-ary (rev 0.1)
// (...? -> ?) -> [a, b, c, d, e] -> {status: String -> Error}

const _5ary = arity(5);


// variadic (rev 0.1)
// (...? -> ?) -> [a, b, c] -> {status: String -> Error}

const variadic = arity(Infinity);


// --[ AUXILLIARY HELPER ]-----------------------------------------------------


// mono map (rev 0.1)
// {? -> ?}

const monoMap = {
  Boolean: booT,
  Null: nullT,
  Number: numT,
  String: strT,
  Symbol: symT,
};


// --[ REFLECTION ]------------------------------------------------------------


// is object (rev 1)
// a -> Boolean

const isObj = isRef;


// API


// now public API yet...

module.exports = {};