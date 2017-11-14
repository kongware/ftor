"use strict";

/*

   ad88                                   
  d8"      ,d                             
  88       88                             
MM88MMM  MM88MMM  ,adPPYba,   8b,dPPYba,  
  88       88    a8"     "8a  88P'   "Y8  
  88       88    8b       d8  88          
  88       88,   "8a,   ,a8"  88          
  88       "Y888  `"YbbdP"'   88          

*/                                        


/******************************************************************************
*******************************************************************************
*********************************[ 1. MODULE ]*********************************
*******************************************************************************
******************************************************************************/


//***[ 1.1. STATE ]************************************************************


// development mode
// false by default
// Boolean

let devMode = false;


export const setDevMode = b => devMode = b;


//***[ 1.1. CONSTANTS ]********************************************************


const SYM_PREFIX = "ftor/";


const TYPE_REP = Symbol.for(`${SYM_PREFIX}typeRep`);


const TYPE_SIG = Symbol.for(`${SYM_PREFIX}typeSig`);


const TUP_MAX_FIELDS = 16;


const VOID = {Undefined: undefined, Null: null, NaN: NaN};


/******************************************************************************
*******************************************************************************
*****************************[ 2. INTROSPECTION ]******************************
*******************************************************************************
******************************************************************************/


const getStringTag = x => {
  const ss = Object.prototype.toString.call(x).split(" ");
  return last(ss).slice(0, -1);
};


