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



// record min length (rev 1)
// internal
// PositiveInteger

const REC_MIN_LEN = 2;


// record max length (rev 1)
// internal
// PositiveInteger

const REC_MAX_LEN = 8;


// symbol prefix (rev 1)
// internal
// String

const SYM_PREFIX = "ftor/";


// tuple min length (rev 1)
// internal
// PositiveInteger

const TUP_MIN_LEN = 2;


// tuple max length (rev 1)
// internal
// PositiveInteger

const TUP_MAX_LEN = 8;


// type check (rev 1)
// internal
// Boolean

const TYPE_CHECK = true;


// --[ SYMBOLS ]---------------------------------------------------------------


// type (rev 1)
// internal

const $type = Symbol.for(SYM_PREFIX + "type");


/******************************************************************************
*******************************************************************************
*************************[ 2. RUN-TIME TYPE CHECKER ]**************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
********************************[ 2.1. TYPES ]*********************************
******************************************************************************/


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
    
    const [fname, funT] = parseTypeSig(typeSig),
     typeCat = catType(funT);

    if (typeCat !== "Fun") throw new TypeSysError(
      `Fun expects a function type\n\n${funT}\n\ninterpreted as ${typeCat} received\n`
    );

    const g = new Proxy(f, handleFun(fname, 0, funT, splitFunType(funT), {}));
    g.toString = Function.prototype.toString.bind(f);
    return g;
  }

  return f;
};


// handle function (rev 1)
// internal
// handle apply trap for virtualized function
// (String, PositiveInteger, String, [String], {Strings}) -> Function

