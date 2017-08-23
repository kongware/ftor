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


// Char (rev 1)
// Char -> Char

class Char extends String {
  constructor(x) {
    if (!isChr(x)) throw new TypeError(
      `Char expects\n\nChar -> Char\n${ulAtCall("Char -> Char", 0)}\n\n${introspect(x)} received\n`
    );

    super(x);
  }
}


// Float (rev 1)
// Float -> Float

class Float extends Number {
  constructor(x) {
    if (!isFloat(x)) throw new TypeError(
      `Float expects\n\nFloat -> Float\n${ulAtCall("Float -> Float", 0)}\n\n${introspect(x)} received\n`
    );

    super(x);
  }
}


// Integer (rev 1)
// Integer -> Integer

class Integer extends Number {
  constructor(x) {
    if (!isInt(x)) throw new TypeError(
      `Integer expects\n\nInteger -> Integer\n${ulAtCall("Integer -> Integer", 0)}\n\n${introspect(x)} received\n`
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
      `Fun expects\n\n(String, Function) -> Function\n${ul(1, 6)}\n\n${introspect(s)} received\n`
    );

    if (!isFun(f)) throw new TypeSysError(
      `Fun expects\n\n(String, Function) -> Function\n${ul(9, 8)}\n\n${introspect(s)} received\n`
    );
    
    const [fname, anno] = parseTypeSig(s),
     g = new Proxy(f, handleFun(fname, f, validateAnno(anno), defineContract(anno), {}, 0));

    g.toString = Function.prototype.toString.bind(f);
    return g;
  }

  return f;
};


// handle function (rev 1)
// internal
// handle apply trap for virtualized function
// (String, Function, String, [? -> ?], {String}, PositiveInteger) -> Function

