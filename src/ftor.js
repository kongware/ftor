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


// annotation (rev 1)
// internal

const $anno = Symbol.for(SYM_PREFIX + "type");


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

const Fun = (typeSig, f) => {
  if (TYPE_CHECK) {
    if (!isStr(typeSig)) throw new TypeSysError(
      `Fun expects\n\n(String, Function) -> Function\n${ul(1, 6)}\n\n${introspect(typeSig)} received\n`
    );

    if (!isFun(f)) throw new TypeSysError(
      `Fun expects\n\n(String, Function) -> Function\n${ul(9, 8)}\n\n${introspect(typeSig)} received\n`
    );
    
    const [fname, funA] = parseTypeSig(typeSig),
     type = parseAnno(funA);

    if (type !== "Fun") throw new TypeSysError(
      `Fun expects a functional type annotation\n\n${funA}\n\ninterpreted as ${type} received\n`
    );

    const g = new Proxy(f, handleFun(fname, 0, funA, splitFunAnno(funA), {}));
    g.toString = Function.prototype.toString.bind(f);
    return g;
  }

  return f;
};


// handle function (rev 1)
// internal
// handle apply trap for virtualized function
// (String, PositiveInteger, String, [String], {Strings}) -> Function

const handleFun = (fname, nf, funA, [argA, ...argAs], bindings) => {
  return {
    apply: (f, _, args) => {
      const {annos, arity} = parseArgAnno(argA);
      if (nf === 0) bindings = {};
      try {arityC(arity) (annos.map(anno => defineContract(parseAnno(anno), anno, bindings))) (args)}

      catch (e) {
        if (TypeSysError.prototype.isPrototypeOf(e)) throw e;
        const o = JSON.parse(e.message);
        let e_;

        switch (o.type) {
          case "n-ary": {
            e_ = new ArityError(
              `${fname} expects ${numIndex[o.nominal]} argument(s)\n\n${funA}\n${ulAtCall(funA, nf)}\n\n${numIndex[o.real]} argument(s) received\n`
            );

            break;
          }

          case "variadic": {
            e_ = new ArityError(
              `${fname} expects at least ${numIndex[o.nominal]} argument(s)\n\n${funA}\n${ulAtCall(funA, nf)}\n\n${numIndex[o.real]} argument(s) received\n`
            );

            break;
          }

          case "type": {
            e_ = new TypeError(
              `${fname} expects\n\n${funA}\n${ulAtArgOff(o.offL, o.offR) (funA, nf, o.pos)}\n\n${o.real} received\n`
            );

            break;
          }

          case "binding": {
            e_ = new TypeError(
              `${fname} expects bounded type variable "${o.name}" to be of type\n\n${o.nominal}\n\nfor all occurrences in\n\n${funA}\n${ulAtArgOff(o.offL, o.offR) (funA, nf, o.pos)}\n\n${o.real} received\n`
            );

            break;
          }

          default: throw new TypeSysError(
            `handleFun received invalid error type\n\n${o.type}\n\nat argument validation`
          );
        }

        e_.stack = e.stack;
        throw e_;
      }

      if (argAs.length === 1) {
        const r = f(...args),
         c = defineContract(parseAnno(argAs[0]), argAs[0], bindings);

        try {c(r)}

        catch (e) {
          if (TypeSysError.prototype.isPrototypeOf(e)) throw e;
          const o = JSON.parse(e.message);
          let e_;

          switch (o.type) {
            case "type": {
              if (!("offL" in o)) o.offL = 0, o.offR = 0;
              
              e_ = new ReturnTypeError(
                `${fname} must return\n\n${funA}\n${ulAtCallOff(o.offL, o.offR) (funA, nf + 1)}\n\n${o.real} returned\n`
              );

              break;
            }

            case "binding": {
              if (!("offL" in o)) o.offL = 0, o.offR = 0;

              e_ = new ReturnTypeError(
              `${fname} expects bounded type variable "${o.name}" to be of type\n\n${o.nominal}\n\nfor all occurrences in\n\n${funA}\n${ulAtCallOff(o.offL, o.offR) (funA, nf + 1)}\n\n${o.real} received\n`
              );

              break;
            }

            default: throw new TypeSysError(
              `handleFun received invalid error type\n\n${o.type}\n\nat return value validation\n`
            );
          }

          e_.stack = e.stack;
          throw e_;
        }

        return r;
      }

      const r = new Proxy(f(...args), handleFun(fname, nf + 1, funA, argAs, bindings));

      r.toString = Function.prototype.toString.bind(f);
      return r;
    },

    has: (o, k, _) => {
      switch (k) {
        case $anno: return true;
        default: return k in o;
      }
    },

    get: (o, k, _) => {
      switch (k) {
        case $anno: return funA;
        case "bindings": return bindings;
        case "name": return fname;
        case Symbol.toPrimitive: return o[k];
        case "toString": return o[k];
        
        default: {
          if (!(k in o)) throw new TypeError(
            `${fname} received an invalid get operation for\n\n${k}\n\nunknown property\n`
          );

          return o[k];
        };
      }
    },

    set: (o, k, v, _) => {
      switch (k) {
        case "toString": return o[k] = v, true;
        case "bindings": return bindings = v, true;

        default: {
          throw new TypeError(
            `${fname} received an invalid set operation for\n\n${k}\n\nwith the value\n\n${v}\n\nfunction objects are immutable`
          );
        }
      }
    }
  };
};