const handleFun = (fname, nf, funT, [argT, ...argTs], bindings) => {
  return {
    apply: (f, _, args) => {
      const {types, arity} = parseArgType(argT);
      if (nf === 0) bindings = {};

      types.forEach((type, n) => {
        if (isFunT(type)) unifyTypeVars(fname, nf, n, funT, splitFunType(type), splitFunType(args[n] [$type]), bindings);
      });

      try {arityC(arity) (types.map(type => defineContract(catType(type), type, bindings))) (args)}

      catch (e) {
        if (TypeSysError.prototype.isPrototypeOf(e)) throw e;
        const o = JSON.parse(e.message);
        let e_;

        switch (o.type) {
          case "n-ary": {
            e_ = new ArityError(
              `${fname} expects ${numIndex[o.nominal]} argument(s)\n\n${funT}\n${ulAtCall(funT, nf)}\n\n${numIndex[o.real]} argument(s) received\n`
            );

            break;
          }

          case "variadic": {
            e_ = new ArityError(
              `${fname} expects at least ${numIndex[o.nominal]} argument(s)\n\n${funT}\n${ulAtCall(funT, nf)}\n\n${numIndex[o.real]} argument(s) received\n`
            );

            break;
          }

          case "type": {
            e_ = new TypeError(
              `${fname} expects\n\n${funT}\n${ulAtArgOff(o.offL, o.offR) (funT, nf, o.pos)}\n\n${o.real} received\n`
            );

            break;
          }

          case "binding": {
            e_ = new TypeError(
              `${fname} expects bounded type variable "${o.name}" to be of type\n\n${o.nominal}\n\nfor all occurrences in\n\n${funT}\n${ulAtArgOff(o.offL, o.offR) (funT, nf, o.pos)}\n\n${o.real} received\n`
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

      if (argTs.length === 1) {
        const r = f(...args),
         c = defineContract(catType(argTs[0]), argTs[0], bindings);

        try {c(r)}

        catch (e) {
          if (TypeSysError.prototype.isPrototypeOf(e)) throw e;
          const o = JSON.parse(e.message);
          let e_;

          switch (o.type) {
            case "type": {
              if (!("offL" in o)) o.offL = 0, o.offR = 0;
              
              e_ = new ReturnTypeError(
                `${fname} must return\n\n${funT}\n${ulAtCallOff(o.offL, o.offR) (funT, nf + 1)}\n\n${o.real} returned\n`
              );

              break;
            }

            case "binding": {
              if (!("offL" in o)) o.offL = 0, o.offR = 0;

              e_ = new ReturnTypeError(
              `${fname} expects bounded type variable "${o.name}" to be of type\n\n${o.nominal}\n\nfor all occurrences in\n\n${funT}\n${ulAtCallOff(o.offL, o.offR) (funT, nf + 1)}\n\n${o.real} received\n`
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

      const r = new Proxy(f(...args), handleFun(fname, nf + 1, funT, argTs, bindings));

      r.toString = Function.prototype.toString.bind(f);
      return r;
    },

    has: (o, k, _) => {
      switch (k) {
        case $type: return true;
        default: return k in o;
      }
    },

    get: (o, k, _) => {
      switch (k) {
        case $type: return funT;
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
// (Integer, Integer) -> (String, PositiveInteger) -> String

const ulAtCallOff = (offL, offR) => (s, n) => splitFunType(s).reduce((acc, t, n_) => {
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
// (Integer, Integer) -> (String, PositiveInteger, PositiveInteger) -> String

const ulAtArgOff = (offL, offR) => (s, n, m) => splitFunType(s).reduce((acc, t, n_) => {
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


// --[ PARSING / BINDING / UNIFICATION]----------------------------------------


// categorize type (rev 1)
// internal
// String -> String

const catType = s => {
  const aux = (n, stack, cache, type) => {
    const c = s[n],
     end = n === s.length - 1,
     prev = n === 0 ? "" : s[n - 1],
     next = end ? "" : s[n + 1],
     stackLen = stack.length,
     stackLast = stackLen === 0 ? "" : stack[stackLen - 1];

    if (c === undefined) {
      if (stackLen > 0) throw new TypeSysError(
        `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\n"${stackLast}" bracket missing\n`
      );

      if (type === "") throw new TypeSysError(
        `catType received the unknown type\n\n${s}\n`
      );

      return type;
    }

    else if (isLetter(c)) {
      if (!isLetter(prev)) {
        if (!isLetter(next)) {
          if (isLC(c)) {
            if (next === "(") throw new TypeSysError(
              `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\nconstructor name expected\n`
            );

            if (n === 0) type = "Poly";
          }

          else if (n === 0) type = "Mono";
        }

        else {
          if (isLC(c)) throw new TypeSysError(
            `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\n"${c.toUpperCase()}" expected\n`
          );

          if (prev !== "" && prev !== " " && prev !== "." && !(prev in openBrackets)) throw new TypeSysError(
            `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\nillegal letter\n`
          );

          if (n === 0) type = "Mono";
        }
      }
    }

    else if (c in openBrackets) {
      if (c === "(") {
        if (prev !== "" && prev !== " " && !(prev in openBrackets) && !isLetter(prev)) throw new TypeSysError(
          `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\nillegal bracket\n`
        );
      }

      else {
        if (prev !== "" && prev !== " " && !(prev in openBrackets)) throw new TypeSysError(
          `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\nillegal bracket\n`
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
        `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\nunexpected "${c}" bracket\n`
      );

      else if (stackLen === 1 && stackLast === ")" && cache.arg !== "") {
        type = cache.arg;
        cache.arg = "";
      }

      if (c !== stackLast) throw new TypeSysError(
        `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\n"${stackLast}" bracket expected\n`
      );

      if (!isLetter(prev) && !(prev in closedBrackets)) throw new TypeSysError(
        `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\nillegal bracket\n`
      );

      return aux(n + 1, stack.slice(0, -1), cache, type);
    }

    else if (c === ",") {
      if (stackLen === 0) throw new TypeSysError(
        `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\nillegal type enumeration\n`
      );

      if (prev.search(/[a-z\]})]/i) === -1) throw new TypeSysError(
        `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\nillegal ","\n`
      );

      if (stackLen === 1) {
        if (stackLast === ")") cache.arg = "MultiArg";
        else if (stackLast === "]" && type !== "Fun") type = "Tup";
      }
    }

    else if (c === " ") {
      if (stackLast === ")") {
        if (prev === c) throw new TypeSysError(
          `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\nillegal " "\n`
        );
      }

      else {
        if (prev !== "," && prev !== ">" && prev !== ":" && next !== "-") throw new TypeSysError(
          `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\nillegal " "\n`
        );
      }

      if ((prev === ">" && next === "-")
        || (prev === "," && next === ",")
        || (prev === ":" && next === ":")
        || (prev === "," && next === ":")
        || (prev === ":" && next === ",")) throw new TypeSysError(
        `catType received an invalid type\n\n${s}\n${ul(n - 1, 3)}\n\nillegal char sequence\n`
      );
    }

    else if (c === "-") {
      if (prev !== " ") throw new TypeSysError(
        `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\nmissing " "\n`
      );

      if (next !== ">") throw new TypeSysError(
        `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\nillegal char\n`
      );
    }

    else if (c === ">") {
      if (prev !== "-") throw new TypeSysError(
        `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\nillegal char\n`
      );

      if (next !== " ") throw new TypeSysError(
        `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\nmissig " "\n`
      );

      if (stackLen === 0) type = "Fun";

      else if (stackLen === 1) {
        if (stackLast === ")" && cache.arg === "") cache.arg = "FunArg";
      }
    }

    else if (c === ":") {
      if (stackLen === 0 || stackLast !== "}")  throw new TypeSysError(
        `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\nillegal char\n`
      );

      if (!isLetter(prev)) throw new TypeSysError(
        `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\nillegal char\n`
      );

      if (next !== " ") throw new TypeSysError(
        `catType received an invalid type\n\n${s}\n${ul(n, 1)}\n\nmissing " "\n`
      );

      if (stackLen === 1 && stackLast === "}" && type !== "Fun") type = "Rec";
    }

    else if (c === ".") {
      cache.dots += c;

      if (cache.dots === ".") {
        if (!(prev === "" || prev === " ")) throw new TypeSysError(
          `catType received an invalid type\n\n${s}\n${ul(n - 1, 1)}\n\nillegal char\n`
        );
      }

      else if (cache.dots === "..") {
        if (next !== ".") throw new TypeSysError(
          `catType received an invalid type\n\n${s}\n${ul(n - 1, 2)}\n\nmissing "."\n`
        );
      }

      else if (cache.dots === "...") {
        if (!isLetter(next)) throw new TypeSysError(
          `catType received an invalid type\n\n${s}\n${ul(n - 2, 3)}\n\nillegal variadic notation\n`
        );

        else cache.dots = "";
      }
    }

    return aux(n + 1, stack, cache, type);
  };

  return aux(0, [], {dots: "", arg: ""}, "");
};


// is array type (rev 1)
// internal
// String -> Boolean

const isArrT = s => catType(s) === "Arr";


// is tuple type (rev 1)
// internal
// String -> Boolean

const isTupT = s => catType(s) === "Tup";


// is dictionary type (rev 1)
// internal
// String -> Boolean

const isDictT = s => catType(s) === "Dict";


// is record type (rev 1)
// internal
// String -> Boolean

const isRecT = s => catType(s) === "Rec";


// is constrcutor type (rev 1)
// internal
// String -> Boolean

const isConsT = s => catType(s) === "Cons";


// is function type (rev 1)
// internal
// String -> Boolean

const isFunT = s => catType(s) === "Fun";


// is function argument type (rev 1)
// internal
// String -> Boolean

const isFunArgT = s => catType(s) === "FunArg";


// is multi argument type (rev 1)
// internal
// String -> Boolean

const isMultiArgT = s => catType(s) === "MultiArg";


// is polymorphic type (rev 1)
// internal
// Char -> Boolean

const isPolyT = c => c.search(/^(?:...)?[a-z]$/) !== -1;


// is monomorphic type (rev 1)
// internal
// String -> Boolean

const isMonoT = s => s.search(/^(?:...)?[A-Z][a-z]*$/) !== -1;


// is composite type (rev 1)
// internal
// String -> Boolean

const isCompositeT = type => !(type === "Poly" || type === "Mono" || type === "Fun");


// parse type signature (rev 1)
// internal
// String -> [String]

const parseTypeSig = s => {
  if (!s.includes("::")) throw new TypeSysError(
    `parseTypeSig received an invalid type\n\n${s}\n${ul(0, 1)}\n\nname component "name :: " missing\n`
  );
  
  if (s.search(/^[a-z]+ :: [^ ]/i) === -1) throw new TypeSysError(
    `parseTypeSig received an invalid type\n\n${s}\n${ul(0, s.indexOf("::") + 2)}\n\ninvalid name component\n`
  );

  return s.split(" :: ");
};


// decompose type (rev 1)
// internal
// (String, String) -> String

const decomposeType = (type, typeCat) => {
  switch (typeCat) {
    case "Arr": return decompArraype(type);
    case "Tup": return decompTupType(type);
    case "Dict": return decompDictType(type);
    case "FunArg": return decompFunArgType(type);
    case "MultiArg": return decompMultiArgType(type);
    case "Rec": return decompRecType(type);
    case "Cons": return decompConsType(type);
    case "Fun":
    case "Poly":
    case "Mono": return type;

    default: throw new TypeSysError(
      `decomposeType received the unknown type\n\n${type}\n\ncategorized as ${typeCat}\n`
    );
  }
};


// decompose array type (rev 1)
// internal
// String -> String

const decompArraype = s => s.slice(1, -1);


// decompose tuple type (rev 1)
// internal
// String -> String

const decompTupType = s => s.slice(1, -1);


// decompose dictionary type (rev 1)
// internal
// String -> String

const decompDictType = s => s.slice(1, -1);


// decompose funcation argument type (rev 1)
// internal
// String -> String

const decompFunArgType = s => s.slice(1, -1);


// decompose multi argument type (rev 1)
// internal
// String -> String

const decompMultiArgType = s => s.slice(1, -1);


// decompose record type (rev 1)
// internal
// String -> String

const decompRecType = s => s.slice(1, -1).replace(/[a-z]+: /gi, "");


// decompose constructor type (rev 1)
// internal
// String -> String

const decompConsType = s => s.slice(s.indexOf("(") + 1, -1);


// split type enumeration (rev 1)
// internal
// String -> [String]

const splitTypeEnum = type => {
  const aux = (n, acc, stack) => {
    const c = type[n],
     prev = n === 0 ? "" : type[n - 1],
     next = n === type.length - 1 ? "" : type[n + 1];

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


// split function type (rev 1)
// internal
// String -> [String]

const splitFunType = type => {
  const aux = (n, acc, stack) => {
    const c = type[n],
     next = n === type.length - 1 ? "" : type[n + 1];

    if (c === undefined) {
      if (acc.length < 2) throw new TypeSysError(
        `splitFunType received a non-functional type\n\n${type}\n`
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


// parse argument type (rev 1)
// internal
// String -> {types: [String], arity: PositiveNumber}

const parseArgType = argT => {
  const typeCat = catType(argT);
  let types;

  switch (typeCat) {
    case "FunArg": types = [decompFunArgType(argT)]; break;
    case "MultiArg": types = splitTypeEnum(decompMultiArgType(argT)); break;
    default: types = [argT];
  }

  return types.reduce((acc, type, n, ref) => {
    if (n === ref.length - 1) {
      if (type.indexOf("...") === 0) return {types: acc.types.concat(type.slice(3)), arity: Infinity};
      else return {types: acc.types.concat(type), arity: ref.length};
    }

    else if (type.indexOf("...") === 0) throw new TypeSysError(
      `parseArgType received the invalid argument type\n\n${s}\n${ul(0, 3)}\n\nunexpected variadic notation`
    );

    else return acc.types.push(type), acc;
  }, {types: [], arity: null});
};


// define contract (rev 1)
// internal
// (String, String, {String}) -> Function

const defineContract = (typeCat, type, bindings) => {
  switch (typeCat) {
    case "Mono": {
      if (type in monoMap) return monoMap[type];

      else throw new TypeSysError(
        `defineContract received the unknown monomorphic type\n\n${type}\n`
      );
    }

    case "Poly": return anyC(bindings) (type);
    case "Fun": return funC;
    case "Arr": return A(type_ => arrOfC(defineContract(catType(type_), type_, bindings))) (decompArraype(type));
    //case "Tup": return tupOfC;
    //case "Dict": return dictOfC;
    //case "Rec": return recOfC;
    //case "Cons": return consOfC;

    default: throw new TypeSysError(
      `defineContract received the unknown type\n\n${typeCat}\n`
    );
  }
};


// unify type variables (rev 1)
// internal
// performs a side effect by mutating bindings
// (String, PositiveInteger, PositiveInteger, String, [String], [String], {String} => Undefined

const unifyTypeVars = (fname, nf, n, funT, refTs, actualTs, bindings) => {
  const aux = (refTs, actualTs) => {
    refTs.forEach(((refT, m) => {
      const refTypeCat = catType(refT),
       actualTypeCat = catType(actualTs[m]),
       actualT = actualTs[m];

      if (refTs.length !== actualTs.length) throw new TypeError(
        `${fname} expects\n\n${funT}\n${ulAtArg(funT, nf, n)}\n\n${actualTs.join(" => ")} received\n`
      );

      if (refTypeCat !== "Poly" && refTypeCat !== actualTypeCat) throw new TypeError(
        `${fname} expects\n\n${funT}\n${ulAtArg(funT, nf, n)}\n\n${actualTs.join(" => ")} received\n`
      );

      switch (refTypeCat) {
        case "Mono": break;
        case "Poly": bindings[refT] = actualT; break;
        case "Fun": aux(splitFunType(refT), splitFunType(actualT)); break;
        default: aux(splitTypeEnum(decomposeType(refT, refTypeCat)), splitTypeEnum(decomposeType(actualT, actualTypeCat)));
      }
    }));
  };

  aux(refTs, actualTs);
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

const booC = b => {
  if (isBoo(b)) return b;
  throw new Error(JSON.stringify({type: "type", nominal: "Boolean", real: introspect(b)}));
};

booC.toString = () => "Boolean";


// null contract (rev 1)
// internal
// Null -> Null

const nullC = n => {
  if (isNull(n)) return n;
  throw new Error(JSON.stringify({type: "type", nominal: "Null", real: introspect(n)}));
};

nullC.toString = () => "Null";


// number contract (rev 1)
// internal
// Number -> Number

const numC = n => {
  if (isNum(n)) return n;
  throw new Error(JSON.stringify({type: "type", nominal: "Number", real: introspect(n)}));
};

numC.toString = () => "Number";


// string contract (rev 1)
// internal
// String -> String

const strC = s => {
  if (isStr(s)) return s;
  throw new Error(JSON.stringify({type: "type", nominal: "String", real: introspect(s)}));
};

strC.toString = () => "String";


// symbol contract (rev 1)
// internal
// Symbol -> Symbol

const symC = s => {
  if (isSym(s)) return s;
  throw new Error(JSON.stringify({type: "type", nominal: "Symbol", real: introspect(s)}));
};

symC.toString = () => "Symbol";


// refine contract (rev 1)
// internal
// (a -> [a]) -> (a -> a) -> a -> a

const refineC = p => c => {
  const refineC2 = x => {
    const typeCat = catType(type);

    if (typeCat === "Poly") throw new TypeSysError(
      `refineC received a purely-polymorphic contract\n\n(a -> Boolean) -> (a -> a) -> a -> a\n${ul(19, 6)}\n\n that is forbidden in this context\n`
    );

    else if (typeCat === "Fun") throw new TypeSysError(
      `refineC received a function contract\n\n(a -> Boolean) -> (a -> a) -> a -> a\n${ul(19, 6)}\n\n that is forbidden in this context\n`
    );

    c(x);

    const r = p(x);

    if (r.length > 0) throw new Error(JSON.stringify({type: "rtype", nominal: type, real: type, refinement: r.join(", ")}));
  }, type = `${c}<${p}>`;

  refineC2.toString = () => type;
  return refineC2;
};


// --[ POLYMORPHIC CONTRACTS ]-------------------------------------------------


// any contract (rev 1)
// internal
// {String} -> Char -> a -> a

const anyC = bindings => {
  const anyC2 = name => {
    const anyC3 = x => {
      const type = introspect(x);
      Object.keys(bindings).forEach(k => bindings[k] = bindings[k].replace(new RegExp(`\\b${name}\\b`, "g"), type));

      if (name in bindings) {
        if (bindings[name] !== type) throw new Error(
          JSON.stringify({type: "binding", nominal: bindings[name], real: type, name: name})
        );

        return x;
      }

      else return bindings[name] = type, x;
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
  else throw new Error(JSON.stringify({type: "type", nominal: "Array", real: introspect(xs)}));
};

arrC.toString = () => "Array";


// array of contract (rev 1)
// internal
// TODO: add ulAtDiff for errors caused by $type
// TODO: add $type to xs when missing
// Function -> [a] -> [a]

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
// Tuple -> Tuple

const tupC = xs => {
  if (isTup(xs)) return xs;
  else throw new Error(JSON.stringify({type: "type", nominal: "Tuple", real: introspect(xs)}));
};

tupC.toString = () => "Tuple";


// tuple of contract (rev 1)
// internal
// TODO: add ulAtDiff for errors caused by $type
// [Function] -> Tuple -> Tuple

const tupOfC = cs => {
  const tupOfC2 = xs => {
    if (!isArr(xs)) throw new Error(
      JSON.stringify({type: "type", nominal: type, real: introspect(xs)})
    );

    if (xs.length <= TUP_MIN_LEN || xs.length >= TUP_MAX_LEN) {
      throw new Error(JSON.stringify({type: "type", nominal: "Tuple", real: introspect(xs)}));
    }

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

  const type = `(${cs.join(", ")})`;
  return tupOfC2.toString = () => type, tupOfC2;
};

tupOfC.toString = () => "Tuple";


// object contract (rev 1)
// internal
// Object -> Object

const objC = o => {
  if (isObj(o)) return o;
  else throw new Error(JSON.stringify({type: "type", nominal: "Object", real: introspect(o)}));
};

objC.toString = () => "Object";


// dict contract (rev 1)
// internal
// Dict -> Dict

const dictC = o => {
  if (isDict(o)) return o;
  else throw new Error(JSON.stringify({type: "type", nominal: "Dict", real: introspect(o)}));
};

dictC.toString = () => "Dict";


// dict of contract (rev 1)
// internal
// TODO: add ulAtDiff for errors caused by $type
// Function -> {a} -> {a}

const dictOfC = c => {
  const dictOfC2 = o => {
    if (!isObj(o)) throw new Error(
      JSON.stringify({type: "type", nominal: type, real: introspect(o)})
    );

    if ($type in o) {
      if (o[$type] === type) return o;
      else throw new Error(JSON.stringify({type: "type", nominal: type, real: o[$type]}));
    }

    Object.keys(o).forEach((k, n) => {
      try {c(o[k])}

      catch (e) {
        if (TypeSysError.prototype.isPrototypeOf(e)) throw e;
        const p = JSON.parse(e.message);
        let e_;

        p.offL = "offL" in p ? p.offL + 1 : 1;
        p.offR = "offR" in p ? p.offR - 1 : -1;
        e_ = new Error(JSON.stringify(p));
        e_.stack = e.stack;
        throw e_;
      }
    });

    return o;
  };

  const type = `{${c}}`;
  return dictOfC2.toString = () => type, dictOfC2;
};

dictOfC.toString = () => "{a}";


// record contract (rev 1)
// internal
// Record -> Record

const recC = o => {
  if (isRec(o)) return o;
  else throw new Error(JSON.stringify({type: "type", nominal: "Record", real: introspect(o)}));
};

recC.toString = () => "Record";


// record of contract (rev 1)
// internal
// TODO: add ulAtDiff for errors caused by $type
// [Function] -> Record -> Record

const recOfC = cs => {
  const recOfC2 = o => {
    const ks = Object.keys(o);

    if (!isObj(o)) throw new Error(
      JSON.stringify({type: "type", nominal: type, real: introspect(o)})
    );

    if (ks.length <= REC_MIN_LEN || ks.length >= REC_MAX_LEN) {
      throw new Error(JSON.stringify({type: "type", nominal: "Record", real: introspect(o)}));
    }

    if (cs.length !== ks.length) throw new Error(
      JSON.stringify({type: "length", nominal: cs.length, real: xs.length})
    );

    if ($type in o) {
      if (o[$type] === type) return o;
      else throw new Error(JSON.stringify({type: "type", nominal: type, real: o[$type]}));
    }

    cs.forEach((c, n) => {
      try {c(o[ks[n]])}

      catch (e) {
        if (TypeSysError.prototype.isPrototypeOf(e)) throw e;
        const p = JSON.parse(e.message);
        let e_;

        p.offL = "offL" in p ? p.offL + ks[n].length + 1 : ks[n].length + 1;
        p.offR = "offR" in p ? p.offR - ks[n].length - 1 : -ks[n].length - 1;
        e_ = new Error(JSON.stringify(p));
        e_.stack = e.stack;
        throw e_;
      }
    });

    return o;
  };

  const type = "{" + cs.map((c, n) => `${ks[n]}: ${c}`).join(", ") + "}";
  return recOfC2.toString = () => type, recOfC2;
};

recOfC.toString = () => "Record";


// TODO: consC


// TODO: consOfC


// function contract (rev 1)
// internal
// Function -> Function

const funC = f => {
  if (!isFun(f)) throw new Error(
    JSON.stringify({type: "type", nominal: "Function", real: introspect(f)})
  );

  else if (!($type in f)) throw new TypeSysError(
    `funC expects typed function\n\nunvirtualized function\n\n${f.name} received\n`
  );

  else return f;
};

funC.toString = () => "Function";


// --[ INTROSPECTION ]---------------------------------------------------------


// introspect (rev 1)
// internal
// TODO: add subtypes
// TODO: add abstract data types
// a -> String

const introspect = x => {
  switch (typeof x) {
    case "undefined": return "Undefined";

    case "number": {
      if (Number.isNaN(x)) return "NaN";
      else return "Number";
    }

    case "string": return "String";
    case "boolean": return "Boolean";
    case "symbol": return "Symbol";
    case "function": return "Function";

    case "object": {
      if (x === null) return "Null";
      else if ($type in x) return x[$type];

      else if (Array.isArray(x)) {
        if (x.length <= TUP_MAX_LEN) {
          const types = x.map(x_ => `${introspect(x_)}`);
          return `[${Array.from(types.reduce((acc, x_) => acc.add(x_), new Set())).join(", ")}]`;
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

            if (ks.length <= REC_MAX_LEN) {
              const rec = ks.map(k => `${k}: ${introspect(x[k])}`),
               dict = `{${introspect(x[ks[0]])}}`,
               types = Array.from(rec.reduce((acc, x_) => acc.add(x_.split(": ") [1]), new Set()));

              if (types.length === 1) return dict;
              else return `{${rec.join(", ")}}`;
            }

            else return `{${introspect(x[k[0]])}}`;
          }
        }
      }
    }
  }
};


// --[ TYPE PREDICATES ]-------------------------------------------------------


// get string tag (rev 1)
// internal
// a -> String

const getStringTag = x => {
  const ss = Object.prototype.toString.call(x).split(" ");
  return ss[ss.length - 1].slice(0, -1);
};


// instance of (rev 1)
// internal
// Function -> Object -> Boolean

const instanceOf = cons => o => cons.prototype.isPrototypeOf(o);


// is array (rev 1)
// internal
// a -> Boolean

const isArr = x => Array.isArray(x);


// is array buffer (rev 1)
// internal
// a -> Boolean

const isArrBuf = x => getStringTag(x) === "ArrayBuffer";


// is boolean (rev 1)
// internal
// a -> Boolean

const isBoo = x => typeof x === "boolean";


// TODO: isCons


// is data view (rev 1)
// internal
// a -> Boolean

const isDataView = x => getStringTag(x) === "DataView";


// is date (rev 1)
// internal
// a -> Boolean

const isDate = x => getStringTag(x) === "Date";


// is dict (rev 1)
// internal
// a -> Boolean

const isDict = x => isObj(x) && isDictT(introspect(x)) ? true : false;


// is error (rev 1)
// internal
// a -> Boolean

const isError = x => getStringTag(x) === "Error";


// is generator (rev 1)
// internal
// a -> Boolean

const isGtor = x => getStringTag(x) === "Generator";


// is generator function (rev 1)
// internal
// a -> Boolean

const isGtorFun = x => getStringTag(x) === "GeneratorFunction";


// is float 32 array (rev 1)
// internal
// a -> Boolean

const isFloat32Arr = x => getStringTag(x) === "Float32Array";


// is float 64 array (rev 1)
// internal
// a -> Boolean

const isFloat64Arr = x => getStringTag(x) === "Float64Array";


// is function (rev 1)
// internal
// a -> Boolean

const isFun = x => typeof x === "function";


// is integer 8 array (rev 1)
// internal
// a -> Boolean

const isInt8Arr = x => getStringTag(x) === "Int8Array";


// is integer 32 array (rev 1)
// internal
// a -> Boolean

const isInt32Arr = x => getStringTag(x) === "Int32Array";


// is integer 64 array (rev 1)
// internal
// a -> Boolean

const isInt64Arr = x => getStringTag(x) === "Int64Array";


// is iterator (rev 1)
// internal
// a -> Boolean

const isItor = x => getStringTag(x) === "Iterator";


// is map (rev 1)
// internal
// a -> Boolean

const isMap = x => getStringTag(x) === "Map";


// is null (rev 1)
// internal
// a -> Boolean

const isNull = x => x === null;


// is number (rev 1)
// internal
// a -> Boolean

const isNum = x => typeof x === "number" && !Number.isNaN(x);


// is object (rev 1)
// internal
// a -> Boolean

const isObj = x => Object(x) === x;


// is promise (rev 1)
// internal
// a -> Boolean

const isPromise = x => getStringTag(x) === "Promise";


// is record (rev 1)
// internal
// a -> Boolean

const isRec = x => isObj(x) && isRecT(introspect(x)) ? true : false;


// is regular expression (rev 1)
// internal
// a -> Boolean

const isRegExp = x => getStringTag(x) === "RegExp";


// is set (rev 1)
// internal
// a -> Boolean

const isSet = x => getStringTag(x) === "Set";


// is string (rev 1)
// internal
// a -> Boolean

const isStr = x => typeof x === "string";


// is symbol (rev 1)
// internal
// a -> Boolean

const isSym = x => typeof x === "symbol";


// is tuple (rev 1)
// internal
// a -> Boolean

const isTup = x => isObj(x) && isTupT(introspect(x)) ? true : false;


// is unsigned integer 8 array (rev 1)
// internal
// a -> Boolean

const isUInt8Arr = x => getStringTag(x) === "UInt8Array";


// is unsigned integer 32 array (rev 1)
// internal
// a -> Boolean

const isUInt32Arr = x => getStringTag(x) === "UInt32Array";


// is unsigned integer 64 array (rev 1)
// internal
// a -> Boolean

const isUInt64Arr = x => getStringTag(x) === "UInt64Array";


// is undefined (rev 1)
// internal
// a -> Boolean

const isUndef = x => x === undefined;


// is weak map (rev 1)
// internal
// a -> Boolean

const isWeakMap = x => getStringTag(x) === "WeakMap";


// is weak set (rev 1)
// internal
// a -> Boolean

const isWeakSet = x => getStringTag(x) === "WeakSet";


// --[ TYPE REFINEMENTS ]------------------------------------------------------


// integer refinement (rev 1)
// Number -> [Number -> Array]

const intR = x => Number.isInteger(x) ? [] : [intR];
intR.toString = () => "integer";


// float refinement (rev 1)
// Number -> [Number -> Array]

const floatR = n => Number.isFinite(n) ? [] : [floatR];
floatR.toString = () => "float";


// positive number refinement (rev 1)
// Number -> [Number -> Array]

const posR = n => n >= 0 ? [] : [posR];
posR.toString = () => "positive";


// negative number refinement (rev 1)
// Number -> [Number -> Array]

const negR = n => n < 0 ? [] : [negR];
negR.toString = () => "negative";


// finite refinement (rev 1)
// Number -> [Number -> Array]

const finR = n => Number.isFinite(n) ? [] : [finR];
finR.toString = () => "finite";


// infinite refinement (rev 1)
// Number -> [Number -> Array]

const infR = n => n === Number.POSITIVE_INFINITY || n === Number.NEGATIVE_INFINITY ? [] : [infR];
infR.toString = () => "infinite";


// zero refinement (rev 1)
// Number -> [Number -> Array]

const zeroR = n => n === 0 ? [] : [zeroR];
zeroR.toString = () => "zero";


// character refinement (rev 1)
// String -> [String -> Array]

const charR = s => s.length === 1 ? [] : [charR];
charR.toString = () => "char";


// letter refinement (rev 1)
// String -> [String -> Array]

const letterR = s => charR(s).length === 0 && s.search(/[a-z]/i) === 0 ? [] : [letterR];
letterR.toString = () => "letter";


// numeral refinement (rev 1)
// String -> [String -> Array]

const numeralR = s => charR(s).length === 0 && s.search(/[0-9]/) === 0 ? [] : [numeralR];
numeralR.toString = () => "numeral";


// lower case letter refinement (rev 1)
// String -> [String -> Array]

const lcR = s => letterR(s).length === 0 && s.toLowerCase() === s ? [] : [lcR];
lcR.toString = () => "lowerCase";


// upper case letter refinement (rev 1)
// String -> [String -> Array]

const ucR = s => letterR(s).length === 0 && s.toUpperCase() === s ? [] : [ucR];
ucR.toString = () => "upperCase";


// numeral string refinement (rev 1)
// String -> [String -> Array]

const numStrR = s => s * 1 + "" === s ? [] : [numStrR];
numStrR.toString = () => "numeralString";


// length refinement (rev 1)
// polymorphic for all array-like types
// PositiveFiniteInteger -> Object -> [Object -> Array]

const lenR = n => {
  const lenR2 = o => o.length === n ? [] : [lenR(n)];
  lenR2.toString = () => `length(${n})`;
  return lenR2;
};


// size refinement (rev 1)
// PositiveFiniteInteger -> Object -> [Object -> Array]

const sizeR = n => {
  const sizeR2 = o => o.size === n ? [] : [sizeR(n)];
  sizeR2.toString = () => `size(${n})`;
  return sizeR2;
};


// equal refinement (rev 1)
// a -> a -> [a -> Array]

const eqR = y => {
  const eqR2 = x => x === y ? [] : [eqR(y)];
  eqR2.toString = () => `equal(${y})`;
  return eqR2;
};


// lower than refinement (rev 1)
// a -> a -> [a -> Array]

const ltR = y => {
  const ltR2 = x => x < y ? [] : [ltR(y)];
  ltR2.toString = () => `lt(${y})`;
  return ltR2;
};


// lower than or equal refinement (rev 1)
// a -> a -> [a -> Array]

const lteR = y => {
  const lteR2 = x => x <= y ? [] : [lteR(y)];
  lteR2.toString = () => `lte(${y})`;
  return lteR2;
};


// greater than refinement (rev 1)
// a -> a -> [a -> Array]

const gtR = y => {
  const gtR2 = x => x > y ? [] : [gtR(y)];
  gtR2.toString = () => `gt(${y})`;
  return gtR2;
};


// greater than or equal refinement (rev 1)
// a -> a -> [a -> Array]

const gteR = y => {
  const gteR2 = x => x >= y ? [] : [gteR(y)];
  gteR2.toString = () => `gte(${y})`;
  return gteR2;
};


// any refinement (rev 1)
// ...[a -> [a]] -> a -> [a -> [a]]

const allR = (...rs) => {
  const allR2 = x => {
    const aux = n => {
      if (rs[n] === undefined) return [];
      else if (rs[n] (x).length === 0) return aux(n + 1);
      else return [rs[n]];
    }

    return aux(0);
  };

  allR2.toString = () => rs.join(" & ");
  return allR2;
};


// any refinement (rev 1)
// ...[a -> [a]] -> a -> [a -> [a]]

const anyR = (...rs) => {
  const anyR2 = x => {
    const aux = (n, acc) => {
      if (rs[n] === undefined) return acc;
      else if (rs[n] (x).length === 0) return acc;
      else return aux(n + 1, acc.push(rs[n]));
    }

    return aux(0);
  };

  anyR2.toString = () => rs.join(" | ");
  return anyR2;
};


// not refinement (rev 1)
// (a -> [a]) -> a -> [a]

const notR = r => {
  const notR2 = x => r(x).length === 0 ? [notR(r)] : [];
  notR2.toString = () => `!${r}`;
  return notR2;
};


/******************************************************************************
*******************************************************************************
*******************************[ 3. PRIMITIVES ]*******************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
********************************[ 3.1. NUMBER ]********************************
******************************************************************************/


/******************************************************************************
********************************[ 3.2. STRING ]********************************
******************************************************************************/


// interpolate
// Object -> String -> String

const interpolate = o => s => s.replace(/\${(\w+)}/g, (_, k) => o[k]);


// is character (rev 1)
// a -> Boolean

const isChar = x => x.length === 1;


// is character (rev 1)
// a -> Boolean

const isLetter = x => isChar(x) && x.search(/[a-z]/i) === 0;


// is lower case letter (rev 1)
// a -> Boolean

const isLC = x => isLetter(x) && x.toLowerCase() === x;


// is upper case letter (rev 1)
// a -> Boolean

const isUC = x => isLetter(x) && x.toUpperCase() === x;


// successor (rev 0.1)
// String -> String

const succ = x => String.fromCharCode(x.charCodeAt(0) + 1);


/******************************************************************************
*******************************[ 3.3. BOOLEAN ]********************************
******************************************************************************/


// greater than
// a -> a -> Boolean

const gt = y => x => x > y;


// xor
// Boolean -> Boolean -> Boolean

const xor = x => y => !x === !y ? false : true;


/******************************************************************************
*******************************************************************************
*************************[ 4. PROTOTYPES (SUBTYPING) ]*************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
********************************[ 4.1. ERROR ]*********************************
******************************************************************************/


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
*****************************[ 5. PRODUCT TYPES ]******************************
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
********************************[ 5.1. ARRAY ]*********************************
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
********************************[ 5.2. TUPLE ]*********************************
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
******************************[ 5.3. DICTIONARY ]******************************
******************************************************************************/


/******************************************************************************
********************************[ 5.4. RECORD ]********************************
******************************************************************************/


/******************************************************************************
*******************************************************************************
****************************[ 6. CONSTRUCTOR TYPES]****************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
****************************[ 6.1. TAGGED UNIONS ]*****************************
******************************************************************************/


/******************************************************************************
*************************[ 6.2. ABSTRACT DATA TYPES ]**************************
******************************************************************************/


/******************************************************************************
*******************************[ 6.3. PROMISE ]********************************
******************************************************************************/


/******************************************************************************
*******************************************************************************
*******************************[ 7. PROTOCOLS ]********************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
*******************************[ 7.1. ITERABLE ]*******************************
******************************************************************************/


/******************************************************************************
*******************************[ 7.2. ITERATOR ]*******************************
******************************************************************************/


/******************************************************************************
*******************************************************************************
****************************[ 8. DEPENDENT TYPES ]*****************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
*******************************************************************************
********************[ 9. PARAMETRIC POLYMORPHIC FUNCTIONS ]********************
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
**********************[ 10. BOUNDED POLYMORPHIC CLASSES ]**********************
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
// {a -> a}

const monoMap = {
  Boolean: booC,
  Null: nullC,
  Number: numC,
  String: strC,
  Symbol: symC,
};


// API


module.exports = {
  Fun
};