const introspect = x => {
  const tag = getStringTag(x),
    tags = new Set();

  switch (typeof x) {
    case "boolean": return tags.add("Boolean");

    case "function": {
      if (tag === "Fun") {
        tags.add(x[TYPE_SIG].replace(/\([a-z0-9_]+ :: /gi, "("));
      }

      tags.add(tag);
      return tags.add("Function");
    }

    case "number": {
      if (Number.isNaN(x)) return tags.add("NaN");
      if (!Number.isFinite(x)) tags.add("Infinity");
      return tags.add("Number");
    }

    case "string": return tags.add("String");
    case "symbol": return tags.add("Symbol");
    case "undefined": return tags.add("Undefined");

    case "object": {
      if (x === null) return tags.add("Null");

      else {
        switch (tag) {
          case "Adt": {
            tags.add(x[TYPE_SIG]);
            return tags.add(tag);
          }

          case "Arr": {
            tags.add(x[TYPE_SIG]);
            tags.add(tag);
            return tags.add("Array");
          }

          case "_Map": {
            tags.add(x[TYPE_SIG]);
            tags.add(tag);
            return tags.add("Map");
          }

          case "Rec": {
            tags.add(x[TYPE_SIG]);
            tags.add(tag);
            return tags.add("Object");
          }

          case "Tup": {
            tags.add(x[TYPE_SIG]);
            tags.add(tag);
            return tags.add("Array");
          }

          case "Unit": {
            tags.add(tag);
            return tags.add("Array");
          }

          default: {
            if ("constructor" in x) tags.add(x.constructor.name);
            tags.add(tag);
            return tags.add("Object");
          }
        }
      }
    }
  }
};


const introspect1 = x => values(introspect(x)).next().value;


/******************************************************************************
*******************************************************************************
*****************************[ 3. TYPE INFERENCE ]*****************************
*******************************************************************************
******************************************************************************/
  

const infer = x => {
  const tag = getStringTag(x);

  switch (typeof x) {
    case "boolean": return "Boolean";

    case "function": {
      if (tag === "Fun") return x[TYPE_SIG];
      else return "Function";
    }

    case "number": {
      if (Number.isNaN(x)) return "NaN";
      else if (!Number.isFinite(x)) return "Infinity";
      else return "Number";
    }

    case "string": return "String";
    case "symbol": return "Symbol";
    case "undefined": return "Undefined";

    case "object": {
      if (x === null) return "Null";

      else {
        if (TYPE_SIG in x) return x[TYPE_SIG];

        else {
          switch (tag) {
            case "Array": {
              if (x.length === 0) return "Array";
              else if (x.length === 1) return `[${infer(x[0])}]`;

              else {
                const [s, ss] = x.reduce(([s, ss], y) => {
                    const t = infer(y);
                    return [s.add(t), ss.concat(t)];
                  }, [new Set(), []]);

                if (s.size === 1) return `[${ss[0]}]`;

                else if (ss.length > TUP_MAX_FIELDS) _throw(
                  TypeInferenceError,
                  ["invalid Tuple-like Array value"],
                  x,
                  {desc: [
                    `too many fields received`,
                    `Tuple must not contain more than ${TUP_MAX_FIELDS} fields`,
                  ]}
                );
                
                else return `[${ss.join(", ")}]`;
              }
            }

            case "Map": {
              if (x.size === 0) return "Map";
              else return `{${nextVal(x.entries()).map(y => infer(y)).join("::")}}`;
            }

            case "Object": {
              const ks = Object.keys(x);
              if (ks.length === 0) return "Object";
              else return "{" + ks.map(k => `${k}: ${infer(x[k])}`).join(", ") + "}";
            }

            default: {
              if ("constructor" in x) return x.constructor.name;
              else return tag;
            }
          }
        }
      }
    }
  }
};


/******************************************************************************
*******************************************************************************
**************************[ 4. TYPE REPRESENTATIVES ]**************************
*******************************************************************************
******************************************************************************/


//***[ 4.1. ALGEBRAIC DATA TYPES ]*********************************************


const AdtT = (Cons => (tag, fromTo, typeReps) => new Cons(tag, fromTo, typeReps))
  (class AdtT {
    constructor(tag, fromTo, typeReps) {
      this.fromTo = fromTo;
      this.tag = tag;
      this.typeReps = typeReps;
    }
  });


//***[ 4.2. ARRAYS ]***********************************************************


const ArrT = (Cons => (fromTo, typeReps) => new Cons(fromTo, typeReps))
  (class ArrT {
    constructor(fromTo, typeReps) {
      this.fromTo = fromTo;
      this.tag = "Arr";
      this.typeReps = typeReps;
    }
  });


//***[ 4.3. FUNCTIONS ]********************************************************


const FunT = (Cons => (name, {isStrict}, fromTo, typeReps) => new Cons(name, isStrict, fromTo, typeReps))
  (class FunT {
    constructor(name, isStrict, fromTo, typeReps) {
      this.name = name;
      this.isStrict = isStrict;
      this.fromTo = fromTo;
      this.tag = "Fun";
      this.typeReps = typeReps;
    }
  });


const NoArgT = (Cons => fromTo => new Cons(fromTo))
  (class NoArgT extends Array {
    constructor(fromTo) {
      super();
      this.fromTo = fromTo;
    }
  });


const ArgT = (Cons => typeRep => new Cons(typeRep))
  (class ArgT extends Array {
    constructor(typeRep) { super(typeRep); }
  });


const RestT = (Cons => typeRep => new Cons(typeRep))
  (class RestT extends Array {
    constructor(typeRep) { super(typeRep); }
  });


const ArgsT = (Cons => (fromTo, typeReps) => new Cons(fromTo, typeReps))
  (class ArgsT extends Array {
    constructor(fromTo, typeReps) {
      if (getStringTag(typeReps) === "Array") super(...typeReps);
      else super(typeReps);
      this.fromTo = fromTo;
    }
  });


const ReturnT = (Cons => typeRep => new Cons(typeRep))
  (class ReturnT extends Array {
    constructor(typeRep) { super(typeRep); }
  });


//***[ 4.4. _MAP ]**************************************************************


const _MapT = (Cons => (fromTo, typeReps) => new Cons(fromTo, typeReps))
  (class _MapT {
    constructor(fromTo, typeReps) {
      this.fromTo = fromTo;
      this.tag = "_Map";
      this.typeReps = typeReps;
    }
  });


//***[ 4.5. MONOMORPHIC TYPES ]************************************************


const MonoT = (Cons => (fromTo, tag) => new Cons(fromTo, tag))
  (class MonoT {
    constructor(fromTo, tag) {
      this.fromTo = fromTo;
      this.tag = tag;
      this.typeReps = [];
    }
  });


//***[ 4.6. POLYMORPHIC TYPES ]************************************************


const PolyT = (Cons => (fromTo, tvar) => new Cons(fromTo, tvar))
  (class PolyT {
    constructor(fromTo, tvar) {
      this.fromTo = fromTo;
      this.tag = tvar;
      this.typeReps = [];
    }
  });


//***[ 4.7. RECORDS ]**********************************************************


const RecT = (Cons => (fromTo, typeReps) => new Cons(fromTo, typeReps))
  (class RecT {
    constructor(fromTo, typeReps) {
      this.fromTo = fromTo;
      this.tag = "Rec";
      this.typeReps = typeReps;
    }
  });


//***[ 4.8. TUPLES ]***********************************************************


const TupT = (Cons => (fromTo, typeReps) => new Cons(fromTo, typeReps))
  (class TupT {
    constructor(fromTo, typeReps) {
      this.fromTo = fromTo;
      this.tag = "Tup";
      this.typeReps = typeReps;
    }
  });


//***[ 4.9. UNIT ]***********************************************************


const UnitT = (Cons => fromTo => new Cons(fromTo))
  (class UnitT {
    constructor(fromTo) {
      this.fromTo = fromTo;
      this.tag = "Unit";
      this.typeReps = [];
    }
  });


/******************************************************************************
*******************************************************************************
******************************[ 5. SERIALIZING ]*******************************
*******************************************************************************
******************************************************************************/


const serialize = typeRep => {
  const {tag, typeReps} = typeRep;

  switch (tag) {
    case "Arr": return serializeArr(tag, typeReps);
    case "Fun": return serializeFun(typeRep.name, tag, typeReps);
    case "_Map": return serializeMap(tag, typeReps);
    case "Rec": return serializeRec(tag, typeReps);
    case "Tup": return serializeTup(tag, typeReps);
    case "Unit": return "[]";
    
    default: {
      if (typeRep.constructor.name === "AdtT") return serializeAdt(tag, typeReps);

      else if (typeReps.length > 0) throw new TypeRepError(
        "invalid type representative\n\n" +
        `${typeRep}\n\n` +
        "invalid mono type\n"
      );

      else return tag;
    }
  }
};


const serializeAdt = (tag, typeReps) => {
  return `${tag}<`
    .concat(typeReps
      .map(typeRep => {
        if (typeRep.typeReps.length === 0) return typeRep.tag;
        else return serialize(typeRep);
      })
      .join(", ")
    )
    .concat(">");
};


const serializeArr = (tag, typeReps) => {
  return "["
    .concat(typeReps
      .map(typeRep => {
        if (typeRep.typeReps.length === 0) return typeRep.tag;
        else return serialize(typeRep);
      })
      .join("")
    )
    .concat("]");
};


const serializeFun = (name, tag, typeReps) => {
  return "("
    .concat(name === "" ? "" : `${name} :: `)
    .concat(typeReps
      .map(args => {
        switch (args.constructor.name) {
          case "NoArgT": return "()";

          case "ArgT":
          case "ReturnT": {
            const {tag: t, typeReps: r} = args[0];
            if (r.length === 0) return t;
            else return serialize(args[0]);
          }

          case "RestT": {
            const {tag: t, typeReps: r} = args[0];
            if (r.length === 0) return `...${t}`;
            else return `...${serialize(args[0])}`;
          }

          case "ArgsT": {
            return args
              .map(arg => {
                switch (arg.constructor.name) {
                  case "ArgT": {
                    const {tag: t, typeReps: r} = arg[0];
                    if (r.length === 0) return t;
                    else return serialize(arg[0]);
                  }

                  case "RestT": {
                    const {tag: t, typeReps: r} = arg[0];
                    if (r.length === 0) return `...${t}`;
                    else return `...${serialize(arg[0])}`;
                  }
                }
              })
              .join(", ");
          }
        }
      })
      .join(" -> ")
    )
    .concat(")");
};


const serializeMap = (tag, typeReps) => {
  return "{"
    .concat(typeReps
      .map(({k, v}) => [k, v]
        .map(typeRep => {
          if (typeRep.typeReps.length === 0) return typeRep.tag;
          else return serialize(typeRep);
        })
        .join("::")
      )
    )
    .concat("}");
};


const serializeRec = (tag, typeReps) => {
  return "{"
    .concat(typeReps
      .map(({k, v}) => {
        if (v.typeReps.length === 0) return `${k}: ${v.tag}`;
        else return `${k}: ${serialize(v)}`;
      })
      .join(", ")
    )
    .concat("}");
};


const serializeTup = (tag, typeReps) => {
  return "["
    .concat(typeReps
      .map(typeRep => {
        if (typeRep.typeReps.length === 0) return typeRep.tag;
        else return serialize(typeRep);
      })
      .join(", ")
    )
    .concat("]");
};


/******************************************************************************
*******************************************************************************
*****************************[ 6. DESERIALIZING ]******************************
*******************************************************************************
******************************************************************************/


// don't fear the beast...

const deserialize = typeSig => {
  const aux = (typeSig, n, state) => {
    const {depth, context, phase, buf, fromTo, tag, typeReps} = state,
      c = typeSig[n],
      next = n + 1 === typeSig.length ? "" : typeSig[n + 1];

    if (c === undefined) _throw(
      TypeSigError,
      ["invalid type signature"],
      typeSig,
      {fromTo: [n, n], desc: ["unexpected end of signature"]}
    );

    else if (c.search(/[a-z0-9(\[{<>}\]), \-.:_]/i) !== 0) _throw(
      TypeSigError,
      ["invalid type signature"],
      typeSig,
      {fromTo: [n, n], desc: ["invalid symbol"]}
    );

    switch (context) {
      case "ADT": {
        switch (phase) {
          case "TAG": {
            if (c.search(/[a-z]/i) === 0) {
              return aux(
                typeSig, n + 1,
                {depth, context, phase, buf: buf + c, fromTo, tag, typeReps}
              );
            }

            else {
              return aux(
                typeSig, n + 1,
                {depth: depth + 1, context, phase: "TYPE_REP", buf: "", fromTo, tag: buf, typeReps}
              );
            }
          }

          case "TYPE_REP": {
            if (c === ",") {
              if (typeReps.length === 0) _throw(
                TypeSigError,
                ["invalid type signature"],
                typeSig,
                {fromTo: [n, n], desc: ["unexpected symbol"]}
              );

              else if (next === " ") {
                return aux(
                  typeSig, n + 2,
                  {depth, context, phase, buf, fromTo, tag, typeReps}
                );
              }
              
              else _throw(
                TypeSigError,
                ["invalid type signature"],
                typeSig,
                {fromTo: [n + 1, n + 1], desc: [`symbol " " expected`]}
              );
            }

            else if (c === ">") {
              return [AdtT(tag, fromTo, typeReps), n + 1, depth - 1];
            }

            else {
              const {context: c_, phase: p, buf: b} = getContext(typeSig, n);

              const [typeRep, m] = aux(
                typeSig, n,
                {depth, context: c_, phase: p, buf: b, fromTo: [n], tag: "", typeReps: []}
              );
              
              return aux(
                typeSig, m,
                {depth, context, phase, buf: "", fromTo: [fromTo[0], m], tag, typeReps: typeReps.concat(typeRep)}
              );
            }
          }
        }
      }

      case "ARR": {
        switch (phase) {
          case "OUTER": {
            return aux(
              typeSig, n + 1,
              {depth: depth + 1, context, phase: "INNER", buf, fromTo, tag: "Arr", typeReps}
            );
          }

          case "INNER": {
            if (c === ",") {
              if (typeReps.length === 0) _throw(
                TypeSigError,
                ["invalid type signature"],
                typeSig,
                {fromTo: [n, n], desc: ["unexpected symbol"]}
              );

              else if (next === " ") {
                return aux(
                  typeSig, n + 2,
                  {depth, context, phase, buf, fromTo, tag: "Tup", typeReps}
                );
              }
              
              else _throw(
                TypeSigError,
                ["invalid type signature"],
                typeSig,
                {fromTo: [n + 1, n + 1], desc: [`symbol " " expected`]}
              );
            }

            else if (c === "]") {
              if (tag === "Arr") return [ArrT(fromTo, typeReps), n + 1, depth - 1];
              else return [TupT(fromTo, typeReps), n + 1, depth - 1];
            }

            else {
              const {context: c_, phase: p, buf: b} = getContext(typeSig, n);

              const [typeRep, m] = aux(
                typeSig, n,
                {depth, context: c_, phase: p, buf: b, fromTo: [n], tag: "", typeReps: []}
              );
              
              return aux(
                typeSig, m,
                {depth, context, phase, buf: "", fromTo: [fromTo[0], m], tag, typeReps: typeReps.concat(typeRep)}
              );
            }
          }
        }
      }

      case "FUN": {
        const name = state.name || "";

        switch (phase) {
          case "OUTER": {
            return aux(
              typeSig, n + 1,
              {depth: depth + 1, context, phase: "LOOK_AHEAD", buf, name: "", fromTo, tag: "Fun", typeReps}
            );
          }

          case "LOOK_AHEAD": {
            const phase_ = lookAheadFun(typeSig.slice(n));

            if (phase_ === "ARGS") return aux(
              typeSig, n,
              {depth, context, phase: phase_, buf, name, fromTo, tag, typeReps: typeReps.concat([ArgsT([n], [])])}
            );

            else return aux(
              typeSig, n,
              {depth, context, phase: phase_, buf, name, fromTo, tag, typeReps}
            );
          }

          case "NAME": {
            if (c.search(/[a-z0-9_]/i) === 0) return aux(
              typeSig, n + 1,
              {depth, context, phase, buf: buf + c, name, fromTo, tag, typeReps}
            );

            else if (c === " ") {
              if (typeSig.slice(n, n + 4) === " :: ") return aux(
                typeSig, n + 4,
                {depth, context, phase: "LOOK_AHEAD", buf: "", name: buf, fromTo, tag, typeReps}
              );

              else if (next === ":" && typeSig[n + 2] === ":") _throw(
                TypeSigError,
                ["invalid type signature"],
                typeSig,
                {fromTo: [n + 3, n + 3], desc: [`symbol " " expected`]}
              );

              else if (next === ":") _throw(
                TypeSigError,
                ["invalid type signature"],
                typeSig,
                {fromTo: [n + 2, n + 2], desc: [`symbol ":" expected`]}
              );

              else _throw(
                TypeSigError,
                ["invalid type signature"],
                typeSig,
                {fromTo: [n + 1, n + 1], desc: [`symbol ":" expected`]}
              );
            } 

            else _throw(
              TypeSigError,
              ["invalid type signature"],
              typeSig,
              {fromTo: [n, n], desc: ["unexpected symbol"]}
            );
          }

          case "NO_ARG": {
            return aux(
              typeSig, n + 2,
              {depth, context, phase: "ARROW", buf, name, fromTo: [n, n + 1], tag, typeReps: typeReps.concat([NoArgT([n, n + 1])])}
            );
          }

          case "ARG": {
            const {context: c_, phase: p, buf: b} = getContext(typeSig, n);

            const [typeRep, m] = aux(
              typeSig, n,
              {depth, context: c_, phase: p, buf: b, name, fromTo: [n], tag: "", typeReps: []}
            );
            
            return aux(
              typeSig, m,
              {depth, context, phase: "ARROW", buf: "", name, fromTo: [fromTo[0], m], tag, typeReps: typeReps.concat([ArgT(typeRep)])}
            );
          }

          case "REST": {
            if (c === ".") {
              if (next === "." && typeSig[n + 2] === ".") return aux(
                typeSig, n + 3,
                {depth, context, phase, buf, name, fromTo, tag, typeReps}
              );

              else _throw(
                TypeSigError,
                ["invalid type signature"],
                typeSig,
                {fromTo: [n, n], desc: ["unexpected symbol"]}
              );
            }

            else {
              const {context: c_, phase: p, buf: b} = getContext(typeSig, n);

              const [typeRep, m] = aux(
                typeSig, n,
                {depth, context: c_, phase: p, buf: b, name, fromTo: [n], tag: "", typeReps: []}
              );
              
              return aux(
                typeSig, m,
                {depth, context, phase: "ARROW", buf: "", name, fromTo: [fromTo[0], m], tag, typeReps: typeReps.concat([RestT(typeRep)])}
              );
            }
          }

          case "ARGS": {
            if (c === ",") {
              if (last(typeReps).length === 0) _throw(
                TypeSigError,
                ["invalid type signature"],
                typeSig,
                {fromTo: [n, n], desc: ["unexpected symbol"]}
              );

              else if (next === " ") {
                return aux(
                  typeSig, n + 2,
                  {depth, context, phase, buf, name, fromTo, tag, typeReps}
                );
              }
              
              else _throw(
                TypeSigError,
                ["invalid type signature"],
                typeSig,
                {fromTo: [n + 1, n + 1], desc: [`symbol " " expected`]}
              );
            }

            else if (c === " ") {
              last(typeReps).fromTo.push(n - 1);

              return aux(
                typeSig, n,
                {depth, context, phase: "ARROW", buf, name, fromTo, tag, typeReps}
              );
            }

            else if (c === ".") return aux(
              typeSig, n,
              {depth, context, phase: "ARGS_REST", buf, name, fromTo, tag, typeReps}
            );

            else {
              const {context: c_, phase: p, buf: b} = getContext(typeSig, n);

              const [typeRep, m] = aux(
                typeSig, n,
                {depth, context: c_, phase: p, buf: b, name, fromTo: [n], tag: "", typeReps: []}
              );
              
              last(typeReps).push(ArgT(typeRep));

              return aux(
                typeSig, m,
                {depth, context, phase, buf: "", name, fromTo: [fromTo[0], m], tag, typeReps}
              );
            }
          }

          case "ARGS_REST": {
            if (c === ".") {
              if (next === "." && typeSig[n + 2] === ".") return aux(
                typeSig, n + 3,
                {depth, context, phase, buf, name, fromTo, tag, typeReps}
              );

              else _throw(
                TypeSigError,
                ["invalid type signature"],
                typeSig,
                {fromTo: [n, n], desc: ["unexpected symbol"]}
              );
            }

            else if (c === ",") _throw(
              TypeSigError,
              ["invalid type signature"],
              typeSig,
              {fromTo: [n, n], desc: ["rest parameter must be the last formal one"]}
            );

            else if (c === " ") {
              last(typeReps).fromTo.push(n - 1);

              return aux(
                typeSig, n,
                {depth, context, phase: "ARROW", buf, name, fromTo, tag, typeReps}
              );
            }

            else {
              const {context: c_, phase: p, buf: b} = getContext(typeSig, n);

              const [typeRep, m] = aux(
                typeSig, n,
                {depth, context: c_, phase: p, buf: b, name, fromTo: [n], tag: "", typeReps: []}
              );
              
              last(typeReps).push(RestT(typeRep));

              return aux(
                typeSig, m,
                {depth, context, phase, buf: "", name, fromTo: [fromTo[0], m], tag, typeReps}
              );
            }
          }

          case "RETURN": {
            if (c === ")") {
              if (next === ")") _throw(
                TypeSigError,
                ["invalid type signature"],
                typeSig,
                {fromTo: [fromTo[0], n], desc: ["unnecessary parenthesis"]}
              );

              else if (last(typeReps)[0].constructor.name === "PolyT") {
                if (typeSig[n - 1].search(/[2]/) === 0) _throw(
                  TypeSigError,
                  ["invalid type signature"],
                  typeSig,
                  {fromTo: [n - 2, n - 1], desc: ["return value must be rank-1 polymorphic"]}
                );

                else return [FunT(name, {isStrict: false}, fromTo, typeReps), n + 1, depth - 1];
              }
  
              else return [FunT(name, {isStrict: true}, fromTo, typeReps), n + 1, depth - 1];
            }

            else {
              const {context: c_, phase: p, buf: b} = getContext(typeSig, n);

              const [typeRep, m] = aux(
                typeSig, n,
                {depth, context: c_, phase: p, buf: b, name, fromTo: [n], tag: "", typeReps: []}
              );

              return aux(
                typeSig, m,
                {depth, context, phase, buf: "", name, fromTo: [fromTo[0], m], tag, typeReps: typeReps.concat([ReturnT(typeRep)])}
              );
            }
          }

          case "ARROW": {
            if (c === " ") {
              if (typeSig.slice(n, n + 4) === " -> ") return aux(
                typeSig, n + 4,
                {depth, context, phase: "LOOK_AHEAD", buf: "", name, fromTo, tag, typeReps}
              );

              else _throw(
                TypeSigError,
                ["invalid type signature"],
                typeSig,
                {fromTo: [n, n], desc: [`token " -> " expected`]}
              );
            }

            else _throw(
              TypeSigError,
              ["invalid type signature"],
              typeSig,
              {fromTo: [n, n], desc: ["unexpected symbol"]}
            );
          }
        }
      }

      case "_MAP": {
        switch (phase) {
          case "OUTER": {
            return aux(
              typeSig, n + 1,
              {depth: depth + 1, context, phase: "KEY", buf, fromTo, tag: "_Map", typeReps}
            );
          }

          case "KEY": {
            const {context: c_, phase: p, buf: b} = getContext(typeSig, n);

            const [typeRep, m] = aux(
              typeSig, n,
              {depth, context: c_, phase: p, buf: b, fromTo: [n], tag: "", typeReps: []}
            );

            return aux(
              typeSig, m + 2,
              {depth, context, phase: "VALUE", buf: "", fromTo: fromTo.concat(m), tag, typeReps: typeReps.concat({k: typeRep, v: null})}
            );
          }

          case "VALUE": {
            if (c === "}") {
              return [_MapT(fromTo, typeReps), n + 1, depth - 1];
            }

            else {
              const {context: c_, phase: p, buf: b} = getContext(typeSig, n);

              const [typeRep, m] = aux(
                typeSig, n,
                {depth, context: c_, phase: p, buf: b, fromTo: [n], tag: "", typeReps: []}
              );
              
              typeReps[0].v = typeRep;

              return aux(
                typeSig, m,
                {depth, context, phase, buf: "", fromTo: [fromTo[0], m], tag, typeReps}
              );
            }
          }
        }
      }

      case "MONO": {
        switch (phase) {
          case "UC": {
            if (next === "") return [MonoT(fromTo.concat(n), c), n + 1, depth];

            else return aux(
              typeSig, n + 1,
              {depth, context, phase: "LETTER", buf: buf + c, fromTo, tag, typeReps}
            );
          }

          case "LETTER": {
            if (c.search(/[a-z]/i) === 0) {
              if (next === "") return [MonoT(fromTo.concat(n), buf + c), n + 1, depth]

              else return aux(
                typeSig, n + 1,
                {depth, context, phase, buf: buf + c, fromTo, tag, typeReps}
              );
            }
            
            else if (c.search(/[)\]}>, :]/) === 0) {
              return [MonoT(fromTo.concat(n - 1), buf), n, depth];
            }

            else _throw(
              TypeSigError,
              ["invalid type signature"],
              typeSig,
              {fromTo: [n, n], desc: ["unexpected symbol"]}
            );
          }
        }
      }

      case "POLY": {
        switch (phase) {
          case "LETTER": {
            if (next === "") return [PolyT(fromTo.concat(n), c), n + 1, depth];

            else return aux(
              typeSig, n + 1,
              {depth, context, phase: "NUMBER", buf: buf + c, fromTo, tag, typeReps}
            );
          }

          case "NUMBER": {
            if (c.search(/[2]/) === 0) {
              if (next === "") return [PolyT(fromTo.concat(n), buf + c), n + 1, depth]
              
              else return aux(
                typeSig, n + 1,
                {depth, context, phase: "END", buf: buf + c, fromTo, tag, typeReps}
              );
            }

            else if (c.search(/[)\]}>, :]/) === 0) {
              return [PolyT(fromTo.concat(n - 1), buf), n, depth];
            }

            else _throw(
              TypeSigError,
              ["invalid type signature"],
              typeSig,
              {fromTo: [n, n], desc: ["unexpected symbol (type variable context)"]}
            );
          }

          case "END": {
            if (c.search(/[)\]}>, :]/) === 0) {
              return [PolyT(fromTo.concat(n - 1), buf), n, depth];
            }

            else _throw(
              TypeSigError,
              ["invalid type signature"],
              typeSig,
              {fromTo: [n, n], desc: ["unexpected symbol"]}
            );
          }
        }
      }

      case "REC": {
        switch (phase) {
          case "OUTER": {
            return aux(
              typeSig, n + 1,
              {depth: depth + 1, context, phase: "KEY", buf, fromTo, tag: "Rec", typeReps}
            );
          }

          case "KEY": {
            if (c.search(/[a-z0-9_]/i) === 0) return aux(
              typeSig, n + 1,
              {depth, context, phase, buf: buf + c, fromTo, tag, typeReps}
            );

            else if (c === ":") {
              if (buf === "") _throw(
                TypeSigError,
                ["invalid type signature"],
                typeSig,
                {fromTo: [n, n], desc: ["unexpected symbol"]}
              );

              else if (next === " ") {
                return aux(
                  typeSig, n + 2,
                  {depth, context, phase: "VALUE", buf: "", fromTo, tag, typeReps: typeReps.concat({k: buf, v: null})}
                );
              }
              
              else _throw(
                TypeSigError,
                ["invalid type signature"],
                typeSig,
                {fromTo: [n + 1, n + 1], desc: [`symbol " " expected`]}
              );
            }

            else _throw(
              TypeSigError,
              ["invalid type signature"],
              typeSig,
              {fromTo: [n, n], desc: ["unexpected symbol"]}
            );
          }

          case "VALUE": {
            if (c === ",") {
              if (typeReps.length === 0) _throw(
                TypeSigError,
                ["invalid type signature"],
                typeSig,
                {fromTo: [n, n], desc: ["unexpected symbol"]}
              );

              else if (next === " ") {
                return aux(
                  typeSig, n + 2,
                  {depth, context, phase: "KEY", buf, fromTo, tag, typeReps}
                );
              }
              
              else _throw(
                TypeSigError,
                ["invalid type signature"],
                typeSig,
                {fromTo: [n + 1, n + 1], desc: [`symbol " " expected`]}
              );
            }

            else if (c === "}") {
              return [RecT(fromTo, typeReps), n + 1, depth - 1];
            }

            else {
              const {context: c_, phase: p, buf: b} = getContext(typeSig, n);

              const [typeRep, m] = aux(
                typeSig, n,
                {depth, context: c_, phase: p, buf: b, fromTo: [n], tag: "", typeReps: []}
              );
              
              last(typeReps).v = typeRep;

              return aux(
                typeSig, m,
                {depth, context, phase, buf: "", fromTo: [fromTo[0], m], tag, typeReps}
              );
            }
          }
        }
      }

      case "UNIT": return [UnitT([n, n + 1]), n + 2, depth];
    }
  };

  const {context, phase, buf} = getContext(typeSig, 0);

  const [typeRep, n, depth] = aux(
    typeSig, 0,
    {depth: 0, context, phase, buf, fromTo: [0], tag: "", typeReps: []}
  );

  if (depth === 0 && typeSig.length !== n) _throw(
    TypeSigError,
    ["invalid type signature"],
    typeSig,
    {fromTo: [n, typeSig.length - 1], desc: ["unexpected symbol(s)"]}
  );

  else return typeRep;
};