// --[ AUXILLIARY HELPER ]-----------------------------------------------------


// arity index (rev 1)
// internal
// {{f: ? -> ?, s: String}}

const arityIdx = ["nullary", "unary", "binary", "ternary", "4-ary", "5-ary"];


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


// underline at call with offset (rev 1)
// internal
// (String, PositiveInteger, Integer, Integer) -> String

const ulAtCallOff = (offL, offR) => (s, n) => splitFunAnno(s).reduce((acc, t, n_) => {
  if (n_ < n) return acc + ul(t.length + 4, 0);

  else if (n_ === n) {
    if (t[0] === "(") return acc + ul(1 + offL, t.length - 1 + offR - offL);
    else return acc + ul(0 + offL, t.length + offR - offL);
  }
  
  else return acc;
}, "");


// underline at call (rev 1)
// internal
// (String, PositiveInteger) -> String

const ulAtCall = ulAtCallOff(0, 0);


// underline at argument with offset (rev 1)
// internal
// (String, PositiveInteger, PositiveInteger, Integer, Integer) -> String

const ulAtArgOff = (offL, offR) => (s, n, m) => splitFunAnno(s).reduce((acc, t, n_) => {
  if (n_ < n) return acc + ul(t.length + 4, 0);
  
  else if (n_ === n) return t.split(", ").reduce((acc_, t_, m_) => {
    if (m_ < m) return acc_ + ul(t_.length + 2, 0);

    else if (m_ === m) {
      if (t_[0] === "(") return acc_ + ul(1 + offL, t_.length - 1 + offR - offL);
      else if (t_[t_.length - 1] === ")") return acc_ + ul(0 + offL, t_.length - 1 + offR - offL);
      else return acc_ + ul(0 + offL, t_.length + offR - offL);
    }
    
    else return acc_;
  }, acc);
  
  else return acc;
}, "");


// underline at argument (rev 1)
// internal
// (String, PositiveInteger, PositiveInteger) -> String

const ulAtArg = ulAtArgOff(0, 0);


// --[ PARSING / BINDING ]-----------------------------------------------------


// parse annotation (rev 1)
// internal
// String -> String