const handleFun = (fname, f, anno, [c, ...cs], bindings, nf) => {
  return {
    apply: (g, _, args) => {
      try {c(args)}

      catch (e) {
        const o = JSON.parse(e.message);
        let e_;

        switch (o.type) {
          case "arity": {
            e_ = new ArityError(
              `${fname} expects ${numIndex[o.nominal]} argument(s)\n\n${anno}\n${ulAtCall(anno, nf)}\n\n${numIndex[o.real]} argument(s) received\n`
            );

            break;
          }

          case "type": {
            e_ = new TypeError(
              `${fname} expects\n\n${anno}\n${ulAtArg(anno, nf, o.idx)}\n\n${o.real} received\n`
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

      const bindings_ = bindTypeVars(fname, anno, [c.toString()], args, bindings, {}, nf);

      if (cs.length === 1) {
        const r = g(...args);

        try {cs[0] ([r])}

        catch (e) {
          const o = JSON.parse(e.message);
          let e_;

          switch (o.type) {
            case "type": {
              e_ = new ReturnTypeError(
                `${fname} must return\n\n${anno}\n${ulAtCall(anno, nf + 1)}\n\n${o.real} returned\n`
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

        bindTypeVars(fname, anno, [cs[0].toString()], [r], Object.assign({}, bindings, bindings_), {}, nf + 1);
        return r;
      }

      const r = new Proxy(
        f(...args),
        handleFun(fname, g, anno, cs, Object.assign({}, bindings, bindings_), nf + 1)
      );

      r.toString = Function.prototype.toString.bind(f);
      return r;
    },

    get: (o, k, _) => k === "name" ? fname : o[k]
  };
};


// --[ AUXILLIARY HELPER ]-----------------------------------------------------


// arity index (rev 1)
// internal
// {{f: ? -> ?, s: String}}

const arityIndex = ["nullary", "unary", "binary", "ternary", "4-ary", "5-ary"];


// openBrackets (rev 1)
// internal
// {String}

const openBrackets = {"[": "]", "{": "}", "(": ")"};


// openBrackets inverted (rev 1)
// internal
// {String}

const closedBrackets = {"]": "[", "}": "{", ")": "("};


// curly openBrackets (rev 1)
// internal
// {String}

const curlyBrackets = {"{": "}"};


// round openBrackets (rev 1)
// internal
// {String}

const roundBrackets = {"(": ")"};


// square openBrackets (rev 1)
// internal
// {String}

const squareBrackets = {"[": "]"};


//const compareTypes = x => y => 


// monoMap see @ section XX. DERIVED


// number index (rev 1)
// internal
// [String]

const numIndex = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];


// ordinal index (rev 1)
// internal
// [String]

const ordIndex = ["0th", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];


// underline (rev 1)
// internal
// (PositiveInteger, PositiveInteger) -> String

const ul = (n, m) => Array(n + 1).join(" ") + Array(m + 1).join("^");


// underline at call (rev 1)
// internal
// (String, PositiveInteger) -> String

const ulAtCall = (s, n) => splitFunA(s).reduce((acc, t, n_) => {
  if (n_ < n) return acc + ul(t.length + 4, 0);

  else if (n_ === n) {
    if (t[0] === "(") return acc + ul(1, t.length - 2);
    else return acc + ul(0, t.length);
  }
  
  else return acc;
}, "");


// underline at argument (rev 1)
// internal
// (String, PositiveInteger, PositiveInteger) -> String

const ulAtArg = (s, n, m) => splitFunA(s).reduce((acc, t, n_) => {
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


// validate annotation (ref 1)
// internal
// String -> String

const validateAnno = s => {
  const aux = (n, stack, isCons, dots) => {
    const c = s[n],
     start = n === 0,
     end = n === s.length - 1,
     prev = start ? "" : s[n - 1],
     next = end ? "" : s[n + 1],
     last = stack.length === 0 ? "" : stack[stack.length - 1];

    if (c === undefined) {
      if (stack.length > 0) throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n - 1, 1)}\n\n"${last}" bracket missing\n`
      );

      return s;
    }

    else if (c in openBrackets) {
      if (c === "(" && prev.search(/[a-z]/i) !== -1) isCons = true;

      else if (prev.search(/[a-z]/i) !== -1) throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal bracket\n`
      );

      return aux(n + 1, stack.concat(openBrackets[c]), isCons, dots);
    }

    else if (c in closedBrackets) {
      if (stack.length === 0) throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nunnecessary "${c}" bracket\n`
      );

      if (c !== last) throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\n"${last}" bracket expected\n`
      );

      if (stack.length === 1 && !end) {
        if (next === ",") throw new TypeSysError(
          `validateAnno received an invalid type annotation\n\n${s}\n${ul(n + 1, 1)}\n\nillegal type enumeration\n`
        );

        else throw new TypeSysError(
          `validateAnno received an invalid type annotation\n\n${s}\n${ul(n + 1, s.length - n - 1)}\n\nillegal trailing chars\n`
        );
      }

      if (next.search(/[a-z]/i) !== -1) throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n + 1, 1)}\n\nillegal char\n`
      );

      if (c === ")") isCons = false;
      return aux(n + 1, stack.slice(0, -1), isCons, dots);
    }

    else if (c === ",") {
      if (stack.length === 0) throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal type enumeration\n`
      );

      if (prev.search(/[a-z\]})]/i) === -1) throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal ","\n`
      );

      if (next !== " ") throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nmissing " "\n`
      );
    }

    else if (c === " ") {
      if (isCons || next === "-") {
        if (prev.search(/[a-z\]}),>:]/i) === -1) throw new TypeSysError(
          `validateAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal char\n`
        );
      }

      else {
        if (prev.search(/[,>:]/i) === -1) throw new TypeSysError(
          `validateAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal char\n`
        );
      }

      if (next.search(/[a-z\[{(\-\.]/i) === -1) throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal char\n`
      );
    }

    else if (c === ":") {
      if (stack.length === 0 || last !== "}")  throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal ":"\n`
      );

      if (prev.search(/[a-z]/i) === -1)  throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n - 1, 1)}\n\nillegal char\n`
      );

      if (next !== " ")  throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nmissing " "\n`
      );
    }

    else if (c === ".") {
      dots++;

      if (dots === 1 && !(prev === "" || prev === " ")) throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n - 1, 1)}\n\nillegal char\n`
      );

      if (dots <= 2 && next !== ".") throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nmissing "."\n`
      );

      if (dots === 3 && next.search(/[a-z]/i) === -1) throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n + 1, 1)}\n\nillegal char\n`
      );

      if (dots === 3) aux(n + 1, stack, isCons, 0);
    }

    else if (c === "-") {
      if (prev !== " ") throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nmissing " "\n`
      );

      if (next !== ">") throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nmissing ">"\n`
      );
    }

    else if (c === ">") {
      if (prev !== "-") throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nmissing "-"\n`
      );

      if (next !== " ") throw new TypeSysError(
        `validateAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nmissing " "\n`
      );
    }

    else if (c.search(/[a-z\[\](){}\.,\->: ]/i) === -1) throw new TypeSysError(
      `validateAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal char\n`
    );

    if ([" ", ",", "-", ">", ":"].includes(c) && c === next) throw new TypeSysError(
      `validateAnno received an invalid type annotation\n\n${s}\n${ul(n + 1, 1)}\n\nillegal char\n`
    );

    if (end) {
      if (stack.length !== 0) {
        const idx = s.lastIndexOf(closedBrackets[stack[stack.length - 1]]);

        throw new TypeSysError(
          `validateAnno received an invalid type annotation\n\n${s}\n${ul(idx, s.length - idx)}\n\nmissing "${stack[stack.length - 1]}" bracket\n`
        );
      }

      else return s;
    }

    return aux(n + 1, stack, isCons, dots);
  };

  return aux(0, [], false, 0);
};