const getContext = (typeSig, n) => {
  const c = typeSig[n],
    s = typeSig.slice(n);

  // Adt

  if (s.search(/^[A-Z]{1,}[a-z]*</) === 0) {
    return {context: "ADT", phase: "TAG", buf: ""};
  }

  // Arr / Tup / Unit

  if (c === "[") {
    if (typeSig[n + 1] === "]") return {context: "UNIT", phase: "", buf: ""};
    else return {context: "ARR", phase: "OUTER", buf: ""};
  }

  // Fun

  if (c === "(" && typeSig[n + 1] !== ")") {
    return {context: "FUN", phase: "OUTER", buf: ""};
  }

  // _Map

  if (s.search(/\{.+::/) === 0
  && lookAheadMap(typeSig.slice(n + 1))) {
    return {context: "_MAP", phase: "OUTER", buf: ""};
  }

  // Rec

  if (s.search(/\{[a-z0-9_]+: /i) === 0) {
    return {context: "REC", phase: "OUTER", buf: ""};
  }

  // Mono

  if (c.search(/[A-Z]/) === 0) {
    return {context: "MONO", phase: "UC", buf: ""};
  }

  // Poly

  if (c.search(/[a-z]/) === 0) {
    return {context: "POLY", phase: "LETTER", buf: ""};
  }

  // Error

  _throw(
    TypeSigError,
    ["invalid type signature"],
    typeSig,
    {fromTo: [n, n], desc: ["unexpected symbol"]}
  );
};


const lookAheadMap = (typeSig) => {
  const aux = (n, {context}) => {
    const c = typeSig[n],
      next = typeSig[n + 1] || "",
      top = last(context);

    if (c === undefined) return false;
    else if (c === "<") return aux(n + 1, {context: context.concat(">")});
    else if (c === "[") return aux(n + 1, {context: context.concat("]")});
    else if (c === "(") return aux(n + 1, {context: context.concat(")")});
    else if (c === "{") return aux(n + 1, {context: context.concat("}")});
    else if (c === top) return aux(n + 1, {context: context.slice(0, -1)});

    else if (c === ",") {
      if (context.length === 0) return false;
      else return aux(n + 1, {context});
    }

    else if (c === "-") {
      if (next === ">" && context.length === 0) return false;
      else return aux(n + 1, {context});
    }

    else if (c === ":") {
      if (next === ":" && context.length === 0) return true;
      else return aux(n + 1, {context});
    }

    else return aux(n + 1, {context});
  };

  return aux(0, {context: []})
};


const lookAheadFun = typeSig => {
  const aux = (n, {context}) => {
    const c = typeSig[n],
      next = typeSig[n + 1] || "",
      top = last(context);

    if (c === undefined) return false;
    else if (c === "<") return aux(n + 1, {context: context.concat(">")});
    else if (c === "[") return aux(n + 1, {context: context.concat("]")});
    else if (c === "(") return aux(n + 1, {context: context.concat(")")});
    else if (c === "{") return aux(n + 1, {context: context.concat("}")});
    else if (c === top) return aux(n + 1, {context: context.slice(0, -1)});

    else if (c === " ") {
      if (context.length === 0) {
        if (next === ":") return "NAME";
        else if (typeSig[0] === "." ) return "REST";
        else if (typeSig[1] === ")") return "NO_ARG";
        else return "ARG";
      }

      else return aux(n + 1, {context});
    }

    else if (c === ",") {
      if (context.length === 0) return "ARGS";
      else return aux(n + 1, {context});
    }

    else if (c === ")") {
      if (context.length === 0) return "RETURN";
      else return aux(n + 1, {context});
    }

    else return aux(n + 1, {context});
  };

  return aux(0, {context: []})
};


/******************************************************************************
*******************************************************************************
******************************[ 7. UNIFICTAION ]*******************************
*******************************************************************************
******************************************************************************/


const unify = (x, realT, realS, nominalT, nominalS, cons, name, typeSig, bindings) => {
  switch (nominalT.constructor.name) {
    case "AdtT": return unifyAdt(x, realT, realS, nominalT, nominalS, cons, name, typeSig, bindings);
    case "ArrT": return unifyArr(x, realT, realS, nominalT, nominalS, cons, name, typeSig, bindings);
    case "FunT": return unifyFun(x, realT, realS, nominalT, nominalS, cons, name, typeSig, bindings);
    case "_MapT": return unifyMap(x, realT, realS, nominalT, nominalS, cons, name, typeSig, bindings);
    case "MonoT": return unifyMono(x, realT, realS, nominalT, nominalS, cons, name, typeSig, bindings);
    case "PolyT": return unifyPoly(x, realT, realS, nominalT, nominalS, cons, name, typeSig, bindings);
    case "RecT": return unifyRec(x, realT, realS, nominalT, nominalS, cons, name, typeSig, bindings);
    case "TupT": return unifyTup(x, realT, realS, nominalT, nominalS, cons, name, typeSig, bindings);
  }
};


const unifyAdt = (x, realT, realS, nominalT, nominalS, cons, name, typeSig, bindings) => {
  return nominalT.typeReps
    .reduce((bindings_, nominalT_, n) => {
      const nominalS_ = serialize(nominalT_),
        realT_ = realT.typeReps[n],
        realS_ = serialize(realT_);

      return unify(x, realT_, realS_, nominalT_, nominalS_, cons, name, typeSig, bindings_);
    }, bindings);
};


const unifyArr = (x, realT, realS, nominalT, nominalS, cons, name, typeSig, bindings) => {
  return nominalT.typeReps
    .reduce((bindings_, nominalT_, n) => {
      const nominalS_ = serialize(nominalT_),
        realT_ = realT.typeReps[n],
        realS_ = serialize(realT_);

      return unify(x, realT_, realS_, nominalT_, nominalS_, cons, name, typeSig, bindings_);
    }, bindings);
};


const unifyFun = (x, realT, realS, nominalT, nominalS, cons, name, typeSig, bindings) => {
  if (nominalT.typeReps.length < realT.typeReps.length) {
    if (nominalT.isStrict) {
      const [from, to] = nominalT.fromTo;

      _throw(
        ArityError,
        [`${name} expects`],
        typeSig,
        {fromTo: [from, to], desc: [`${realS} received`]}
      );
    }
  }

  else if (nominalT.typeReps.length > realT.typeReps.length) {
    const [from, to] = nominalT.fromTo;

    _throw(
      ArityError,
      [`${name} expects`],
      typeSig,
      {fromTo: [from, to], desc: [`${realS} received`]}
    );
  }

  nominalT.typeReps
    .forEach((xT, n) => {
      switch (xT.constructor.name) {
        case "NoArgT":
        case "ArgT":
        case "RestT": {
          if (xT.constructor.name !== realT.typeReps[n].constructor.name) {
            const [from, to] = nominalT.fromTo;

            _throw(
              ArityError,
              [`${name} expects`],
              typeSig,
              {fromTo: [from, to], desc: [`${realS} received`]}
            );
          }

          else return;
        }

        case "ArgsT": {
          if (xT.constructor.name !== realT.typeReps[n].constructor.name
          || xT.length !== realT.typeReps[n].length) {
            const [from, to] = nominalT.fromTo;

            _throw(
              ArityError,
              [`${name} expects`],
              typeSig,
              {fromTo: [from, to], desc: [`${realS} received`]}
            );
          }

          else return;
        }

        case "ReturnT": return;
      }
    });

  return nominalT.typeReps
    .reduce((bindings_, xT, n) => {
      switch (xT.constructor.name) {
        case "NoArgT": return _binding;

        case "ArgT":
        case "RestT":
        case "ReturnT": {
          const nominalT_ = xT[0],
            nominalS_ = serialize(nominalT_),
            realT_ = realT.typeReps[n][0],
            realS_ = serialize(realT_);

          return unify(x, realT_, realS_, nominalT_, nominalS_, cons, name, typeSig, bindings_);
        }

        case "ArgsT": {
          return xT.reduce((bindings__, yT, m) => {
            const nominalT_ = yT[0],
              nominalS_ = serialize(nominalT_),
              realT_ = realT.typeReps[n][m][0],
              realS_ = serialize(realT_);

            return unify(x, realT_, realS_, nominalT_, nominalS_, cons, name, typeSig, bindings__);
          }, bindings_);
        }
      }
    }, bindings);
};


const unifyMap = (x, realT, realS, nominalT, nominalS, cons, name, typeSig, bindings) => {
  return nominalT.typeReps
    .reduce((bindings_, xT) => {
      const {k: nominalKeyT, v: nominalValT} = xT[0],
        nominalKeyS = serialize(nominalKeyT),
        nominalValS = serialize(nominalValT),
        realKeyT = realT.typeReps[n][0].k,
        realValT = realT.typeReps[n][0].v,
        realKeyS = serialize(realKeyT),
        realValS = serialize(realValT);

      bindings_ = unify(x, realKeyT, realKeyS, nominalKeyT, nominalKeyS, cons, name, typeSig, bindings_);
      return unify(x, realValT, realValS, nominalValT, nominalValS, cons, name, typeSig, bindings_);
    }, bindings);
};


const unifyPoly = (x, realT, realS, nominalT, nominalS, cons, name, typeSig, bindings) => {
  bindings.forEach((v, k) => {
    if (v === nominalS) bindings.set(k, realS);
  });

  if (bindings.has(nominalS)) {
    if (bindings.get(nominalS) === realS) return bindings;

    else {
      const [from, to] = nominalT.fromTo;

      switch (cons) {
        case ArgT: _throw(
          TypeError,
          [`${name} has bound "${nominalS}" to ${bindings.get(nominalS)}`],
          typeSig,
          {fromTo: [from, to], desc: [`${realS} received`]}
        );

        case ReturnT: _throw(
          ReturnTypeError,
          [`${name} has bound "${nominalS}" to ${bindings.get(nominalS)}`],
          typeSig,
          {fromTo: [from, to], desc: [`${realS} returned`]}
        );
      }
    }
  }

  else return bindings.set(nominalS, realS);
};


const unifyMono = (x, realT, realS, nominalT, nominalS, cons, name, typeSig, bindings) => {
  if (nominalS === realS) return bindings;

  else {
    const [from, to] = nominalT.fromTo;

    switch (cons) {
      case ArgT: _throw(
        TypeError,
        [`${name} expects`],
        typeSig,
        {fromTo: [from, to], desc: [`${realS} received`]}
      );

      case ReturnT: _throw(
        ReturnTypeError,
        [`${name} must return`],
        typeSig,
        {fromTo: [from, to], desc: [`${realS} returned`]}
      );
    }
  }
};


const unifyRec = (x, realT, realS, nominalT, nominalS, cons, name, typeSig, bindings) => {
  return nominalT.typeReps
    .reduce((bindings_, xT) => {
      const nominalT_ = xT[0].v,
        nominalS_ = serialize(nominalT_),
        realT_ = realT.typeReps[n][0],
        realS_ = serialize(realT_);

      return unify(x, realT_, realS_, nominalT_, nominalS_, cons, name, typeSig, bindings_);
    }, bindings);
};


const unifyTup = (x, realT, realS, nominalT, nominalS, cons, name, typeSig, bindings) => {
  return nominalT.typeReps
    .reduce((bindings_, xT) => {
      const nominalT_ = xT[0],
        nominalS_ = serialize(nominalT_),
        realT_ = realT.typeReps[n][0],
        realS_ = serialize(realT_);

      return unify(x, realT_, realS_, nominalT_, nominalS_, cons, name, typeSig, bindings_);
    }, bindings);
};


/******************************************************************************
*******************************************************************************
******************************[ 8. CUSTOM TYPES ]******************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
*****[ 8.1. FUNCTIONS ]********************************************************
******************************************************************************/


export const Fun = (typeSig, f) => {
  if (devMode) {
    if (!introspect(typeSig).has("String")) _throw(
      TypeError,
      ["Fun expects"],
      "(String, Function -> Function)",
      {fromTo: [1, 6], desc: [`${introspect1(typeSig)} received`]}
    );

    else if (!introspect(f).has("Function")) _throw(
      TypeError,
      ["Fun expects"],
      "(String, Function -> Function)",
      {fromTo: [9, 8], desc: [`${introspect1(f)} received`]}
    );

    const typeRep = deserialize(typeSig);
    Reflect.defineProperty(f, "name", {value: typeRep.name});
    return new Proxy(f, handleFun(f, 0, typeRep, typeSig, new Map()));
  }

  else return f;
};


const handleFun = (f, num, typeRep, typeSig, bindings) => {
  const name = f.name || "lambda";

  return {
    apply: (g, _, args) => {
      const {tag, typeReps} = typeRep,
        xT = typeReps[num],
        cons = xT.constructor;

      if (num === 0) bindings = new Map();

      switch (cons.name) {
        case "NoArgT": {
          verifyNullary(args, xT, name, typeSig);
          break;
        }

        case "ArgT": {
          verifyUnary(args, xT[0], name, typeSig);
          bindings = verifyArgT(args[0], xT[0], name, typeSig, bindings);
          break;
        }

        case "ArgsT": {
          const params = verifyNAry(args, xT, name, typeSig);
          bindings = verifyArgsT(args, xT, params, name, typeSig, bindings);
          break;
        }

        case "RestT": {
          bindings = verifyRestT(args, xT[0], name, typeSig, bindings);
          break;
        }
      }

      if (typeReps[num + 1].constructor.name === "ReturnT") {
        const r = g(...args);

        if (getStringTag(r) === "Adt") {
          const [rep, sig] = constructType(r, bindings);
          r[TYPE_REP] = rep;
          r[TYPE_SIG] = sig;
        }

        return verifyReturnT(r, typeReps[num + 1][0], name, typeSig, bindings);
      }

      else {
        const h = g(...args);
        Reflect.defineProperty(h, "name", {value: f.name});
        return new Proxy(h, handleFun(f, num + 1, typeRep, typeSig, bindings));
      }
    },

    get: (f, k, p) => {
      switch (k) {
        case "toString": return () => typeSig;
        case Symbol.toStringTag: return "Fun";
        case TYPE_REP: return typeRep;
        case TYPE_SIG: return typeSig;

        case Symbol.toPrimitive: return hint => {
          _throw(
            TypeError,
            ["illegal implicit type conversion"],
            typeSig,
            {desc: [
              `must not be converted to ${capitalize(hint)} primitive`,
              "use explicit type casts instead"
            ]}
          );          
        };

        default: {
          if (k in f) return f[k];

          else _throw(
            TypeError,
            ["illegal property access"],
            typeSig,
            {desc: [`unknown property ${preformatK(k)}`]}
          );
        }
      }
    },

    has: (f, k, p) => {
      switch (k) {
        case TYPE_SIG: return true;
        case TYPE_REP: return true;

        default: _throw(
          TypeError,
          ["illegal property introspection"],
          typeSig,
          {desc: [
            `of property ${preformatK(k)}`,
            "duck typing is not allowed"
          ]}
        );
      }
    },

    set: (o, k, v, p) => {
      switch (k) {
        case "toString": return o[k] = v, o;

        default: _throw(
          TypeError,
          ["illegal property mutation"],
          typeSig,
          {desc: [
            `of property ${preformatK(k)} with type ${infer(v)}`,
            "function Objects are immutable"
          ]}
        );
      }
    },

    defineProperty: (f, k, d) => {
      _throw(
        TypeError,
        ["illegal property mutation"],
        typeSig,
        {desc: [
          `of property ${preformatK(k)} with type ${infer(d.value)}`,
          "function Objects are immutable"
        ]}

      );
    },

    deleteProperty: (f, k) => {
      _throw(
        TypeError,
        ["illegal property mutation"],
        typeSig,
        {desc: [
          `removal of property ${preformatK(k)}`,
          "function Objects are immutable"
        ]}
      );
    },

    ownKeys: f => {
      _throw(
        TypeError,
        ["illegal property introspection"],
        typeSig,
        {desc: [
          `of property ${preformatK(k)}`,
          "meta programming is not allowed"
        ]}
      );
    }
  };
};


const verifyNullary = (args, noArgT, name, typeSig) => {
  const [from, to] = noArgT.fromTo;

  if (args.length !== 0) _throw(
    ArityError,
    [`${name} expects 0 arguments`],
    typeSig,
    {fromTo: [from, to], desc: [`${args.length} argument(s) received`]}
  );
};


const verifyUnary = (args, xT, name, typeSig) => {
  const [from, to] = xT.fromTo;

  if (args.length !== 1) _throw(
    ArityError,
    [`${name} expects 1 argument`],
    typeSig,
    {fromTo: [from, to], desc: [`${args.length} argument(s) received`]}
  );
};


const verifyNAry = (args, xT, name, typeSig) => {
  const [from, to] = xT.fromTo;

  const params = xT
    .reduce(({mandatory: m, rest: r}, param) => {
      if (param.constructor.name === "ArgT") return {mandatory: m + 1, rest: r};
      else if (param.constructor.name === "RestT") return {mandatory: m, rest: r + 1};
      else return {mandatory: m, rest: r};
    }, {mandatory: 0, rest: 0});

  if (params.rest === 1) {
    if (params.mandatory > args.length) _throw(
      ArityError,
      [`${name} expects at least ${params.mandatory} argument(s)`],
      typeSig,
      {fromTo: [from, to], desc: [`${args.length} argument(s) received`]}
    );
  }

  else {
    if (params.mandatory !== args.length) _throw(
      ArityError,
      [`${name} expects ${params.mandatory} argument(s)`],
      typeSig,
      {fromTo: [from, to], desc: [`${args.length} argument(s) received`]}
    );
  }

  return params;
};


const verifyArgT = (arg, nominalT, name, typeSig, bindings) => {
  const [from, to] = nominalT.fromTo,
    nominalS = serialize(nominalT),
    realSigs = introspect(arg),
    realS = nextVal(realSigs.values()),
    realT = deserialize(realS);

  if (nominalT.constructor.name !== "PolyT"
  && nominalT.tag !== realT.tag) _throw(
    TypeError,
    [`${name} expects`],
    typeSig,
    {fromTo: [from, to], desc: [`${realS} received`]}
  );

  else if (nominalS.search(/\b[a-z]\b/) >= 0
  || realS.search(/\b[a-z]\b/) >= 0) return unify(arg, realT, realS, nominalT, nominalS, ArgT, name, typeSig, bindings);

  else {
    if (realSigs.has(nominalS)) return bindings;

    else _throw(
      TypeError,
      [`${name} expects`],
      typeSig,
      {fromTo: [from, to], desc: [`${realS} received`]}
    );
  }
};


const verifyRestT = (args, nominalT, name, typeSig, bindings) => {
  const [from, to] = nominalT.fromTo,
    nominalS = serialize(nominalT);

  return args
    .reduce((bindings_, arg, n) => {
      const realSigs = introspect(arg),
        realS = nextVal(realSigs.values()),
        realT = deserialize(realS);

      if (nominalT.constructor.name !== "PolyT"
      && nominalT.tag !== realT.tag) _throw(
        TypeError,
        [`${name} expects`],
        typeSig,
        {fromTo: [from, to], desc: [`${realS} received`]}
      );

      else if (nominalS.search(/\b[a-z]\b/) >= 0
      || realS.search(/\b[a-z]\b/) >= 0) return unify(arg, realT, realS, nominalT, nominalS, ArgT, name, typeSig, bindings_);

      else {
        if (realSigs.has(nominalS)) return bindings_;

        else _throw(
          TypeError,
          [`${name} expects`],
          typeSig,
          {fromTo: [from, to], desc: [`${realS} received at index ${n}`]}
        );
      }
    }, bindings);
};


const verifyArgsT = (args, argsT, params, name, typeSig, bindings) => {
  if (params.rest === 1) {
    bindings = args
      .slice(0, params.mandatory)
      .reduce((bindings_, arg, n) => {
        const nominalT = argsT[n][0],
          [from, to] = nominalT.fromTo,
          nominalS = serialize(nominalT),
          realSigs = introspect(arg),
          realS = nextVal(realSigs.values()),
          realT = deserialize(realS);

        if (nominalT.constructor.name !== "PolyT"
        && nominalT.tag !== realT.tag) _throw(
          TypeError,
          [`${name} expects`],
          typeSig,
          {fromTo: [from, to], desc: [`${realS} received`]}
        );

        else if (nominalS.search(/\b[a-z]\b/) >= 0
        || realS.search(/\b[a-z]\b/) >= 0) return unify(arg, realT, realS, nominalT, nominalS, ArgT, name, typeSig, bindings_);

        else {
          if (realSigs.has(nominalS)) return bindings_;

          else _throw(
            TypeError,
            [`${name} expects`],
            typeSig,
            {fromTo: [from, to], desc: [`${realS} received`]}
          );
        }
      }, bindings);

    const nominalT = last(argsT)[0],
      nominalS = serialize(nominalT),
      [from, to] = nominalT.fromTo;

    return args
      .slice(params.mandatory)
      .reduce((bindings_, arg, n) => {
        const realSigs = introspect(arg),
          realS = nextVal(realSigs.values()),
          realT = deserialize(realS);

        if (nominalT.constructor.name !== "PolyT"
        && nominalT.tag !== realT.tag) _throw(
          TypeError,
          [`${name} expects`],
          typeSig,
          {fromTo: [from, to], desc: [`${realS} received`]}
        );

        else if (nominalS.search(/\b[a-z]\b/) >= 0
        || realS.search(/\b[a-z]\b/) >= 0) return unify(arg, realT, realS, nominalT, nominalS, ArgT, name, typeSig, bindings_);

        else {
          if (realSigs.has(nominalS)) return bindings_;

          else _throw(
            TypeError,
            [`${name} expects`],
            typeSig,
            {fromTo: [from, to], desc: [`${realS} received at index ${params.mandatory + n}`]}
          );
        }
      }, bindings);
  }

  else {
    return args
      .reduce((bindings_, arg, n) => {
        const nominalT = argsT[n][0],
          [from, to] = nominalT.fromTo,
          nominalS = serialize(nominalT),
          realSigs = introspect(arg),
          realS = nextVal(realSigs.values()),
          realT = deserialize(realS);

        if (nominalT.constructor.name !== "PolyT"
        && nominalT.tag !== realT.tag) _throw(
          TypeError,
          [`${name} expects`],
          typeSig,
          {fromTo: [from, to], desc: [`${realS} received`]}
        );

        else if (nominalS.search(/\b[a-z]\b/) >= 0
        || realS.search(/\b[a-z]\b/) >= 0) return unify(arg, realT, realS, nominalT, nominalS, ArgT, name, typeSig, bindings_);

        else {
          if (realSigs.has(nominalS)) return bindings_;

          else _throw(
            TypeError,
            [`${name} expects`],
            typeSig,
            {fromTo: [from, to], desc: [`${realS} received`]}
          );
        }
      }, bindings);
  }
};


const verifyReturnT = (r, nominalT, name, typeSig, bindings) => {
  const [from, to] = nominalT.fromTo,
    nominalS = serialize(nominalT),
    realSigs = introspect(r),
    realS = nextVal(realSigs.values()),
    realT = deserialize(realS);

  if (nominalT.constructor.name !== "PolyT"
  && nominalT.tag !== realT.tag) _throw(
    ReturnTypeError,
    [`${name} expects`],
    typeSig,
    {fromTo: [from, to], desc: [`${realS} received`]}
  );

  else if (nominalS.search(/\b[a-z]\b/) >= 0
  || realS.search(/\b[a-z]\b/) >= 0) {
    unify(r, realT, realS, nominalT, nominalS, ReturnT, name, typeSig, bindings);
    return r;
  }

  else {
    if (realSigs.has(nominalS)) return r;

    else _throw(
      ReturnTypeError,
      [`${name} must return`],
      typeSig,
      {fromTo: [from, to], desc: [`${realS} returned`]}
    );
  }
};


/******************************************************************************
*****[ 8.2. ALGEBRAIC DATA TYPES ]*********************************************
******************************************************************************/


export const Adt = (tcons, typeSig, ...cases) => {
  const typeRep = deserialize(typeSig),
    tvars = typeSig.match(/\b[a-z]\b/g);

  if (devMode) {
    const typeSigs = new Map();

    cases.forEach(vcons => {
      if (TYPE_SIG in vcons) {
        const typeSig_ = vcons[TYPE_SIG],
          typeRep_ = deserialize(typeSig_);

        if (typeSig_.search(/^\([a-z0-9_]+ :: /i) !== 0) _throw(
          TypeError,
          [`value constructors must have a named type annotations`],
          `(name :: ${typeSig_.slice(1)}`,
          {fromTo: [1, 8]}
        );

        else if (typeSig_.search(/^\(_?[A-Z]/) !== 0) _throw(
          TypeError,
          [`value constructors must have capitalized names`],
          typeSig_,
          {fromTo: [1, 1]}
        );

        const tvars_ = typeSig_.match(/\b[a-z]\b/g);

        tvars_.forEach(tvar => {
          if (!tvars.includes(tvar)) {
            const from = typeSig_.search(new RegExp(`\\b${tvar}\\b`)),
              to = from;

            _throw(
              TypeError,
              [`invalid value constructor for type "${typeSig}"`],
              typeSig_,
              {fromTo: [from, to], desc: ["type variable out of scope"]}
            );
          }
        });
      
        if (serialize(last(typeRep_.typeReps)[0]) !== typeSig) {
          const [from, to] = last(typeRep_.typeReps)[0].fromTo;

          _throw(
            TypeError,
            [`invalid value constructor`],
            typeSig_,
            {fromTo: [from, to], desc: [`${typeRep_.name} must return values of type "${typeSig}"`]}
          );
        }

        typeSigs.set(typeRep_.name, typeSig_);
      }

      else _throw(
        TypeError,
        [`invalid value constructor`],
        "missing type annotation",
        {desc: [`${typeRep_.name} must be a typed function`]}
      );
    });

    return f => {
      const adt = new Proxy(new tcons(), handleAdt(typeRep, typeSig, typeSigs));
      adt.run = cases_ => f(cases_);
      return adt;
    };
  }

  else return f => {
    const adt = new tcons();
    adt.run = cases_ => f(cases_);
    return adt;
  }
};


const handleAdt = (typeRep, typeSig, typeSigs) => ({
  get: (o, k, p) => {
    switch (k) {
      case "run": return cases => {
        Object.keys(cases).forEach(k => {
          if (!typeSigs.has(k)) _throw(
            TypeError,
            [`illegal application of type "${typeSig}"`],
            Array.from(typeSigs).map(([k, v]) => `${k}: ${v}`).join("\n"),
            {desc: [`unnecessary case "${k}"`]}
          );

          else if (!(TYPE_REP in cases[k])) _throw(
            TypeError,
            [`illegal application of type "${typeSig}"`],
            Array.from(typeSigs).map(([k, v]) => `${k}: ${v}`).join("\n"),
            {desc: [`case "${k}" is associated with an untyped value`]}
          );

          else if (cases[k][TYPE_REP].tag !== "Fun") _throw(
            TypeError,
            [`illegal application of type "${typeSig}"`],
            Array.from(typeSigs).map(([k, v]) => `${k}: ${v}`).join("\n"),
            {desc: [`case "${k}" is associated with a non-function value`]}
          );
        });

        typeSigs.forEach((v, k) => {
          if (!(k in cases)) _throw(
            TypeError,
            [`illegal application of type "${typeSig}"`],
            Array.from(typeSigs).map(([k, v]) => `${k}: ${v}`).join("\n"),
            {desc: [`missing case "${k}"`]}
          );

          match(k, v, cases[k] [TYPE_REP], cases[k] [TYPE_SIG]);
        });

        return o.run(cases);
      }

      case "toString": return () => typeSig;
      case Symbol.toStringTag: return "Adt";
      case TYPE_REP: return typeRep;
      case TYPE_SIG: return typeSig;

      case Symbol.toPrimitive: return hint => {
        _throw(
          TypeError,
          ["illegal implicit type conversion"],
          typeSig,
          {desc: [
            `must not be converted to ${capitalize(hint)} primitive`,
            "use explicit type casts instead"
          ]}
        );
      };

      default: {
        if (k in o) return o[k];

        else _throw(
          TypeError,
          ["illegal property access"],
          typeSig,
          {desc: [`unknown property ${preformatK(k)}`]}
        );
      }
    }
  },

  has: (o, k, p) => {
    switch (k) {
      case TYPE_SIG: return true;
      case TYPE_REP: return true;

      default: _throw(
        TypeError,
        ["illegal property introspection"],
        typeSig,
        {desc: [
          `of property ${preformatK(k)}`,
          "duck typing is not allowed"
        ]}
      );
    }
  },

  set: (o, k, v, p) => {
    switch (k) {
      case "toString":
      case "run": return o[k] = v, o;
      
      case TYPE_REP: return typeRep = v, o; 
      case TYPE_SIG: return typeSig = v, o;

      default: _throw(
        TypeError,
        ["illegal property mutation"],
        typeSig,
        {desc: [
          `of property ${preformatK(k)} with type ${infer(v)}`,
          "function Objects are immutable"
        ]}
      );
    }
  },

  defineProperty: (o, k, d) => {
    _throw(
      TypeError,
      ["illegal property mutation"],
      typeSig,
      {desc: [
        `of property ${preformatK(k)} with type ${infer(d.value)}`,
        "function Objects are immutable"
      ]}

    );
  },

  deleteProperty: (o, k) => {
    _throw(
      TypeError,
      ["illegal property mutation"],
      typeSig,
      {desc: [
        `removal of property ${preformatK(k)}`,
        "function Objects are immutable"
      ]}
    );
  },

  ownKeys: o => {
    _throw(
      TypeError,
      ["illegal property introspection"],
      typeSig,
      {desc: [
        `of property ${preformatK(k)}`,
        "meta programming is not allowed"
      ]}
    );
  }
});


const constructType = (adt, bindings) => {
  let rep, sig = adt[TYPE_SIG];

  bindings.forEach((v, k) => {
    sig = adt[TYPE_SIG].replace(new RegExp(`\\b${k}\\b`), v);
  });

  rep = deserialize(sig);
  return [rep, sig];
};


const match = (_case, nominalS, realT, realS) => {
  const nominalT = deserialize(nominalS);

  if (nominalT.typeReps.length !== realT.typeReps.length) {
    const [from, to] = nominalT.fromTo;

    _throw(
      ArityError,
      [`Adt case ${_case} expects`],
      nominalS,
      {fromTo: [from, to], desc: [`${realS} received`]}
    );
  }

  nominalT.typeReps
    .forEach((xT, n) => {
      switch (xT.constructor.name) {
        case "NoArgT":
        case "ArgT":
        case "RestT": {
          if (xT.constructor.name !== realT.typeReps[n].constructor.name) {
            const [from, to] = nominalT.fromTo;

            _throw(
              ArityError,
              [`Adt case ${_case} expects`],
              nominalS,
              {fromTo: [from, to], desc: [`${realS} received`]}
            );
          }

          else return;
        }

        case "ArgsT": {
          if (xT.constructor.name !== realT.typeReps[n].constructor.name
          || xT.length !== realT.typeReps[n].length) {
            const [from, to] = nominalT.fromTo;

            _throw(
              ArityError,
              [`Adt case ${_case} expects`],
              nominalS,
              {fromTo: [from, to], desc: [`${realS} received`]}
            );
          }

          else return;
        }

        case "ReturnT": return;
      }
    });

  const aux = (nT, rT) => {
    nT.typeReps.forEach((nT_, n) => {
      const rT_ = rT.typeReps[n];

      switch (nT_.constructor.name) {
        case "NoArgT": return;

        case "ArgT":
        case "RestT": return aux(nT_[0], rT_[0]);

        case "ArgsT": return nT_.forEach((nT__, m) => {
          return aux(nT__[0], rT_[m] [0]);
        });

        case "ReturnT": return;

        case "MonoT": {
          if (nT_.tag === rT_.tag) return;

          else {
            const [from, to] = nT_.fromTo;

            _throw(
              TypeError,
              [`Adt case "${_case}" expects`],
              nominalS,
              {fromTo: [from, to], desc: [`"${serialize(rT_)}" received`]}
            );
          }
        }

        case "PolyT": return;

        default: {
          if (nT_.tag === rT_.tag) {
            return aux(nT_.typeReps, rT_.typeReps);
          }

          else {
            const [from, to] = nT_.fromTo;

            _throw(
              TypeError,
              [`Adt case "${_case}" expects`],
              nominalS,
              {fromTo: [from, to], desc: [`${serialize(rT_)} received`]}
            );
          }
        }
      }
    });
  };

  aux(nominalT, realT);
};


/******************************************************************************
*****[ 8.3. ARRAYS ]***********************************************************
******************************************************************************/


const _Arr = ({immu = false, sig = ""}) => xs => {
  if (devMode) {
    if (!introspect(xs).has("Array")) _throw(
      TypeError,
      ["Arr expects an Array"],
      introspect1(xs),
      {desc: ["received"]}
    );

    else if (TYPE_REP in xs) _throw(
      TypeError,
      ["Arr expects an untyped Array"],
      xs[TYPE_SIG],
      {desc: ["received (illegal retyping)"]}
    );

    let typeSig = infer(xs);

    if (xs.length === 0) {
      if (sig === "") _throw(
        TypeError,
        ["Arr received an empty Array without type annotation"],
        "[?]",
        {desc: ["explicit type annotation necessary"]}
      );

      else typeSig = sig;
    }

    const typeRep = deserialize(typeSig),
      voidPattern = new RegExp(`\\b(?:${Object.keys(VOID).join("|")})\\b`);

    if (typeRep.typeReps.length > 1) _throw(
      TypeError,
      ["Arr excepts homogeneous Array"],
      typeSig,
      {desc: [`mixed typed values received`]}
    );

    else if (typeSig.search(voidPattern) !== -1) {
      const {index: from, 0: match} = typeSig.match(voidPattern),
        to = from + match.length - 1;

      _throw(
        TypeError,
        ["Arr must not contain void values"],
        typeSig,
        {fromTo: [from, to], desc: [`${match} received`]}
      );
    }

    return new Proxy(xs, handleArr(typeRep, typeSig, immu));
  }

  else return xs;
};


export const Arr = _Arr({});


export const Iarr = _Arr({immu: true})


export const Earr = typeSig => _Arr({sig: typeSig});


const handleArr = (typeRep, typeSig, immu) => ({
  get: (xs, i, p) => {
    switch (i) {
      case "toString": return () => typeSig;
      case Symbol.toStringTag: return "Arr";
      case Symbol.isConcatSpreadable: return xs[Symbol.isConcatSpreadable];
      case TYPE_REP: return typeRep;
      case TYPE_SIG: return typeSig;

      case Symbol.toPrimitive: return hint => {
        _throw(
          TypeError,
          ["illegal implicit type conversion"],
          typeSig,
          {desc: [
            `must not be converted to ${capitalize(hint)} primitive`,
            "use explicit type casts instead"
          ]}
        );
      };

      default: {
        if (i in xs) return xs[i];

        else _throw(
          TypeError,
          ["illegal property access"],
          typeSig,
          {desc: [`unknown property ${preformatK(i)}`]}
        );
      }
    }
  },

  has: (xs, i, p) => {
    if (Number.isNaN(Number(i))) {
      switch (i) {
        case TYPE_SIG: return true;
        case TYPE_REP: return true;

        default: _throw(
          TypeError,
          ["illegal property introspection"],
          typeSig,
          {desc: [
            `of property ${preformatK(i)}`,
            "duck typing is not allowed"
          ]}
        );
      }
    }

    else return i in xs;
  },

  set: (xs, i, v, p) => setArr(typeRep, typeSig, immu, xs, i, {value: v}, "set"),
  defineProperty: (xs, i, d) => setArr(typeRep, typeSig, immu, xs, i, d, "def"),

  deleteProperty: (xs, i) => {
    if (immu) _throw(
      TypeError,
      ["illegal property deletion"],
      typeSig,
      {desc: [
        `of property ${preformatK(i)}`,
        "immutable Array"
      ]}
    );

    else {
      if (Number.isNaN(Number(i))) _throw(
        TypeError,
        ["illegal property deletion"],
        typeSig,
        {desc: [
          `of property ${preformatK(i)}`,
          "do not use Arrays as Objects"
        ]}
      );

      else {
        if (Number(i) !== xs.length - 1) _throw(
          TypeError,
          ["illegal property deletion"],
          typeSig,
          {desc: [
            `of property ${preformatK(i)}`,
            `where Array includes ${xs.length} elements`,
            "operation causes index gap"
          ]}
        );
      }

      delete xs[i];
      return true;
    }
  },

  ownKeys: xs => _throw(
    TypeError,
    ["illegal property introspection"],
    typeSig,
    {desc: [
      `of property ${preformatK(i)}`,
      "meta programming is not allowed"
    ]}
  )
});


const setArr = (typeRep, typeSig, immu, xs, i, d, mode) => {
  if (immu) _throw(
    TypeError,
    ["illegal property mutation"],
    typeSig,
    {desc: [
      `of property ${preformatK(i)} with type ${infer(d.value)}`,
      "immutable Array"
    ]}
  );

  else {
    if (Number.isNaN(Number(i))) _throw(
      TypeError,
      ["illegal property setting"],
      typeSig,
      {desc: [
        `of property ${preformatK(i)} with type ${infer(d.value)}`,
        "do not use Arrays as Objects"
      ]}
    );

    else {
      if (Number(i) > xs.length) _throw(
        TypeError,
        ["illegal property setting"],
        typeSig,
        {desc: [
          `of property ${preformatK(i)} with type ${infer(d.value)}`,
          `where Array includes only ${xs.length} elements`,
          "index gaps are not allowed"
        ]}
      );

      else if (typeSig !== `[${infer(d.value)}]`) {
        const [from, to] = typeRep.typeReps[0].fromTo;

        _throw(
          TypeError,
          ["illegal property mutation"],
          typeSig,
          {fromTo: [from, to], desc: [
            `of property ${preformatK(i)} with type ${infer(d.value)}`,
            "heterogeneous Arrays are not allowed"
          ]}
        );
      }

      else {
        if (mode === "set") xs[i] = d.value;
        else Reflect.defineProperty(xs, i, d);
        return true;
      }
    }
  }
};


/******************************************************************************
*****[ 8.4. TUPLES ]***********************************************************
******************************************************************************/


const _Tup = ({immu = false}) => xs => {
  if (devMode) {
    if (!introspect(xs).has("Array")) _throw(
      TypeError,
      ["Tup expects an Array"],
      introspect1(xs),
      {desc: ["received"]}
    );

    else if (TYPE_REP in xs) _throw(
      TypeError,
      ["Tup expects an untyped Array"],
      xs[TYPE_SIG],
      {desc: ["received (illegal retyping)"]}
    );

    const typeSig = infer(xs);

    if (xs.length < 2) _throw(
      TypeError,
      ["Tup received an invalid Array"],
      typeSig,
      {fromTo: [0, typeSig.length - 1], desc: ["Tuples must comprise at least 2 fields"]}
    );

    const typeRep = deserialize(typeSig),
      voidPattern = new RegExp(`\\b(?:${Object.keys(VOID).join("|")})\\b`);

    if (typeSig.search(voidPattern) !== -1) {
      const {index: from, 0: match} = typeSig.match(voidPattern),
        to = from + match.length - 1;

      _throw(
        TypeError,
        ["Tup must not contain void values"],
        typeSig,
        {fromTo: [from, to], desc: [`${match} received`]}
      );
    }

    return new Proxy(xs, handleTup(typeRep, typeSig, immu));
  }

  else return xs;
};


export const Tup = _Tup({});


export const Itup = _Tup({immu: true});


const handleTup = (typeRep, typeSig, immu) => ({
  get: (xs, i, p) => {
    switch (i) {
      case "toString": return () => typeSig;
      case Symbol.toStringTag: return "Tup";
      case Symbol.isConcatSpreadable: return xs[Symbol.isConcatSpreadable];
      case TYPE_REP: return typeRep;
      case TYPE_SIG: return typeSig;

      case Symbol.toPrimitive: return hint => {
        _throw(
          TypeError,
          ["illegal implicit type conversion"],
          typeSig,
          {desc: [
            `must not be converted to ${capitalize(hint)} primitive`,
            "use explicit type casts instead"
          ]}
        );
      };

      default: {
        if (i in xs) return xs[i];

        else _throw(
          TypeError,
          ["illegal property access"],
          typeSig,
          {desc: [`unknown property ${preformatK(i)}`]}
        );
      }
    }
  },

  has: (xs, i, p) => {
    switch (i) {
      case TYPE_SIG: return true;
      case TYPE_REP: return true;

      default: _throw(
        TypeError,
        ["illegal property introspection"],
        typeSig,
        {desc: [
          `of property ${preformatK(i)}`,
          "duck typing is not allowed"
        ]}
      );
    }
  },

  set: (xs, i, v, p) => setTup(typeRep, typeSig, immu, xs, i, {value: v}, "set"),
  defineProperty: (xs, i, d) => setTup(typeRep, typeSig, immu, xs, i, d, "def"),

  deleteProperty: (xs, i) => _throw(
    TypeError,
    ["illegal property deletion"],
    typeSig,
    {desc: [
      `of property ${preformatK(i)}`,
      "Tuples are either immutable or sealed"
    ]}
  ),

  ownKeys: xs => _throw(
    TypeError,
    ["illegal property introspection"],
    typeSig,
    {desc: [
      `of property ${preformatK(i)}`,
      "meta programming is not allowed"
    ]}
  )
});


const setTup = (typeRep, typeSig, immu, xs, i, d, mode) => {
  if (immu) _throw(
    TypeError,
    ["illegal property mutation"],
    typeSig,
    {desc: [
      `of property ${preformatK(i)} with type ${infer(d.value)}`,
      "immutable Tuple"
    ]}
  );

  else {
    if (Number.isNaN(Number(i))) _throw(
      TypeError,
      ["illegal property setting"],
      typeSig,
      {desc: [
        `of property ${preformatK(i)} with type ${infer(d.value)}`,
        "do not use Tuples as Objects"
      ]}
    );

    else {
      if (Number(i) >= xs.length) _throw(
        TypeError,
        ["illegal property setting"],
        typeSig,
        {desc: [
          `of property ${preformatK(i)} with type ${infer(d.value)}`,
          `where Tuple includes only ${xs.length} fields`,
          "sealed Tuple"
        ]}
      );

      else if (serialize(typeRep.typeReps[i]) !== `${infer(d.value)}`) {
        const [from, to] = typeRep.typeReps[0].fromTo;

        _throw(
          TypeError,
          ["illegal property mutation"],
          typeSig,
          {fromTo: [from, to], desc: [
            `of property ${preformatK(i)} with type ${infer(d.value)}`,
            "fields must maintain their type"
          ]}
        );
      }

      else {
        if (mode === "set") xs[i] = d.value;
        else Reflect.defineProperty(xs, i, d);
        return true;
      }
    }
  }
};


/******************************************************************************
*****[ 8.5. MAPS ]*************************************************************
******************************************************************************/


const _Map = (typeSig, ix) => {
  if (devMode) {
    const m = new Map();

    for (let pair of ix) {
      isNotVoid(pair[0]);
      isNotVoid(pair[1]);
      m.set(pair[0], pair[1]);
    }

    const p = new Proxy(m, handleMap(typeSig));
    return p.typeSig = typeSig, p;
  }

  else return new Map(ix);
};


const handleMap = typeSig => ({
  get: (o, k, p) => {
    switch (k) {
      case "get": return k => {
        if (devMode) {
          const r = o.get(isNotVoid(k));
          return isNotVoid(r);
        }

        else return o.get(k);
      }

      case "has": return k => {
        return o.has(devMode ? isNotVoid(k) : k);
      }

      case "set": return (k, v) => {
        if (devMode) {
          o.set(isNotVoid(k), isNotVoid(v));
          return p;
        }

        else return o.set(k, v);
      }

      case "delete": return k => {
        if (devMode) {
          if (!p.has(k)) throw new TypeError("know your type");
          else o.delete(k);
          return p;
        }

        else return o.delete(k);
      }

      case "toString": return () => typeSig;
      case Symbol.toPrimitive: throw new TypeError("implicit type coercion");

      default: {
        if (k in o) return o[k];
        else throw new TypeError("know your type!");
      }
    }
  }
});


/******************************************************************************
*****[ 8.6. RECORDS ]**********************************************************
******************************************************************************/


const Rec = (o, {immu = false}) => {
  if (devMode) {
    const ks = Object.keys(o);

    Reflect.defineProperty(
      o,
      Symbol.toStringTag,
      {value: "Rec"}
    );

    const typeRep = introspect(o),
      typeSig = serialize(typeRep);

    Reflect.defineProperty(
      o,
      Symbol("typeSig"),
      {value: typeSig}
    );

    if (ks.length < 2) throw new TypeError(
      "Rec expects\n\n" +
      `${typeSig}\n` +
      `${ul(1, typeSig.length - 2)}\n\n` +
      "records must include at least 2 fields\n"
    );

    ks.forEach(k => isNotVoid(k), isNotVoid(o[k]));
    return new Proxy(o, handleRec(typeRep, typeSig, immu));
  }

  else return o;
};


const handleRec = (typeRep, typeSig, immu) => ({
  get: (o, k, p) => {
    switch (k) {
      case "toString": return () => typeSig;
      case Symbol.toStringTag: return "Rec";
      case "typeRep": return typeRep;
      case "typeSig": return typeSig;

      case Symbol.toPrimitive: return hint => {
        throw new TypeError(
          "illegal implicit type coercion applied to record\n\n" +
          `${typeSig}\n\n` +
          `should have been converted to ${hint} primitive\n\n` +
          "use explicit type casts instead\n"
        );
      };

      default: {
        if (k in o) return o[k];

        else throw new TypeError(
          "illegal field access on record\n\n" +
          `${typeSig}\n\n` +
          `unknown field ${preformatK(k)}\n`
        );
      }
    }
  },

  has: (o, k, p) => {
    throw new TypeError(
      "illegal record introspection through\n\n" +
      `${preformatK(k)} in ${typeSig}\n\n` +
      "duck typing is not allowed\n"
    );
  },

  set: (o, k, v, p) => {
    if (immu) {
      throw new TypeError(
        "illegal record mutation\n\n" +
        `${typeSig} [${preformatK(k)}] = ${serialize(introspect(v))}\n\n` +
        "immutable record\n"
      );
    }

    else {
      if (k in o) {
        if (typeSig !== `{${serialize(introspect(v))}}`) throw new TypeError(
          "illegal record mutation\n\n" +
          `${typeSig} [${preformatK(k)}] = ${serialize(introspect(v))}\n\n` +
          `${ul(1, typeSig.length - 2)}\n\n` +
          "record fields must maintain their types\n"
        );

        else return o[k] = v;
      }

      else {
        throw new TypeError(
          "illegal record mutation\n\n" +
          `${typeSig} [${preformatK(k)}] = ${serialize(introspect(v))}\n\n` +
          "records are sealed\n"
        );
      }
    }
  },

  defineProperty: (o, k, d) => {
    throw new TypeError(
      "illegal use of reflection method on record\n\n" +
      `${typeSig}\n\n` +
      `at property ${preformatK(i)}\n\n` +
      "reflection must not be used\n"
    );
  },

  deleteProperty: (o, k) => {
    throw new TypeError(
      "illegal record mutation\n\n" +
      `delete ${typeSig} . ${preformatK(k)} or\n\n` +
      `Reflect.deleteProperty(${typeSig}, ${preformatK(k)})\n\n` +
      "records are sealed\n"
    );
  },

  ownKeys: o => {
    throw new TypeError(
      "illegal record reflection method\n\n" +
      `Object.keys(${typeSig}) or\n\n` +
      `Object.values(${typeSig}) or\n\n` +
      `Object.entries(${typeSig})\n\n` +
      "reflection must not be used\n"
    );
  }
});


/******************************************************************************
*****[ 8.7. SUBTYPES ]*********************************************************
******************************************************************************/


class Int extends Number {
  [Symbol.toPrimitive](t) {
    throw new Error("coerced!");
  }
}


/******************************************************************************
*****[ 8.8. ERRORS ]***********************************************************
******************************************************************************/


//---[ Subtypes ]--------------------------------------------------------------


class DevModeError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, DevModeError);
  }
};


class ArityError extends DevModeError {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ArityError);
  }
};