const parseAnno = s => {
  const aux = (n, stack, cache, type) => {
    const c = s[n],
     end = n === s.length - 1,
     prev = n === 0 ? "" : s[n - 1],
     next = end ? "" : s[n + 1],
     stackLen = stack.length,
     stackLast = stackLen === 0 ? "" : stack[stackLen - 1];

    if (c === undefined) {
      if (stackLen > 0) throw new TypeSysError(
        `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\n"${stackLast}" bracket missing\n`
      );

      if (type === "") throw new TypeSysError(
        `parseAnno received the unknown type annotation\n\n${s}\n`
      );

      return type;
    }

    else if (isLetter(c)) {
      if (!isLetter(prev)) {
        if (!isLetter(next)) {
          if (isLC(c)) {
            if (next === "(") throw new TypeSysError(
              `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nconstructor name expected\n`
            );

            if (n === 0) type = "Poly";
          }

          else if (n === 0) type = "Mono";
        }

        else {
          if (isLC(c)) throw new TypeSysError(
            `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\n"${c.toUpperCase()}" expected\n`
          );

          if (prev !== "" && prev !== " " && prev !== "." && !(prev in openBrackets)) throw new TypeSysError(
            `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal letter\n`
          );

          if (n === 0) type = "Mono";
        }
      }
    }

    else if (c in openBrackets) {
      if (c === "(") {
        if (prev !== "" && prev !== " " && !(prev in openBrackets) && !isLetter(prev)) throw new TypeSysError(
          `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal bracket\n`
        );
      }

      else {
        if (prev !== "" && prev !== " " && !(prev in openBrackets)) throw new TypeSysError(
          `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal bracket\n`
        );
      }

      if (stackLen === 0) {
        if (c === "[" && type !== "Fun") type = "Arr"
        else if (c === "{" && type !== "Fun") type = "Dict"

        else if (c === "(" && type !== "Fun") {
          if (isLetter(prev)) type = "Cons";
          else type = "MultiArg";
        }
      }

      return aux(n + 1, stack.concat(openBrackets[c]), cache, type);
    }

    else if (c in closedBrackets) {
      if (stackLen === 0) throw new TypeSysError(
        `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nunexpected "${c}" bracket\n`
      );

      else if (stackLen === 1 && stackLast === ")" && cache.arg !== "") {
        type = cache.arg;
        cache.arg = "";
      }

      if (c !== stackLast) throw new TypeSysError(
        `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\n"${stackLast}" bracket expected\n`
      );

      if (!isLetter(prev) && !(prev in closedBrackets)) throw new TypeSysError(
        `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal bracket\n`
      );

      return aux(n + 1, stack.slice(0, -1), cache, type);
    }

    else if (c === ",") {
      if (stackLen === 0) throw new TypeSysError(
        `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal annotation enumeration\n`
      );

      if (prev.search(/[a-z\]})]/i) === -1) throw new TypeSysError(
        `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal ","\n`
      );

      if (stackLen === 1) {
        if (stackLast === ")") cache.arg = "MultiArg";
        else if (stackLast === "]" && type !== "Fun") type = "Tup";
      }
    }

    else if (c === " ") {
      if (stackLast === ")") {
        if (prev === c) throw new TypeSysError(
          `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal " "\n`
        );
      }

      else {
        if (prev !== "," && prev !== ">" && prev !== ":" && next !== "-") throw new TypeSysError(
          `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal " "\n`
        );
      }

      if ((prev === ">" && next === "-")
        || (prev === "," && next === ",")
        || (prev === ":" && next === ":")
        || (prev === "," && next === ":")
        || (prev === ":" && next === ",")) throw new TypeSysError(
        `parseAnno received an invalid type annotation\n\n${s}\n${ul(n - 1, 3)}\n\nillegal char sequence\n`
      );
    }

    else if (c === "-") {
      if (prev !== " ") throw new TypeSysError(
        `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nmissing " "\n`
      );

      if (next !== ">") throw new TypeSysError(
        `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal char\n`
      );
    }

    else if (c === ">") {
      if (prev !== "-") throw new TypeSysError(
        `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal char\n`
      );

      if (next !== " ") throw new TypeSysError(
        `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nmissig " "\n`
      );

      if (stackLen === 0) type = "Fun";

      else if (stackLen === 1) {
        if (stackLast === ")" && cache.arg === "") cache.arg = "FunArg";
      }
    }

    else if (c === ":") {
      if (stackLen === 0 || stackLast !== "}")  throw new TypeSysError(
        `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal char\n`
      );

      if (!isLetter(prev)) throw new TypeSysError(
        `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nillegal char\n`
      );

      if (next !== " ") throw new TypeSysError(
        `parseAnno received an invalid type annotation\n\n${s}\n${ul(n, 1)}\n\nmissing " "\n`
      );

      if (stackLen === 1 && stackLast === "}" && type !== "Fun") type = "Rec";
    }

    else if (c === ".") {
      cache.dots += c;

      if (cache.dots === ".") {
        if (!(prev === "" || prev === " ")) throw new TypeSysError(
          `parseAnno received an invalid type annotation\n\n${s}\n${ul(n - 1, 1)}\n\nillegal char\n`
        );
      }

      else if (cache.dots === "..") {
        if (next !== ".") throw new TypeSysError(
          `parseAnno received an invalid type annotation\n\n${s}\n${ul(n - 1, 2)}\n\nmissing "."\n`
        );
      }

      else if (cache.dots === "...") {
        if (!isLetter(next)) throw new TypeSysError(
          `parseAnno received an invalid type annotation\n\n${s}\n${ul(n - 2, 3)}\n\nillegal variadic notation\n`
        );

        else cache.dots = "";
      }
    }

    return aux(n + 1, stack, cache, type);
  };

  return aux(0, [], {dots: "", arg: ""}, "");
};