// is literal annotation (ref 1)
// internal
// {String} -> String -> Boolean

const isLiteralA = tokens => s => {
  const aux = (n, stack) => {
    const c = s[n];

    if (c === undefined) return true;

    else if (n === 0) {
      if (c in tokens && s[s.length - 1] === tokens[c]) return aux(n + 1, stack.concat(c));
      else return false;
    }

    else {
      if (c in openBrackets) return aux(n + 1, stack.concat(c));
      else if (c === openBrackets[stack[stack.length - 1]]) return aux(n + 1, stack.slice(0, -1));
      else if (c === "-" && stack.length === 0) return false;
      else return aux(n + 1, stack);
    }
  };

  return aux(0, []);
};


// is array literal annotation (ref 1)
// internal
// {String} -> String -> Boolean

const isArrA = isLiteralA(squareBrackets);


// is tuple literal annotation (ref 1)
// internal
// {String} -> String -> Boolean

const isTupA = isLiteralA(squareBrackets);


// is object literal annotation (ref 1)
// internal
// {String} -> String -> Boolean

const isObjA = isLiteralA(curlyBrackets);


// get object type (ref 1)
// internal
// String -> String

const getObjT = s => {
  const aux = (n, dict) => {
    const c = s[n];

    if (c === undefined) {
      if (s.match(/(?:{|, )[a-z]+: ./gi).length !== dict[":"] || dict[":"] - dict[","] !== 1) throw new TypeSysError(
        `getObjT received invalid record type annotation\n\n${s}\n${ul(0, s.length)}\n\ninvalid property notation\n`
      );

      if (dict[":"] === 0) return "Dict";
      else return "Record";
    }

    if (n === 0) {
      if (c !== "{" || s[s.length - 1] !== "}") throw new TypeSysError(
        `getObjT expects object literal annotation\n\n${s}\n\nreceived\n`
      );

      else return aux(n + 1, dict);
    }

    else {
      if (c === ":" || c === ",") return aux(n + 1, (dict[c]++, dict));
      else return aux(n + 1, dict);
    }
  };

  return aux(0, {":": 0, ",": 0});
};


// is dictionary literal annotation (ref 1)
// internal
// String -> Boolean

const isDictA = s => getObjT(s) === "Dict";


// is record literal annotation (ref 1)
// internal
// String -> Boolean

const isRecA = s => getObjT(s) === "Record";


// is constrcutor annotation (ref 1)
// internal
// String -> Boolean

const isConsA = s => {
  const aux = (n, stack) => {
    const c = s[n];

    if (c === undefined) return true;

    if (n === 0) {
      if (!isUC(c) || s[s.length - 1] !== ")") return false;
      else return aux(n + 1, stack);
    }

    else {
      if (stack.length === 0) {
        if (c === "(") return aux(n + 1, stack.concat(c));
        else if (isLetter(c)) return aux(n + 1, stack);
        else return false;
      }

      else {
        if (c in openBrackets) return aux(n + 1, stack.concat(c));
        else if (c === openBrackets[stack[stack.length - 1]]) return aux(n + 1, stack.slice(0, -1));
        else if (c === "-" && stack.length === 0) return false;
        else return aux(n + 1, stack);
      }
    }
  };

  return aux(0, []);
};


// is function annotation (ref 1)
// internal
// String -> Boolean

const isFunA = s => {
  const aux = (n, stack) => {
    const c = s[n];

    if (c === undefined) return false;

    if (stack.length === 0) {
      if (c === "-") return true;
      else if (c in openBrackets) return aux(n + 1, stack.concat(c));
      else return aux(n + 1, stack);
    }

    else {
      if (c in openBrackets) return aux(n + 1, stack.concat(c));
      else if (c === openBrackets[stack[stack.length - 1]]) return aux(n + 1, stack.slice(0, -1));
      else return aux(n + 1, stack);
    }
  };

  return aux(0, []);
};


// is polymorphic annotation (ref 1)
// internal
// Char -> Boolean

const isPolyA = c => c.search(/^[a-z]$/) !== -1;


// is monomorphic annotation (ref 1)
// internal
// String -> Boolean

const isMonoA = s => s.search(/^[A-Z][a-z]*$/) !== -1;


// is value type annotation (ref 1)
// internal
// String -> Boolean

const isValTypeA = s => isMonoA(s);


// is reference type annotation (ref 1)
// internal
// String -> Boolean

const isRefTypeA = s => !(isMonoA(s) || isPolyA(s));


// is composite type annotation (ref 1)
// internal
// String -> Boolean

const isCompoTypeA = s => !(isMonoA(s) || isPolyA(s) || isFunA(s));


// parse type signature (rev 1)
// internal
// String -> [String]

const parseTypeSig = s => {
  if (!s.includes("::")) throw new TypeSysError(
    `parseTypeSig received an invalid type annotation\n\n${s}\n${ul(0, 1)}\n\nname component "name :: " missing\n`
  );
  
  if (s.search(/^[a-z]+ :: [^ ]/i) === -1) throw new TypeSysError(
    `parseTypeSig received an invalid type annotation\n\n${s}\n${ul(0, s.indexOf("::") + 2)}\n\ninvalid name component\n`
  );

  return s.split(" :: ");
};


// parse annotation (ref 1)
// internal
// String -> String

const parseAnno = s => {
  const c = s[0];

  if (c in openBrackets && s[s.length - 1] === openBrackets[c] && isLiteralA(s)) {
    if (c in squareBrackets && isArrA(s)) return "Array";
    if (c in squareBrackets && isTupA(s)) return "Tuple";
    if (c in curlyBrackets && isObjA(s)) return getObjT(s);
  }

  if (isUC(s[0])) {
    if (isMonoA(s)) return "Mono";
    if (isConsA(s)) return "Cons";
  }

  if (isPolyA(s) && s.length === 1) return "Poly";
  if (isFunA(s)) return "Function";
  throw new TypeSysError(`parseAnno received an unknown type annotation\n\n${s}\n`);
};


// split annotation enumeration (ref 1)
// internal
// String -> [String]

const splitAnnoEnum = s => {
  const aux = (n, acc, stack) => {
    const c = s[n],
     prev = n === 0 ? "" : s[n - 1],
     next = n === s.length - 1 ? "" : s[n + 1];

    if (c === undefined) return acc;

    else if (c === ",") {
      if (stack.length === 0) return aux(n + 2, acc.concat(""), stack);
    }
    
    else if (c === " ") {
      if (stack.length === 1 && stack[stack.length - 1] === ")") {
        if (prev !== ">" && next !== "-") return aux(n + 1, acc.concat(""), stack);
      }
    }

    else acc[acc.length - 1] += c;

    if (c in openBrackets) return aux(n + 1, acc, stack.concat(c));
    else if (c === openBrackets[stack[stack.length - 1]]) return aux(n + 1, acc, stack.slice(0, -1));
    else return aux(n + 1, acc, stack);
  };

  return aux(0, [""], []);
};


// split function annotation (ref 1)
// internal
// String -> [String]

const splitFunA = s => {
  const aux = (n, acc, stack) => {
    const c = s[n],
     next = n === s.length - 1 ? "" : s[n + 1];

    if (c === undefined) return acc;

    else if (c === " " && next === "-") {
      if (stack.length === 0) return aux(n + 4, acc.concat(""), stack);
    }
    
    else acc[acc.length - 1] += c;

    if (c in openBrackets) return aux(n + 1, acc, stack.concat(c));
    else if (c === openBrackets[stack[stack.length - 1]]) return aux(n + 1, acc, stack.slice(0, -1));
    else return aux(n + 1, acc, stack);
  };

  return aux(0, [""], []);
};


// deconstruct argument annotation (ref 1)
// internal
// String -> {args: [String], arity: PositiveNumber}

const deconsArgA = s => {
  if (s.indexOf("...") === 0) return {args: [s.slice(3)], arity: Infinity};
  else if (s === "()") return {args: [], arity: 0};
  else if (s[0] === "(")  return {args: s.slice(1, -1).split(", "), arity: s.split(",").length};
  else return {args: [s], arity: 1};
}


// decompose annotation (ref 1)
// internal
// String -> String

const decomposeAnno = s => {
  const type = parseAnno(s);

  switch (type) {
    case "Array":
    case "Tuple":
    case "Dict": return s.slice(1, -1);
    case "Record": return s.slice(1, -1).replace(/[a-z]+: /gi, "");
    case "Cons": return s.slice(s.indexOf("(") + 1, -1);
    case "Function":
    case "Poly":
    case "Mono": return "";

    default: throw new TypeSysError(
      `decomposeAnno received unknown type\n\n${type}\n`
    );
  }
};


// define contract (ref 1)
// internal
// String -> ? -> ?

const defineContract = s => {
  const type = parseAnno(s);

  switch (type) {
    case "Mono": {
      if (s in monoMap) return monoMap[s];

      else throw new TypeSysError(
        `defineContract received unknown monomorphic type\n\n${s}\n`
      );
    }

    case "Poly": return anyC(s);

    case "Function": return splitFunA(s).map(s_ => {
      const {args, arity} = deconsArgA(s_);
      return arityC(arity) (...args.map(anno => defineContract(anno)));
    });

    case "Array": return arrOfC;
    case "Tuple": return tupOfC;
    case "Dict": return dictOfC;
    case "Record": return recOfC;
    case "Cons": return consOfC;

    default: throw new TypeSysError(
      `defineContract received unknown type\n\n${type}\n`
    );
  }
};


// bind type variables (rev 1)
// internal
// (String, String, [String], Array, {String}, {String}, PositiveInteger) -> {String}

const bindTypeVars = (fname, type, ss, args, bindings, acc, nf) => ss.reduce((acc, s, narg) => {
  if (isPolyA(s)) {
    if (s in acc) {
      if (acc[s] !== introspect(args[narg])) throw new TypeError(
        `${fname} expects bounded type variable\n\n${s}\n\nto be of type\n\n${acc[s]}\n\nfor all occurances in\n\n${type}\n${ulAtArg(type, nf, narg)}\n\nbut attempted to bind ${introspect(args[narg])}\n`
      );

      else return acc;
    }

    else return acc[s] = introspect(args[narg]), acc;
  }
  
  else if (isCompoTypeA(s)) return bindTypeVars(fname, type, splitAnnoEnum(decomposeAnno(s)), args[narg], acc, nf);
  else return acc;
}, Object.assign({}, bindings));


// --[ ARITY CONTRACTS ]-------------------------------------------------------


// arity contract (rev 1)
// internal
// Number -> (...a -> a) -> Array -> Array

const arityC = n => (...cs) => {
  const arityC2 = args => {
    if (isFinite(n)) {
      if (args.length !== n) throw new Error(JSON.stringify({type: "arity", nominal: n, real: args.length}));
    }

    args.forEach((x, m) => {
      try {isFinite(n) ? cs[m] (x) : cs[0] (x)}

      catch (e) {
        const o = JSON.parse(e.message);
        let e_;

        o.idx = m;
        e_ = new Error(JSON.stringify(o));
        e_.stack = e.stack;
        throw e_;
      }
    });

    return args;
  };

  arityC2.toString = () => cs.join(", ");
  return arityC2;
};


// nullary see @ section XX. DERIVED


// unary see @ section XX. DERIVED


// binary see @ section XX. DERIVED


// ternary see @ section XX. DERIVED


// _4ary see @ section XX. DERIVED


// _5ary see @ section XX. DERIVED


// variadic see @ section XX. DERIVED


// --[ MONOMORPHIC CONTRACTS ]-------------------------------------------------


// boolean contract (rev 1)
// internal
// Boolean -> Boolean

const booC = x => {
  if (isBoo(x)) return x;
  throw new Error(JSON.stringify({type: "type", nominal: "Boolean", real: introspect(x)}));
};

booC.toString = () => "Boolean";


// null contract (rev 1)
// internal
// Null -> Null

const nullC = x => {
  if (isNull(x)) return x;
  throw new Error(JSON.stringify({type: "type", nominal: "Null", real: introspect(x)}));
};

nullC.toString = () => "Null";


// number contract (rev 1)
// internal
// Number -> Number

const numC = x => {
  if (isNum(x)) return x;
  throw new Error(JSON.stringify({type: "type", nominal: "Number", real: introspect(x)}));
};

numC.toString = () => "Number";


// string contract (rev 1)
// internal
// String -> String

const strC = x => {
  if (isStr(x)) return x;
  throw new Error(JSON.stringify({type: "type", nominal: "String", real: introspect(x)}));
};

strC.toString = () => "String";


// symbol contract (rev 1)
// internal
// Symbol -> Symbol

const symC = x => {
  if (isSym(x)) return x;
  throw new Error(JSON.stringify({type: "type", nominal: "Symbol", real: introspect(x)}));
};

symC.toString = () => "Symbol";


// --[ POLYMORPHIC CONTRACTS ]-------------------------------------------------


// any contract (rev 1)
// internal
// Char -> a -> a

const anyC = c => {
  const anyC2 = x => x;

  anyC2.toString = () => c;
  return anyC2;
};


// array contract (rev 1)
// internal
// Array -> Array

const arrC = xs => {
  if (isArr(xs)) return xs;
  throw new Error(JSON.stringify({type: "type", nominal: "Array", real: introspect(s)}));
};

arrC.toString = () => "Array";


// array of contract (rev 1)
// internal
// (a -> a) -> [a] -> [a]

const arrOfC = c => {
  const arrOfC2 = xs => {
    if (!isArr(xs)) throw new Error(
      JSON.stringify({type: "type", nominal: type, real: introspect(xs)})
    );

    if ($type in xs) {
      if (xs[$type] === type) return xs;
      else throw new Error(JSON.stringify({type: "type", nominal: type, real: xs[$type]}));
    }

    xs.forEach((x, n) => {
      try {c(x)}

      catch (e) {
        const o = JSON.parse(e.message);
        let e_;

        o.nominal = type;
        o.idx = n;
        e_ = new Error(JSON.stringify(o));
        e_.stack = e.stack;
        throw e_;
      }
    });

    return xs;
  };

  const type = `[${c}]`;

  return arrOfC2.toString = () => type, arrOfC2;
};

arrOfC.toString = () => "[a]";


// tuple contract (rev 1)
// internal
// Array -> Array

const tupC = arrC;

tupC.toString = () => "Tuple";


// tuple of contract (rev 1)
// internal
// [? -> ?] -> Array -> Array

const tupOfC = cs => {
  const tupOfC2 = xs => {
    if (!isArr(xs)) throw new Error(
      JSON.stringify({type: "type", nominal: type, real: introspect(xs)})
    );

    if (cs.length !== xs.length) throw new Error(
      JSON.stringify({type: "length", nominal: cs.length, real: xs.length})
    );

    if ($type in xs) {
      if (xs[$type] === type) return xs;
      else throw new Error(JSON.stringify({type: "type", nominal: type, real: xs[$type]}));
    }

    cs.forEach((c, n) => {
      try {c(xs[n])}

      catch (e) {
        const o = JSON.parse(e.message);
        let e_;

        o.nominal = type;
        o.idx = n;
        e_ = new Error(JSON.stringify(o));
        e_.stack = e.stack;
        throw e_;
      }
    });

    return xs;
  };

  const type = `(${cs.map(c => c.toString()).join(", ")})`;
  return tupOfC2.toString = () => type, tupOfC2;
};

tupOfC.toString = () => "Tuple";


// const dictC


// const dictOfC


// const recC


// const recOfC


// const consC


// const consOfC


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


// const isCons


// const isConsOf


// const isDict


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

const isNum = x => typeof x === "number" && !isNaN(x);


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


// const isRec


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


// const isTup


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


// --[ SUBCLASSING ]-----------------------------------------------------------


// Arity Error (rev 1)
// internal
// String -> ArityError

class ArityError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ArityError);
  }
};