class ReturnTypeError extends DevModeError {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ReturnTypeError);
  }
};


class TypeInferenceError extends DevModeError {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, TypeInferenceError);
  }
};


class TypeRepError extends DevModeError {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, TypeRepError);
  }
};


class TypeSigError extends DevModeError {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, TypeSigError);
  }
};


//---[ Formatting ]------------------------------------------------------------


const ul = (n, m) => Array(n + 1).join(" ") + Array(m - n + 2).join("^");


const preformatK = x => {
  const tag = getStringTag(x);
  
  if (tag === "Symbol") return x.toString();
  else if (tag === "String" && Number.isNaN(Number(x))) return `"${x}"`;
  else return x;
};


const preformatV = x => {
  const tag = getStringTag(x);
  
  if (tag === "Symbol") return x.toString();
  else if (tag === "String") return `"${x}"`;
  else return x;
};


const _throw = (Cons, title, subject, {fromTo = [0, -1], desc = []}) => {
  const [from, to] = fromTo;

  throw new Cons(title
    .join("\n")
    .concat(`\n\n${subject}`)
    .concat(fromTo.length === 2 ? `\n${ul(from, to)}` : "")
    .concat(desc.length === 0 ? "" : `\n\n${desc.join("\n\n")}`)
    .concat("\n")
  );
};


/******************************************************************************
*******************************************************************************
*****************************[ 9. MISCALLANIOUS ]******************************
*******************************************************************************
******************************************************************************/


const capitalize = s => s[0].toUpperCase() + s.slice(1);


const last = xs => xs[xs.length - 1];


/******************************************************************************
*******************************************************************************
*****************************[ 10. BUILT-IN TYPES ]*****************************
*******************************************************************************
******************************************************************************/


//***[ 10.1. VALUE TYPES ]******************************************************


//---[ Boolean ]---------------------------------------------------------------


const xor = x => y => !x === !y ? false : true;


//***[ 10.2. REFERENCE TYPES ]**************************************************


//---[ Generator functions ]---------------------------------------------------


function* keys(ix) {
  for (let k of ix) yield k;  
}


function* values(ix) {
  for (let v of ix) yield v;
}


function* entries(ix) {
  for (let kv of ix) yield kv;
}


function* okeys(o) {
  for (let k in o) yield k;  
}


function* ovalues(o) {
  for (let v in o) yield v;
}


function* oentries(o) {
  for (let k in o) yield [k, o[k]];
}


const next = ix => ix.next();


const nextVal = ix => ix.next().value;