// is array annotation (rev 1)
// internal
// String -> Boolean

const isArrA = s => parseAnno(s) === "Arr";


// is tuple annotation (rev 1)
// internal
// String -> Boolean

const isTupA = s => parseAnno(s) === "Tup";


// is dictionary annotation (rev 1)
// internal
// String -> Boolean

const isDictA = s => parseAnno(s) === "Dict";


// is record annotation (rev 1)
// internal
// String -> Boolean

const isRecA = s => parseAnno(s) === "Rec";


// is constrcutor annotation (rev 1)
// internal
// String -> Boolean

const isConsA = s => parseAnno(s) === "Cons";


// is function annotation (rev 1)
// internal
// String -> Boolean

const isFunA = s => parseAnno(s) === "Fun";


// is function argument annotation (rev 1)
// internal
// String -> Boolean

const isFunArgA = s => parseAnno(s) === "FunArg";


// is multi argument annotation (rev 1)
// internal
// String -> Boolean

const isMultiArgA = s => parseAnno(s) === "MultiArg";


// is polymorphic annotation (rev 1)
// internal
// Char -> Boolean

const isPolyA = c => c.search(/^(?:...)?[a-z]$/) !== -1;


// is monomorphic annotation (rev 1)
// internal
// String -> Boolean

const isMonoA = s => s.search(/^(?:...)?[A-Z][a-z]*$/) !== -1;


// is composite type (rev 1)
// internal
// String -> Boolean

const isCompositeT = type => !(type === "Poly" || type === "Mono" || type === "Fun");


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


// decompose annotation (rev 1)
// internal
// (String, String) -> String

const decomposeAnno = (anno, type) => {
  switch (type) {
    case "Arr": return decompArrAnno(anno);
    case "Tup": return decompTupAnno(anno);
    case "Dict": return decompDictAnno(anno);
    case "FunArg": return decompFunArgAnno(anno);
    case "MultiArg": return decompMultiArgAnno(anno);
    case "Rec": return decompRecAnno(anno);
    case "Cons": return decompConsAnno(anno);
    case "Fun":
    case "Poly":
    case "Mono": return anno;

    default: throw new TypeSysError(
      `decomposeAnno received the unknown anno\n\n${anno}\n\ninterpreted as ${type}\n`
    );
  }
};


// decompose array annotation (rev 1)
// internal
// String -> String

const decompArrAnno = s => s.slice(1, -1);


// decompose tuple annotation (rev 1)
// internal
// String -> String

const decompTupAnno = s => s.slice(1, -1);


// decompose dict annotation (rev 1)
// internal
// String -> String

const decompDictAnno = s => s.slice(1, -1);


// decompose funcation argument annotation (rev 1)
// internal
// String -> String

const decompFunArgAnno = s => s.slice(1, -1);


// decompose multi argument annotation (rev 1)
// internal
// String -> String

const decompMultiArgAnno = s => s.slice(1, -1);


// decompose record annotation (rev 1)
// internal
// String -> String

const decompRecAnno = s => s.slice(1, -1).replace(/[a-z]+: /gi, "");


// decompose constructor annotation (rev 1)
// internal
// String -> String

const decompConsAnno = s => s.slice(s.indexOf("(") + 1, -1);


// split annotation enumeration (rev 1)
// internal
// String -> [String]