// Length Error (rev 1)
// internal
// String -> LengthError

class LengthError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, LengthError);
  }
};


// Return Type Error (rev 1)
// internal
// String -> ReturnTypeError

class ReturnTypeError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ReturnTypeError);
  }
};


// Type System Error (rev 1)
// internal
// String -> TypeSysError

class TypeSysError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, TypeSysError);
  }
};


// --[ THROWING ]--------------------------------------------------------------


// throw (rev 1)
// (String -> Error) -> String -> IO

const _throw = cons => s => {throw new cons(s)};


/******************************************************************************
*******************************************************************************
*****************************[ 4. PRODUCT TYPES ]******************************
*******************************************************************************
******************************************************************************/


// --[ PRODUCT TYPE VIRTUALIZATION ]-------------------------------------------


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


// nullary (rev 1)
// internal
// [a] -> {status: String -> Error}

const nullary = arityC(0);


// unary (rev 1)
// internal
// (...? -> ?) -> [a] -> {status: String -> Error}

const unary = arityC(1);


// binary (rev 1)
// internal
// (...? -> ?) -> [a, b] -> {status: String -> Error}

const binary = arityC(2);


// ternary (rev 1)
// internal
// (...? -> ?) -> [a, b, c] -> {status: String -> Error}

const ternary = arityC(3);


// 4-ary (rev 1)
// internal
// (...? -> ?) -> [a, b, c, d] -> {status: String -> Error}

const _4ary = arityC(4);


// 5-ary (rev 1)
// internal
// (...? -> ?) -> [a, b, c, d, e] -> {status: String -> Error}

const _5ary = arityC(5);


// variadic (rev 1)
// internal
// (...? -> ?) -> [a, b, c] -> {status: String -> Error}

const variadic = arityC(Infinity);


// --[ AUXILLIARY HELPER ]-----------------------------------------------------


// mono map (rev 1)
// internal
// {? -> ?}

const monoMap = {
  Boolean: booC,
  Null: nullC,
  Number: numC,
  String: strC,
  Symbol: symC,
};


// --[ REFLECTION ]------------------------------------------------------------


// is object (rev 1)
// a -> Boolean

const isObj = isRef;


// API


// now public API yet...

module.exports = {};