const splitAnnoEnum = anno => {
  const aux = (n, acc, stack) => {
    const c = anno[n],
     prev = n === 0 ? "" : anno[n - 1],
     next = n === anno.length - 1 ? "" : anno[n + 1];

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


// split function annotation (rev 1)
// internal
// String -> [String]

const splitFunAnno = anno => {
  const aux = (n, acc, stack) => {
    const c = anno[n],
     next = n === anno.length - 1 ? "" : anno[n + 1];

    if (c === undefined) {
      if (acc.length < 2) throw new TypeSysError(
        `splitFunAnno received a non-functional type annotation\n\n${type}\n`
      );

      else return acc;
    }

    else if (c === " " && next === "-") {
      if (stack.length === 0) return aux(n + 4, acc.concat(""), stack);
      else acc[acc.length - 1] += c;
    }
    
    else acc[acc.length - 1] += c;

    if (c in openBrackets) return aux(n + 1, acc, stack.concat(c));
    else if (c === openBrackets[stack[stack.length - 1]]) return aux(n + 1, acc, stack.slice(0, -1));
    else return aux(n + 1, acc, stack);
  };

  return aux(0, [""], []);
};


// parse argument annotation (rev 1)
// internal
// String -> {annos: [String], arity: PositiveNumber}

const parseArgAnno = argA => {
  const type = parseAnno(argA);
  let annos;

  switch (type) {
    case "FunArg": annos = [decompFunArgAnno(argA)]; break;
    case "MultiArg": annos = splitAnnoEnum(decompMultiArgAnno(argA)); break;
    default: annos = [argA];
  }

  return annos.reduce((acc, anno, n, ref) => {
    if (n === ref.length - 1) {
      if (anno.indexOf("...") === 0) return {annos: acc.annos.concat(anno.slice(3)), arity: Infinity};
      else return {annos: acc.annos.concat(anno), arity: ref.length};
    }

    else if (anno.indexOf("...") === 0) throw new TypeSysError(
      `parseArgAnno received the invalid argument annotation\n\n${s}\n${ul(0, 3)}\n\nunexpected variadic notation`
    );

    else return acc.annos.push(anno), acc;
  }, {annos: [], arity: null});
};


// define contract (rev 1)
// internal
// (String, String, {String}) -> Function

const defineContract = (type, anno, bindings) => {
  switch (type) {
    case "Mono": {
      if (anno in monoMap) return monoMap[anno];

      else throw new TypeSysError(
        `defineContract received the unknown monomorphic type\n\n${anno}\n`
      );
    }

    case "Poly": return anyC(bindings) (anno);
    case "Fun": return funC;
    case "Arr": return A(anno_ => arrOfC(defineContract(parseAnno(anno_), anno_, bindings))) (decompArrAnno(anno));
    //case "Tup": return tupOfC;
    //case "Dict": return dictOfC;
    //case "Rec": return recOfC;
    //case "Cons": return consOfC;

    default: throw new TypeSysError(
      `defineContract received the unknown type\n\n${type}\n`
    );
  }
};


// --[ ARITY CONTRACTS ]-------------------------------------------------------


// arity contract (rev 1)
// internal
// TODO: uncurry
// Number -> [a -> a] -> Array -> Array

const arityC = n => cs => {
  const arityC2 = args => {
    if (isFinite_) {
      if (args.length !== n) throw new Error(JSON.stringify({type: "n-ary", nominal: n, real: args.length}));
    }

    else if (cs.length > 1 && args.length < cs.length - 1) {
      throw new Error(JSON.stringify({type: "variadic", nominal: cs.length - 1, real: args.length}));
    }

    args.forEach((x, m) => {
      try {m < cs.length ? cs[m] (x) : cs[cs.length - 1] (x)}

      catch (e) {
        if (TypeSysError.prototype.isPrototypeOf(e)) throw e;
        const o = JSON.parse(e.message);
        let e_;

        if (isFinite_) o.pos = m;
        
        else {
          if (cs.length > 1) {
            if (m < cs.length - 1) o.pos = m;
            else o.pos = cs.length - 1;
          }
        
          else o.pos = 0;
        }
        
        if (!("offL" in o)) o.offL = 0;
        if (!("offR" in o)) o.offR = 0;
        e_ = new Error(JSON.stringify(o));
        e_.stack = e.stack;
        throw e_;
      }
    });

    return args;
  };

  const isFinite_ = isFinite(n);
  
  arityC2.toString = () => {
    if (isFinite_) {
      if (cs.length === 0) return`()`;
      else if (cs.length === 1) return `${cs[0]}`;
      else return`(${cs.join(", ")})`;
    }

    else {
      if (cs.length === 1) return `...${cs[0]}`;
      else return `(${cs.slice(0, -1).join(", ")}, ...${cs[cs.length - 1]})`;
    }
  };

  return arityC2;
};


// nullaryC see @ section XX. DERIVED


// unaryC see @ section XX. DERIVED


// binaryC see @ section XX. DERIVED


// ternaryC see @ section XX. DERIVED


// _4aryC see @ section XX. DERIVED


// _5aryC see @ section XX. DERIVED


// variadicC see @ section XX. DERIVED


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
// {String} -> Char -> a -> a

const anyC = bindings => {
  const anyC2 = name => {
    const anyC3 = x => {
      const anno = introspect(x);

      if (name in bindings) {
        if (bindings[name] !== anno) throw new Error(
          JSON.stringify({type: "binding", nominal: bindings[name], real: anno, name: name})
        );

        else return x;
      }

      else return bindings[name] = anno, x;
    };

    anyC3.toString = () => name;
    return anyC3;
  };

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

    if ($anno in xs) {
      if (xs[$anno] === type) return xs;
      else throw new Error(JSON.stringify({type: "type", nominal: type, real: xs[$anno]}));
    }

    xs.forEach((x, n) => {
      try {c(x)}

      catch (e) {
        if (TypeSysError.prototype.isPrototypeOf(e)) throw e;
        const o = JSON.parse(e.message);
        let e_;
        o.offL = "offL" in o ? o.offL + 1 : 1;
        o.offR = "offR" in o ? o.offR - 1 : -1;
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

    if ($anno in xs) {
      if (xs[$anno] === type) return xs;
      else throw new Error(JSON.stringify({type: "type", nominal: type, real: xs[$anno]}));
    }

    cs.forEach((c, n) => {
      try {c(xs[n])}

      catch (e) {
        if (TypeSysError.prototype.isPrototypeOf(e)) throw e;
        const o = JSON.parse(e.message);
        let e_;
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


const funC = x => {
  if (!isFun(x)) throw new Error(
    JSON.stringify({type: "type", nominal: "Function", real: introspect(x)})
  );

  else if (!($anno in x)) throw new TypeSysError(
    `funC received the untyped function\n\n${x.name}\n`
  );

  else return x;
};

funC.toString = () => "Function";


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
// TODO: add subtypes
// TODO: add abstract data types
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
      else if ($anno in x) return x[$anno];

      else if (Array.isArray(x)) {
        if (x.length <= 8) {
          const annos = x.map(x_ => `${introspect(x_)}`);
          return `[${Array.from(annos.reduce((acc, x_) => acc.add(x_), new Set())).join(", ")}]`;
        }

        else return `[${introspect(x[0])}]`;
      }

      else {
        if ("constructor" in x && x.constructor.name !== "Object") return x.constructor.name;

        else {
          const tag = getStringTag(x);
          if (tag !== "Object") return tag;

          else {
            const ks = Object.keys(x);

            if (ks.length <= 8) {
              const rec = ks.map(k => `${k}: ${introspect(x[k])}`),
               dict = `{${introspect(x[ks[0]])}}`,
               annos = Array.from(rec.reduce((acc, x_) => acc.add(x_.split(": ") [1]), new Set()));

              if (annos.length === 1) return dict;
              else return `{${rec.join(", ")}}`;
            }

            else return `{${introspect(x[k[0]])}}`;
          }
        }
      }
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

/*const handleProd = type => ({
  get: (o, k, _) => {
    switch (k) {
      case $anno: return type;
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
});*/


/******************************************************************************
********************************[ 4.1. TUPLE ]*********************************
******************************************************************************/


// Tuple (rev 0.1)
// ([? -> ?], Array) -> Array

/*const Tup = (cs, xs) => {
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

Tup.from = (cs, iter) => Tup(cs, Array.from(iter));*/


/******************************************************************************
********************************[ 4.2. RECORD ]********************************
******************************************************************************/


/******************************************************************************
********************************[ 4.3. ARRAY ]*********************************
******************************************************************************/


// --[ CONSTRUCTOR ]-----------------------------------------------------------


// Array (rev 0.1)
// ((a -> a), [a]) -> [a]

/*const Arr = (c, xs) => {
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

Arr.from = (c, iter) => Arr(c, Array.from(iter));*/


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


/*const Tcons = (name, o) => {
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
});*/


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


// applicator (rev 0.1)
// (a -> b) -> a -> b

const A = f => x => f(x);


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


// nullary contract (rev 1)
// internal
// [a] -> {status: String -> Error}

const nullaryC = arityC(0);


// unary contract (rev 1)
// internal
// (...? -> ?) -> [a] -> {status: String -> Error}

const unaryC = arityC(1);


// binary contract (rev 1)
// internal
// (...? -> ?) -> [a, b] -> {status: String -> Error}

const binaryC = arityC(2);


// ternary contract (rev 1)
// internal
// (...? -> ?) -> [a, b, c] -> {status: String -> Error}

const ternaryC = arityC(3);


// 4-ary contract (rev 1)
// internal
// (...? -> ?) -> [a, b, c, d] -> {status: String -> Error}

const _4aryC = arityC(4);


// 5-ary contract (rev 1)
// internal
// (...? -> ?) -> [a, b, c, d, e] -> {status: String -> Error}

const _5aryC = arityC(5);


// variadic contract (rev 1)
// internal
// (...? -> ?) -> [a, b, c] -> {status: String -> Error}

const variadicC = arityC(Infinity);


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

// module.exports = {};