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


/******************************************************************************
*****[ 1.1. State ]************************************************************
******************************************************************************/


let types = false;


export const type = b => types = b;


/******************************************************************************
*****[ 1.2. Constants ]********************************************************
******************************************************************************/


const SYM_PREFIX = "ftor/";


const TYPE_REP = Symbol.for(`${SYM_PREFIX}tRep`);


const TYPE_SIG = Symbol.for(`${SYM_PREFIX}tSig`);


const TUP_MAX_FIELDS = 16;


const VOID = {Undefined: undefined, Null: null, NaN: NaN};


/******************************************************************************
*******************************************************************************
*****************************[ 2. INTROSPECTION ]******************************
*******************************************************************************
******************************************************************************/


const introspect = t => {
  const tag = getStringTag(t);

  switch (tag) {
    case "Adt":
    case "Arr":
    case "Fun":
    case "_Map":
    case "Rec":
    case "Tup":
    case "Unit": return t[TYPE_SIG];

    default: {
      if (tag === "Object" && "constructor" in t) {
        tag = t.constructor.name;
      }

      if (tag === "Number") {
        if (Number.isNaN(t)) return "NaN";
        else return tag;
      }

      else return tag;
    }
  }
};


const introspectR = x => {
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
              else if (x.length === 1) return `[${introspectR(x[0])}]`;

              else {
                const [s, ss] = x.reduce(([s, ss], y) => {
                    const t = introspectR(y);
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
              else return `{${nextVal(x.entries()).map(y => introspectR(y)).join("::")}}`;
            }

            case "Object": {
              const ks = Object.keys(x);
              if (ks.length === 0) return "Object";
              else return "{" + ks.map(k => `${k}: ${introspectR(x[k])}`).join(", ") + "}";
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


const getStringTag = x => {
  const ss = Object.prototype.toString.call(x).split(" ");
  return last(ss).slice(0, -1);
};


/******************************************************************************
*******************************************************************************
**************************[ 3. TYPE REPRESENTATIVES ]**************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
*****[ 3.1. Algebraic Data Types ]*********************************************
******************************************************************************/


const AdtT = (Cons => (tag, range, children) => new Cons(tag, range, children))
  (class AdtT {
    constructor(tag, range, children) {
      this.range = range;
      this.tag = tag;
      this.children = children;
    }
  });


/******************************************************************************
*****[ 3.2. Arrays ]***********************************************************
******************************************************************************/


const ArrT = (Cons => (range, child) => new Cons(range, child))
  (class ArrT {
    constructor(range, child) {
      this.range = range;
      this.tag = "Arr";
      this.children = child;
    }
  });


/******************************************************************************
*****[ 3.3. Functions ]********************************************************
******************************************************************************/


const FunT = (Cons => (name, range, children) => new Cons(name, range, children))
  (class FunT {
    constructor(name, range, children) {
      this.name = name;
      this.range = range;
      this.tag = "Fun";
      this.children = children;
    }
  });


const ArgT = (Cons => child => new Cons(child))
  (class ArgT {
    constructor(child) {
      this.children = child;
    }
  });


const NoArgT = (Cons => range => new Cons(range))
  (class NoArgT {
    constructor(range) {
      this.range = range;
      this.children = null;
    }
  });


const RestT = (Cons => child => new Cons(child))
  (class RestT {
    constructor(child) {
      this.children = child;
    }
  });


const ReturnT = (Cons => child => new Cons(child))
  (class ReturnT {
    constructor(child) {
      this.children = child;
    }
  });


/******************************************************************************
*****[ 3.4. Maps ]*************************************************************
******************************************************************************/


const _MapT = (Cons => (range, children) => new Cons(range, children))
  (class _MapT {
    constructor(range, children) {
      this.range = range;
      this.tag = "_Map";
      this.children = children;
    }
  });


/******************************************************************************
*****[ 3.5. Primitives ]*******************************************************
******************************************************************************/


const PrimT = (Cons => (range, tag) => new Cons(range, tag))
  (class PrimT {
    constructor(range, tag) {
      this.range = range;
      this.tag = tag;
      this.children = [];
    }
  });


/******************************************************************************
*****[ 3.6. Polytypes ]********************************************************
******************************************************************************/


const PolyT = (Cons => (range, tvar) => new Cons(range, tvar))
  (class PolyT {
    constructor(range, tvar) {
      this.range = range;
      this.tag = tvar;
      this.children = [];
    }
  });


/******************************************************************************
*****[ 3.7. Records ]**********************************************************
******************************************************************************/


const RecT = (Cons => (range, children) => new Cons(range, children))
  (class RecT {
    constructor(range, children) {
      this.range = range;
      this.tag = "Rec";
      this.children = children;
    }
  });


/******************************************************************************
*****[ 3.8. Tuples ]***********************************************************
******************************************************************************/


const TupT = (Cons => (range, children) => new Cons(range, children))
  (class TupT {
    constructor(range, children) {
      this.range = range;
      this.tag = "Tup";
      this.children = children;
    }
  });


/******************************************************************************
*****[ 3.9. Unit ]*************************************************************
******************************************************************************/


const UnitT = (Cons => range => new Cons(range))
  (class UnitT {
    constructor(range) {
      this.range = range;
      this.tag = "Unit";
      this.children = [];
    }
  });


/******************************************************************************
*******************************************************************************
******************************[ 4. SERIALIZING ]*******************************
*******************************************************************************
******************************************************************************/


const serialize = tRep => {
  const {tag, children} = tRep;

  switch (tag) {
    case "Arr": return serializeArr(tag, children);
    case "Fun": return serializeFun(tRep.name, tag, children);
    case "_Map": return serializeMap(tag, children);
    case "Rec": return serializeRec(tag, children);
    case "Tup": return serializeTup(tag, children);
    case "Unit": return "[]";
    
    default: {
      if (tRep.constructor.name === "AdtT") return serializeAdt(tag, children);

      else if (children.length > 0) throw new TypeRepError(
        "invalid type representative\n\n" +
        `${tRep}\n\n` +
        "invalid primitive type\n"
      );

      else return tag;
    }
  }
};


const serializeAdt = (tag, tReps) => {
  return `${tag}<`
    .concat(tReps
      .map(tRep => {
        if (tRep.children.length === 0) return tRep.tag;
        else return serialize(tRep);
      })
      .join(", ")
    )
    .concat(">");
};


const serializeArr = (tag, tReps) => {
  return "["
    .concat(tReps
      .map(tRep => {
        if (tRep.children.length === 0) return tRep.tag;
        else return serialize(tRep);
      })
      .join("")
    )
    .concat("]");
};


const serializeFun = (name, tag, tReps) => {
  return "("
    .concat(name === "" ? "" : `${name} :: `)
    .concat(tReps
      .map(arg => {
        switch (arg.constructor.name) {
          case "NoArgT": return "()";

          case "ArgT":
          case "ReturnT": {
            const {tag: t, children: c} = arg.children;
            if (c.length === 0) return t;
            else return serialize(arg);
          }

          case "RestT": {
            const {tag: t, children: c} = arg.children;
            if (c.length === 0) return `...${t}`;
            else return `...${serialize(arg)}`;
          }
        }
      })
      .join(" -> ")
    )
    .concat(")");
};


const serializeMap = (tag, tReps) => {
  return "{"
    .concat(tReps
      .map(({k, v}) => [k, v]
        .map(tRep => {
          if (tRep.children.length === 0) return tRep.tag;
          else return serialize(tRep);
        })
        .join("::")
      )
    )
    .concat("}");
};


const serializeRec = (tag, tReps) => {
  return "{"
    .concat(tReps
      .map(({k, v}) => {
        if (v.children.length === 0) return `${k}: ${v.tag}`;
        else return `${k}: ${serialize(v)}`;
      })
      .join(", ")
    )
    .concat("}");
};


const serializeTup = (tag, tReps) => {
  return "["
    .concat(tReps
      .map(tRep => {
        if (tRep.children.length === 0) return tRep.tag;
        else return serialize(tRep);
      })
      .join(", ")
    )
    .concat("]");
};


/******************************************************************************
*******************************************************************************
*****************************[ 5. DESERIALIZING ]******************************
*******************************************************************************
******************************************************************************/


// don't fear the beast...

const deserialize = tSig => {
  const aux = (tSig, n, state) => {
    const {depth, context, phase, buf, range, tag, tReps} = state,
      c = tSig[n],
      next = n + 1 === tSig.length ? "" : tSig[n + 1];

    if (c === undefined) _throw(
      TypeSigError,
      ["invalid type signature"],
      tSig,
      {range: [n, n], desc: ["unexpected end of signature"]}
    );

    else if (c.search(/[a-z0-9(\[{<>}\]), \-.:_]/i) !== 0) _throw(
      TypeSigError,
      ["invalid type signature"],
      tSig,
      {range: [n, n], desc: ["invalid symbol"]}
    );

    switch (context) {
      case "ADT": {
        switch (phase) {
          case "TAG": {
            if (c.search(/[a-z]/i) === 0) {
              return aux(
                tSig, n + 1,
                {depth, context, phase, buf: buf + c, range, tag, tReps}
              );
            }

            else {
              return aux(
                tSig, n + 1,
                {depth: depth + 1, context, phase: "TYPE_REP", buf: "", range, tag: buf, tReps}
              );
            }
          }

          case "TYPE_REP": {
            if (c === ",") {
              if (tReps.length === 0) _throw(
                TypeSigError,
                ["invalid type signature"],
                tSig,
                {range: [n, n], desc: ["unexpected symbol"]}
              );

              else if (next === " ") {
                return aux(
                  tSig, n + 2,
                  {depth, context, phase, buf, range, tag, tReps}
                );
              }
              
              else _throw(
                TypeSigError,
                ["invalid type signature"],
                tSig,
                {range: [n + 1, n + 1], desc: [`symbol " " expected`]}
              );
            }

            else if (c === ">") {
              return [AdtT(tag, range, tReps), n + 1, depth - 1];
            }

            else {
              const {context: c_, phase: p, buf: b} = getContext(tSig, n);

              const [tRep, m] = aux(
                tSig, n,
                {depth, context: c_, phase: p, buf: b, range: [n], tag: "", tReps: []}
              );
              
              return aux(
                tSig, m,
                {depth, context, phase, buf: "", range: [range[0], m], tag, tReps: tReps.concat(tRep)}
              );
            }
          }
        }
      }

      case "ARR": {
        switch (phase) {
          case "OUTER": {
            return aux(
              tSig, n + 1,
              {depth: depth + 1, context, phase: "INNER", buf, range, tag: "Arr", tReps}
            );
          }

          case "INNER": {
            if (c === ",") {
              if (tReps.length === 0) _throw(
                TypeSigError,
                ["invalid type signature"],
                tSig,
                {range: [n, n], desc: ["unexpected symbol"]}
              );

              else if (next === " ") {
                return aux(
                  tSig, n + 2,
                  {depth, context, phase, buf, range, tag: "Tup", tReps}
                );
              }
              
              else _throw(
                TypeSigError,
                ["invalid type signature"],
                tSig,
                {range: [n + 1, n + 1], desc: [`symbol " " expected`]}
              );
            }

            else if (c === "]") {
              if (tag === "Arr") return [ArrT(range, tReps), n + 1, depth - 1];
              else return [TupT(range, tReps), n + 1, depth - 1];
            }

            else {
              const {context: c_, phase: p, buf: b} = getContext(tSig, n);

              const [tRep, m] = aux(
                tSig, n,
                {depth, context: c_, phase: p, buf: b, range: [n], tag: "", tReps: []}
              );
              
              return aux(
                tSig, m,
                {depth, context, phase, buf: "", range: [range[0], m], tag, tReps: tReps.concat(tRep)}
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
              tSig, n + 1,
              {depth: depth + 1, context, phase: "LOOK_AHEAD", buf, name: "", range, tag: "Fun", tReps}
            );
          }

          case "LOOK_AHEAD": {
            return aux(
              tSig, n,
              {depth, context, phase: lookAheadFun(tSig.slice(n)), buf, name, range, tag, tReps}
            );
          }

          case "NAME": {
            if (c.search(/[a-z0-9_]/i) === 0) return aux(
              tSig, n + 1,
              {depth, context, phase, buf: buf + c, name, range, tag, tReps}
            );

            else if (c === " ") {
              if (tSig.slice(n, n + 4) === " :: ") return aux(
                tSig, n + 4,
                {depth, context, phase: "LOOK_AHEAD", buf: "", name: buf, range, tag, tReps}
              );

              else if (next === ":" && tSig[n + 2] === ":") _throw(
                TypeSigError,
                ["invalid type signature"],
                tSig,
                {range: [n + 3, n + 3], desc: [`symbol " " expected`]}
              );

              else if (next === ":") _throw(
                TypeSigError,
                ["invalid type signature"],
                tSig,
                {range: [n + 2, n + 2], desc: [`symbol ":" expected`]}
              );

              else _throw(
                TypeSigError,
                ["invalid type signature"],
                tSig,
                {range: [n + 1, n + 1], desc: [`symbol ":" expected`]}
              );
            } 

            else _throw(
              TypeSigError,
              ["invalid type signature"],
              tSig,
              {range: [n, n], desc: ["unexpected symbol"]}
            );
          }

          case "ARG": {
            const {context: c_, phase: p, buf: b} = getContext(tSig, n);

            const [tRep, m] = aux(
              tSig, n,
              {depth, context: c_, phase: p, buf: b, name, range: [n], tag: "", tReps: []}
            );
            
            return aux(
              tSig, m,
              {depth, context, phase: "ARROW", buf: "", name, range: [range[0], m], tag, tReps: tReps.concat(ArgT(tRep))}
            );
          }

          case "NO_ARG": {
            return aux(
              tSig, n + 2,
              {depth, context, phase: "ARROW", buf, name, range: [n, n + 1], tag, tReps: tReps.concat(NoArgT([n, n + 1]))}
            );
          }

          case "REST": {
            if (c === ".") {
              if (next === "." && tSig[n + 2] === ".") return aux(
                tSig, n + 3,
                {depth, context, phase, buf, name, range, tag, tReps}
              );

              else _throw(
                TypeSigError,
                ["invalid type signature"],
                tSig,
                {range: [n, n], desc: ["unexpected symbol"]}
              );
            }

            else {
              const {context: c_, phase: p, buf: b} = getContext(tSig, n);

              const [tRep, m] = aux(
                tSig, n,
                {depth, context: c_, phase: p, buf: b, name, range: [n], tag: "", tReps: []}
              );
              
              return aux(
                tSig, m,
                {depth, context, phase: "ARROW", buf: "", name, range: [range[0], m], tag, tReps: tReps.concat([RestT(tRep)])}
              );
            }
          }

          case "RETURN": {
            if (c === ")") {
              if (next === ")") _throw(
                TypeSigError,
                ["invalid type signature"],
                tSig,
                {range: [range[0], n], desc: ["unnecessary parenthesis"]}
              );

              else {
                return [FunT(name, range, tReps), n + 1, depth - 1];
              }
  
            }

            else {
              const {context: c_, phase: p, buf: b} = getContext(tSig, n);

              const [tRep, m] = aux(
                tSig, n,
                {depth, context: c_, phase: p, buf: b, name, range: [n], tag: "", tReps: []}
              );

              return aux(
                tSig, m,
                {depth, context, phase, buf: "", name, range: [range[0], m], tag, tReps: tReps.concat([ReturnT(tRep)])}
              );
            }
          }

          case "ARROW": {
            if (c === " ") {
              if (tSig.slice(n, n + 4) === " -> ") return aux(
                tSig, n + 4,
                {depth, context, phase: "LOOK_AHEAD", buf: "", name, range, tag, tReps}
              );

              else _throw(
                TypeSigError,
                ["invalid type signature"],
                tSig,
                {range: [n, n], desc: [`token " -> " expected`]}
              );
            }

            else _throw(
              TypeSigError,
              ["invalid type signature"],
              tSig,
              {range: [n, n], desc: ["unexpected symbol"]}
            );
          }
        }
      }

      case "_MAP": {
        switch (phase) {
          case "OUTER": {
            return aux(
              tSig, n + 1,
              {depth: depth + 1, context, phase: "KEY", buf, range, tag: "_Map", tReps}
            );
          }

          case "KEY": {
            const {context: c_, phase: p, buf: b} = getContext(tSig, n);

            const [tRep, m] = aux(
              tSig, n,
              {depth, context: c_, phase: p, buf: b, range: [n], tag: "", tReps: []}
            );

            return aux(
              tSig, m + 2,
              {depth, context, phase: "VALUE", buf: "", range: range.concat(m), tag, tReps: tReps.concat({k: tRep, v: null})}
            );
          }

          case "VALUE": {
            if (c === "}") {
              return [_MapT(range, tReps), n + 1, depth - 1];
            }

            else {
              const {context: c_, phase: p, buf: b} = getContext(tSig, n);

              const [tRep, m] = aux(
                tSig, n,
                {depth, context: c_, phase: p, buf: b, range: [n], tag: "", tReps: []}
              );
              
              tReps[0].v = tRep;

              return aux(
                tSig, m,
                {depth, context, phase, buf: "", range: [range[0], m], tag, tReps}
              );
            }
          }
        }
      }

      case "PRIM": {
        switch (phase) {
          case "UC": {
            if (next === "") return [PrimT(range.concat(n), c), n + 1, depth];

            else return aux(
              tSig, n + 1,
              {depth, context, phase: "LETTER", buf: buf + c, range, tag, tReps}
            );
          }

          case "LETTER": {
            if (c.search(/[a-z]/i) === 0) {
              if (next === "") return [PrimT(range.concat(n), buf + c), n + 1, depth]

              else return aux(
                tSig, n + 1,
                {depth, context, phase, buf: buf + c, range, tag, tReps}
              );
            }
            
            else if (c.search(/[)\]}>, :]/) === 0) {
              return [PrimT(range.concat(n - 1), buf), n, depth];
            }

            else _throw(
              TypeSigError,
              ["invalid type signature"],
              tSig,
              {range: [n, n], desc: ["unexpected symbol"]}
            );
          }
        }
      }

      case "POLY": {
        switch (phase) {
          case "LETTER": {
            if (next === "") return [PolyT(range.concat(n), c), n + 1, depth];

            else return aux(
              tSig, n + 1,
              {depth, context, phase: "NUMBER", buf: buf + c, range, tag, tReps}
            );
          }

          case "NUMBER": {
            if (c.search(/[0-9]/) === 0) {
              if (next === "") return [PolyT(range.concat(n), buf + c), n + 1, depth]
              
              else return aux(
                tSig, n + 1,
                {depth, context, phase: "END", buf: buf + c, range, tag, tReps}
              );
            }
          
            else if (c.search(/[)\]}>, :]/) === 0) {
              return [PolyT(range.concat(n - 1), buf), n, depth];
            }

            else _throw(
              TypeSigError,
              ["invalid type signature"],
              tSig,
              {range: [n, n], desc: ["unexpected symbol (type variable context)"]}
            );
          }

          case "END": {
            if (c.search(/[)\]}>, :]/) === 0) {
              return [PolyT(range.concat(n - 1), buf), n, depth];
            }

            else _throw(
              TypeSigError,
              ["invalid type signature"],
              tSig,
              {range: [n, n], desc: ["unexpected symbol"]}
            );
          }
        }
      }

      case "REC": {
        switch (phase) {
          case "OUTER": {
            return aux(
              tSig, n + 1,
              {depth: depth + 1, context, phase: "KEY", buf, range, tag: "Rec", tReps}
            );
          }

          case "KEY": {
            if (c.search(/[a-z0-9_]/i) === 0) return aux(
              tSig, n + 1,
              {depth, context, phase, buf: buf + c, range, tag, tReps}
            );

            else if (c === ":") {
              if (buf === "") _throw(
                TypeSigError,
                ["invalid type signature"],
                tSig,
                {range: [n, n], desc: ["unexpected symbol"]}
              );

              else if (next === " ") {
                return aux(
                  tSig, n + 2,
                  {depth, context, phase: "VALUE", buf: "", range, tag, tReps: tReps.concat({k: buf, v: null})}
                );
              }
              
              else _throw(
                TypeSigError,
                ["invalid type signature"],
                tSig,
                {range: [n + 1, n + 1], desc: [`symbol " " expected`]}
              );
            }

            else _throw(
              TypeSigError,
              ["invalid type signature"],
              tSig,
              {range: [n, n], desc: ["unexpected symbol"]}
            );
          }

          case "VALUE": {
            if (c === ",") {
              if (tReps.length === 0) _throw(
                TypeSigError,
                ["invalid type signature"],
                tSig,
                {range: [n, n], desc: ["unexpected symbol"]}
              );

              else if (next === " ") {
                return aux(
                  tSig, n + 2,
                  {depth, context, phase: "KEY", buf, range, tag, tReps}
                );
              }
              
              else _throw(
                TypeSigError,
                ["invalid type signature"],
                tSig,
                {range: [n + 1, n + 1], desc: [`symbol " " expected`]}
              );
            }

            else if (c === "}") {
              return [RecT(range, tReps), n + 1, depth - 1];
            }

            else {
              const {context: c_, phase: p, buf: b} = getContext(tSig, n);

              const [tRep, m] = aux(
                tSig, n,
                {depth, context: c_, phase: p, buf: b, range: [n], tag: "", tReps: []}
              );
              
              last(tReps).v = tRep;

              return aux(
                tSig, m,
                {depth, context, phase, buf: "", range: [range[0], m], tag, tReps}
              );
            }
          }
        }
      }

      case "UNIT": return [UnitT([n, n + 1]), n + 2, depth];
    }
  };

  const {context, phase, buf} = getContext(tSig, 0);

  const [tRep, n, depth] = aux(
    tSig, 0,
    {depth: 0, context, phase, buf, range: [0], tag: "", tReps: []}
  );

  if (depth === 0 && tSig.length !== n) _throw(
    TypeSigError,
    ["invalid type signature"],
    tSig,
    {range: [n, tSig.length - 1], desc: ["unexpected symbol(s)"]}
  );

  else return tRep;
};


const getContext = (tSig, n) => {
  const c = tSig[n],
    s = tSig.slice(n);

  // ADT

  if (s.search(/^[A-Z]{1,}[a-z]*</) === 0) {
    return {context: "ADT", phase: "TAG", buf: ""};
  }

  // Arr / Tup / Unit

  if (c === "[") {
    if (tSig[n + 1] === "]") return {context: "UNIT", phase: "", buf: ""};
    else return {context: "ARR", phase: "OUTER", buf: ""};
  }

  // Fun

  if (c === "(" && tSig[n + 1] !== ")") {
    return {context: "FUN", phase: "OUTER", buf: ""};
  }

  // _Map

  if (s.search(/\{.+::/) === 0
  && lookAheadMap(tSig.slice(n + 1))) {
    return {context: "_MAP", phase: "OUTER", buf: ""};
  }

  // Rec

  if (s.search(/\{[a-z0-9_]+: /i) === 0) {
    return {context: "REC", phase: "OUTER", buf: ""};
  }

  // Prim

  if (c.search(/[A-Z]/) === 0) {
    return {context: "PRIM", phase: "UC", buf: ""};
  }

  // Poly

  if (c.search(/[a-z]/) === 0) {
    return {context: "POLY", phase: "LETTER", buf: ""};
  }

  // Error

  _throw(
    TypeSigError,
    ["invalid type signature"],
    tSig,
    {range: [n, n], desc: ["unexpected symbol"]}
  );
};


const lookAheadMap = (tSig) => {
  const aux = (n, {context}) => {
    const c = tSig[n],
      next = tSig[n + 1] || "",
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


const lookAheadFun = tSig => {
  const aux = (n, {context}) => {
    const c = tSig[n],
      next = tSig[n + 1] || "",
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
        else if (tSig[0] === "." ) return "REST";
        else if (tSig[1] === ")") return "NO_ARG";
        else return "ARG";
      }

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
******************************[ 6. UNIFICTAION ]*******************************
*******************************************************************************
******************************************************************************/


const unify = (t1Rep, t2Rep, {mode}, cons, fRep, s) => {
  const t1Sig = serialize(t1Rep),
    t2Sig = serialize(t2Rep);

  switch (t1Rep.constructor.name) {
    case "AdtT": return unifyAdt(t1Rep, t2Rep, {mode}, cons, fRep, s);
    case "ArrT": return unifyArr(t1Rep, t2Rep, {mode}, cons, fRep, s);
    case "FunT": return unifyFun(t1Rep, t2Rep, {mode}, cons, fRep, s);
    case "_MapT": return unifyMap(t1Rep, t2Rep, {mode}, cons, fRep, s);
    case "PolyT": return unifyPoly(t1Rep, t2Rep, {mode}, cons, fRep, s);
    case "PrimT": return unifyPrim(t1Rep, t2Rep, {mode}, cons, fRep, s);
    case "RecT": return unifyRec(t1Rep, t2Rep, {mode}, cons, fRep, s);
    case "TupT": return unifyTup(t1Rep, t2Rep, {mode}, cons, fRep, s);
    case "UnitT": return unifyUnit(t1Rep, t2Rep, {mode}, cons, fRep, s);
  }
};


const unifyArr = (t1Rep, t2Rep, {mode}, cons, fRep, s) => {
  switch (t2Rep.constructor.name) {
    case "AdtT":
    case "FunT":
    case "_MapT":
    case "PrimT":
    case "RecT":
    case "TupT":
    case "UnitT": {
      _throw(
        cons,
        [`${fRep.name} expects`],
        serialize(fRep),
        {range: [from, to], desc: [`${serialize(t2Rep)} received`]}
      );
    }

    case "ArrT": {
      return unify(t1Rep.children[0], t2Rep.children[0], {mode}, cons, fRep, s);
    }

    case "PolyT": {
      return mapConstraints(t2Rep, t2Rep, {mode}, cons, fRep, s);
    }
  }
};


const unifyFun = (t1Rep, t2Rep, {mode}, cons, fRep, s) => {
  switch (t2Rep.constructor.name) {
    case "AdtT":
    case "ArrT":
    case "_MapT":
    case "PrimT":
    case "RecT": 
    case "TupT":
    case "UnitT": {
      _throw(
        cons,
        [`${fRep.name} expects`],
        serialize(fRep),
        {range: [from, to], desc: [`${serialize(t2Rep)} received`]}
      );
    }
    
    case "FunT": {
      [t2Rep, s.i] = fresh(t2Rep, s.i);

      if (t1Rep.children.length < t2Rep.children.length) {
        t1Rep.forEach((arg, n) => {
          if (n === t1Rep.children.length - 1) {
            s = mapConstraints(arg.children, t2Rep.slice(n), {mode}, cons, fRep, s);
            s = unify(arg, t2Rep.slice(n), {mode}, cons, fRep, s);
          }
          
          else {
            s = mapConstraints(arg.children, t2Rep[n], {mode}, cons, fRep, s);
            s = unify(arg, t2Rep[n], {mode}, cons, fRep, s);
          }
        });
      }

      else if (t1Rep.children.length > t2Rep.children.length) {
        t2Rep.forEach((arg, n) => {
          if (n === t2Rep.children.length - 1) {
            s = mapConstraints(t1Rep.slice(n), arg, {mode}, cons, fRep, s);
            s = unify(t1Rep.slice(n), arg, {mode}, cons, fRep, s);
          }
          
          else {
            s = mapConstraints(t1Rep[n], arg, {mode}, cons, fRep, s);
            s = unify(t1Rep[n], arg, {mode}, cons, fRep, s);
          }
        });
      }

      else {
        t1Rep.forEach((arg, n) => {
          s = mapConstraints(arg, t2Rep[n], {mode}, cons, fRep, s);
          s = unify(arg, t2Rep[n], {mode}, cons, fRep, s);
        });
      }

      return s;
    }

    case "PolyT": {
      return mapConstraints(t2Rep, t1Rep, {mode}, cons, fRep, s);
    }
  }
};


const unifyPoly = (t1Rep, t2Rep, {mode}, cons, fRep, s) => {
  return mapConstraints(t1Rep, t2Rep, {mode}, cons, fRep, s);
};


const unifyPrim = (t1Rep, t2Rep, {mode}, cons, fRep, s) => {
  switch (t2Rep.constructor.name) {
    case "AdtT":
    case "ArrT":
    case "FunT":
    case "_MapT":
    case "RecT":
    case "TupT":
    case "UnitT": {
      _throw(
        cons,
        [`${fRep.name} expects`],
        serialize(fRep),
        {range: [from, to], desc: [`${serialize(t2Rep)} received`]}
      );
    }

    case "PolyT": {
      return mapConstraints(t2Rep, t1Rep, {mode}, cons, fRep, s);
    }

    case "PrimT": {
      if (serialize(t1Rep) !== serialize(t2Rep)) {
        const [from, to] = t1Rep.range;

        _throw(
          cons,
          [`${fRep.name} expects`],
          serialize(fRep),
          {range: [from, to], desc: [`${serialize(t2Rep)} received`]}
        );
      }

      else return s;
    }
  }
};


const mapConstraints = (kRep, vRep, {mode}, cons, fRep, s) => {
  const kSig = serialize(kRep),
    vSig = serialize(vRep);

  if (kSig !== vSig) {
    occurs(kRep, kSig, vRep, vSig, cons, fRep);
  }

  if (s.constraints.has(kSig)) {
    const vSig_ = s.constraints.get(kSig);

    if (vSig !== vSig_) {
      return unify(deserialize(vSig_), vRep, {mode}, cons, fRep, s);
    }
  }

  else if (mode === "map") {
    if (mgu(kSig, vSig) === LESS_GEN) {
      s.constraints.set(vSig, kSig);
    }

    else s.constraints.set(kSig, vSig);
  }

  // verify equivalence relations

  if (s.relations.has(kSig)) {
    const vSig_ = s.relations.get(kSig);

    if (vSig !== vSig_) {
      if (!s.lookup.has(`${vSig_} ~ ${vSig}`)) {
        s.lookup.add(`${vSig_} ~ ${vSig}`);
        mapCons(vSig_, vSig, {mode: "verify"}, cons, fRep, s);
      }
    }
  }

  else {
    s.relations.set(kSig, vSig);
  }

  if (s.relations.has(vSig)) {
    const kSig_ = s.relations.get(vSig);

    if (kSig !== kSig_) {
      if (!s.lookup.has(`${kSig_} ~ ${kSig}`)) {
        s.lookup.add(`${kSig_} ~ ${kSig}`);
        mapCons(kSig_, kSig, {mode: "verify"}, cons, fRep, s);
      }
    }
  }

  else {
    s.relations.set(vSig, kSig);
  }

  return s;
};


const occurs = (kRep, kSig, vRep, vSig, cons, fRep) => {
  if (kSig.search(/\b[a-z][0-9]?\b/) !== -1) {
    if (vSig.search(new RegExp(`\\b${kSig}\\b`)) !== -1) {
      const [from, to] = kRep.range;

      _throw(
        TypeError,
        ["infinite type"],
        serialize(fRep),
        {range: [from, to], desc: [`${kSig} occurs in ${vSig}`]}
      );
    }
  }

  else if (vSig.search(/\b[a-z][0-9]?\b/) !== -1) {
    if (kSig.search(new RegExp(`\\b${vSig}\\b`)) !== -1) {
      const [from, to] = vRep.range;

      _throw(
        TypeError,
        ["infinite type"],
        serialize(fRep),
        {range: [from, to], desc: [`${vSig} occurs in ${kSig}`]}
      );
    }
  }
};


const fresh = (tRep, i) => {
  const aux = tRep => {
    const r = tRep.range;

    switch (tRep.constructor.name)  {
      case "AdtT": return AdtT(tRep.tag, r, tRep.children.map(tRep_ => aux(tRep_)));     
      case "ArrT": return ArrT(r, aux(tRep.children[0]));
      case "FunT": return FunT(tRep.name, r, tRep.children.map(tRep_ => aux(tRep_)));

      case "_Map": {
        const k = aux(tRep.children[0].k),
          v = aux(tRep.children[0].v);

        return _MapT(r, [{k, v}]);
      }
      
      case "PrimT": return tRep;
      
      case "PolyT": {
        isFresh = true;
        return PolyT(r, `${tRep.tag}${i}`);
      }
      
      case "Rec": {
        return RecT(r, tRep.children.map(tRep_ => ({k: aux(tRep_.k), v: aux(tRep_.v)})));
      }

      case "Tup": return TupT(r, tRep.children.map(tRep_ => aux(tRep_)));
      case "Unit": return tRep;
    }
  };

  let isFresh = false;
  return [aux(tRep), isFresh ? i + 1 : i];
};


const mgu = (t1Rep, t1Sig, t2Rep, t2Sig) => {
  const aux = (t1Rep, t2Rep) => {
    switch (t1Rep.constructor.name) {
      case "ArrT": {
        switch (t2Rep.constructor.name) {
          case "ArrT": return aux(
            t1Rep.children[0],
            serialize(t1Rep.children[0]),
            t2Rep.children[0],
            serialize(t2Rep.children[0])
          );

          case "FunT": return NO_MGU;
          case "PrimT": return NO_MGU;
          case "PolyT": return LESS_GEN;
        }
      }

      case "FunT": {
        switch (t2Rep.constructor.name) {
          case "ArrT": return NO_MGU;
          
          case "FunT": {
            return mguFun(t1Rep, t2Rep, 0);
          }
          
          case "PrimT": return NO_MGU;
          case "PolyT": return LESS_GEN;
        }
      }

      case "PrimT": {
        switch (t2Rep.constructor.name) {
          case "ArrT": return NO_MGU;
          case "FunT": return NO_MGU;
          case "PrimT": return EQ_GEN;
          case "PolyT": return LESS_GEN;
        }
      }

      case "PolyT": {
        switch (introspect(t2)) {
          case "ArrT": return MORE_GEN;
          case "FunT": return MORE_GEN;
          case "PrimT": return MORE_GEN;
          
          case "PolyT": {
            tvars1.add(t1Rep.tag);
            tvars2.add(t2Rep.tag);
            return EQ_GEN;
          }
        }
      }
    }
  };

  const tvars1 = new Set(), tvars2 = new Set(),
    r = aux(t1Rep, t2Rep, new Set(), new Set());

  // swallow errors
  if (r === NO_MGU) return EQ_GEN;

  else {
    if (r === EQ_GEN) {
      if (tvars1.size < tvars2.size) return LESS_GEN;
      else if (tvars1.size > tvars2.size) return MORE_GEN;
      else return EQ_GEN;
    }

    else return r;
  }
};


const mguFun = (t1Rep, t2Rep, n, aux) => {
  switch (t1Rep.children[n].constructor.name) {
    case "ArgT": {
      switch (t2Rep.children[n].constructor.name) {
        case "ArgT": {
          const r = aux(
            t1Rep.children[n],
            serialize(t1Rep.children[n]),
            t2Rep.children[n],
            serialize(t2Rep.children[n])
          );

          if (r === EQ_GEN) {
            return mguFun(t1Rep, t2Rep, n + 1, aux);
          }

          else return r;
        }
        
        case "RestT": {
          if (t1Rep.children[n].children.tag === "Arr") {
            const r = aux(
              t1Rep.children[n][0],
              serialize(t1Rep.children[n][0]),
              t2Rep.children[n],
              serialize(t2Rep.children[n])
            );

            if (r === EQ_GEN) {
              return mguFun(t1Rep, t2Rep, n + 1, aux);
            }

            else return r;
          }

          else return NO_MGU;
        }

        case "NoArgT": return NO_MGU;

        case "ReturnT": {
          if (t1Rep.children[n].children.constructor.name === "PolyT") {
            return MORE_GEN;
          }

          else return NO_MGU;
        }
      }
    }

    case "RestT": {
      switch (t2Rep.children[n].constructor.name) {
        case "ArgT": {
          if (t2Rep.children[n].children.tag === "Arr") {
            const r = aux(
              t1Rep.children[n],
              serialize(t1Rep.children[n]),
              t2Rep.children[n][0],
              serialize(t2Rep.children[n][0])
            );

            if (r === EQ_GEN) {
              return mguFun(t1Rep, t2Rep, n + 1, aux);
            }

            else return r;
          }

          else return NO_MGU;
        }
        
        case "RestT": {
          const r = aux(
            t1Rep.children[n],
            serialize(t1Rep.children[n]),
            t2Rep.children[n],
            serialize(t2Rep.children[n])
          );

          if (r === EQ_GEN) {
            return mguFun(t1Rep, t2Rep, n + 1, aux);
          }

          else return r;
        }

        case "NoArgT":
        case "ReturnT": return NO_MGU;
      }
    }

    case "NoArgT": {
      switch (t2Rep.children[n].constructor.name) {
        case "NoArgT": return mguFun(t1Rep, t2Rep, n + 1, aux);
        default: return NO_MGU;
      }
    }

    case "ReturnT": {
      switch (t2Rep.children[n].constructor.name) {
        case "ArgT": {
          if (t2Rep.children[n].children.constructor.name === "PolyT") {
            return LESS_GEN;
          }

          else return NO_MGU;
        }
        
        case "ReturnT": {
          return aux(
            t1Rep.children[n],
            serialize(t1Rep.children[n]),
            t2Rep.children[n],
            serialize(t2Rep.children[n])
          );
        }

        default: return NO_MGU;
      }
    }
  }
};


const substitute = fRep => {
  const aux = tSig_ => {
    s.constraints.forEach((v, k) => {
      if (tSig_.search(new RegExp(`\\b${escapeRegExp(k)}\\b`)) !== -1) {
        if (v[0] === "(") {
          tSig_ = tSig_.replace(new RegExp(`\\b${escapeRegExp(k)}$`), v.slice(1, -1));
          tSig_ = tSig_.replace(new RegExp(`\\b${escapeRegExp(k)}(?=\\))`, "g"), v.slice(1, -1));
          tSig_ = tSig_.replace(new RegExp(`\\b${escapeRegExp(k)}\\b`, "g"), v);
        }

        else {
          tSig_ = tSig_.replace(new RegExp(`\\b${escapeRegExp(k)}\\b`, "g"), v);
        }
      }
    });

    if (tSig_ === tSig) return tSig_;

    else {
      tSig = tSig_;
      return aux(tSig_);
    }
  };

  let tSig = serialize(fRep);
  return deserialize(aux(tSig));
};


const escapeRegExp = s => s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");


/******************************************************************************
*******************************************************************************
******************************[ 7. CUSTOM TYPES ]******************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
*****[ 7.1. Functions ]********************************************************
******************************************************************************/


export const Fun = (fSig, f) => {
  if (types) {
    if (introspect(fSig) !== "String") _throw(
      TypeError,
      ["Fun expects"],
      "(String, Function -> Function)",
      {range: [1, 6], desc: [`${introspect(fSig)} received`]}
    );

    else if (introspect(f) !== "Function") _throw(
      TypeError,
      ["Fun expects"],
      "(String, Function -> Function)",
      {range: [9, 8], desc: [`${introspect(f)} received`]}
    );

    const fRep = deserialize(fSig);
    Reflect.defineProperty(f, "name", {value: fRep.name || "lambda"});

    return new Proxy(f, handleFun(
      f, fRep, fSig,
      {
        f,
        nthCall: 0,
        constraints: new Map(),
        reverse: new Map()
      }
    ));
  }

  else return f;
};


const handleFun = (f, fRep, fSig, s) => {
  const {tag, children} = fRep;

  return {
    apply: (g, _, args) => {
      const child = children[s.nthCall];
      if (s.nthCall === 0) s.constraints = new Map();

      switch (child.constructor.name) {
        case "ArgT": {
          verifyUnary(args, child.children, fRep);
          
          s = unify(
            child.children,
            deserialize(introspect(args[0])),
            {mode: "map"},
            TypeError, fRep, s
          );

          break;
        }

        case "NoArgT": {
          verifyNullary(args, child.children, fRep);
          break;
        }

        case "RestT": {
          s = unify(
            child.children,
            deserialize(introspect(args[0])),
            {mode: "map"},
            TypeError, fRep, s
          );

          break;
        }
      }

      if (children[s.nthCall + 1].constructor.name === "ReturnT") {
        const r = g(...args);

        // TODO: revise
        if (getStringTag(r) === "Adt") {
          const [rep, sig] = constructType(r, constraints);
          r[TYPE_REP] = rep;
          r[TYPE_SIG] = sig;
        }

        s = unify(
          children[s.nthCall + 1].children,
          deserialize(introspect(r)),
          {mode: "map"},
          ReturnTypeError, fRep, s
        );

        return r;
      }

      else {
        const h = g(...args);
        Reflect.defineProperty(h, "name", {value: f.name});
        return new Proxy(h, handleFun(f, s.nthCall + 1, fRep, fSig, s));
      }
    },

    get: (f, k, p) => {
      switch (k) {
        case "toString": return () => fSig;
        case Symbol.toStringTag: return "Fun";
        case TYPE_REP: return fRep;
        case TYPE_SIG: return fSig;

        case Symbol.toPrimitive: return hint => {
          _throw(
            TypeError,
            ["illegal implicit type conversion"],
            fSig,
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
            fSig,
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
          fSig,
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
          fSig,
          {desc: [
            `of property ${preformatK(k)} with type ${introspect(v)}`,
            "function Objects are immutable"
          ]}
        );
      }
    },

    defineProperty: (f, k, d) => {
      _throw(
        TypeError,
        ["illegal property mutation"],
        fSig,
        {desc: [
          `of property ${preformatK(k)} with type ${introspect(d.value)}`,
          "function Objects are immutable"
        ]}

      );
    },

    deleteProperty: (f, k) => {
      _throw(
        TypeError,
        ["illegal property mutation"],
        funS,
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
        fSig,
        {desc: [
          `of property ${preformatK(k)}`,
          "meta programming is not allowed"
        ]}
      );
    }
  };
};


const verifyNullary = (args, child, fRep) => {
  const [from, to] = child.range;

  if (args.length !== 0) _throw(
    ArityError,
    [`${fRep.name} expects 0 arguments`],
    serialize(fRep),
    {range: [from, to], desc: [`${args.length} argument(s) received`]}
  );
};


const verifyUnary = (args, child, fRep) => {
  const [from, to] = child.range;

  if (args.length !== 1) _throw(
    ArityError,
    [`${fRep.name} expects 1 argument`],
    serialize(fRep),
    {range: [from, to], desc: [`${args.length} argument(s) received`]}
  );
};


/******************************************************************************
*****[ 7.2. Algebraic Data Types ]*********************************************
******************************************************************************/


export const Adt = (tcons, tSig, ...cases) => {
  const tRep = deserialize(tSig),
    tvars = tSig.match(/\b[a-z]\b/g);

  if (types) {
    const tSigs = new Map();

    cases.forEach(vcons => {
      if (TYPE_SIG in vcons) {
        const typeSig_ = vcons[TYPE_SIG],
          typeRep_ = deserialize(typeSig_);

        if (typeSig_.search(/^\([a-z0-9_]+ :: /i) !== 0) _throw(
          TypeError,
          [`value constructors must have a named type annotations`],
          `(name :: ${typeSig_.slice(1)}`,
          {range: [1, 8]}
        );

        else if (typeSig_.search(/^\(_?[A-Z]/) !== 0) _throw(
          TypeError,
          [`value constructors must have capitalized names`],
          typeSig_,
          {range: [1, 1]}
        );

        const tvars_ = typeSig_.match(/\b[a-z]\b/g);

        tvars_.forEach(tvar => {
          if (!tvars.includes(tvar)) {
            const from = typeSig_.search(new RegExp(`\\b${tvar}\\b`)),
              to = from;

            _throw(
              TypeError,
              [`invalid value constructor for type "${tSig}"`],
              typeSig_,
              {range: [from, to], desc: ["type variable out of scope"]}
            );
          }
        });
      
        if (serialize(last(typeRep_.children)[0]) !== tSig) {
          const [from, to] = last(typeRep_.children)[0].range;

          _throw(
            TypeError,
            [`invalid value constructor`],
            typeSig_,
            {range: [from, to], desc: [`${typeRep_.name} must return values of type "${tSig}"`]}
          );
        }

        tSigs.set(typeRep_.name, typeSig_);
      }

      else _throw(
        TypeError,
        [`invalid value constructor`],
        "missing type annotation",
        {desc: [`${typeRep_.name} must be a typed function`]}
      );
    });

    return f => {
      const adt = new Proxy(new tcons(), handleAdt(tRep, tSig, tSigs));
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


const handleAdt = (tRep, tSig, tSigs) => ({
  get: (o, k, p) => {
    switch (k) {
      case "run": return cases => {
        Object.keys(cases).forEach(k => {
          if (!tSigs.has(k)) _throw(
            TypeError,
            [`illegal application of type "${tSig}"`],
            Array.from(tSigs).map(([k, v]) => `${k}: ${v}`).join("\n"),
            {desc: [`unnecessary case "${k}"`]}
          );

          else if (!(TYPE_REP in cases[k])) _throw(
            TypeError,
            [`illegal application of type "${tSig}"`],
            Array.from(tSigs).map(([k, v]) => `${k}: ${v}`).join("\n"),
            {desc: [`case "${k}" is associated with an untyped value`]}
          );

          else if (cases[k][TYPE_REP].tag !== "Fun") _throw(
            TypeError,
            [`illegal application of type "${tSig}"`],
            Array.from(tSigs).map(([k, v]) => `${k}: ${v}`).join("\n"),
            {desc: [`case "${k}" is associated with a non-function value`]}
          );
        });

        tSigs.forEach((v, k) => {
          if (!(k in cases)) _throw(
            TypeError,
            [`illegal application of type "${tSig}"`],
            Array.from(tSigs).map(([k, v]) => `${k}: ${v}`).join("\n"),
            {desc: [`missing case "${k}"`]}
          );

          matchFun(k, deserialize(v), v, cases[k] [TYPE_REP], cases[k] [TYPE_SIG], tSig);
        });

        return o.run(cases);
      }

      case "toString": return () => tSig;
      case Symbol.toStringTag: return "Adt";
      case TYPE_REP: return tRep;
      case TYPE_SIG: return tSig;

      case Symbol.toPrimitive: return hint => {
        _throw(
          TypeError,
          ["illegal implicit type conversion"],
          tSig,
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
          tSig,
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
        tSig,
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
      
      case TYPE_REP: return tRep = v, o; 
      case TYPE_SIG: return tSig = v, o;

      default: _throw(
        TypeError,
        ["illegal property mutation"],
        tSig,
        {desc: [
          `of property ${preformatK(k)} with type ${introspect(v)}`,
          "function Objects are immutable"
        ]}
      );
    }
  },

  defineProperty: (o, k, d) => {
    _throw(
      TypeError,
      ["illegal property mutation"],
      tSig,
      {desc: [
        `of property ${preformatK(k)} with type ${introspect(d.value)}`,
        "function Objects are immutable"
      ]}

    );
  },

  deleteProperty: (o, k) => {
    _throw(
      TypeError,
      ["illegal property mutation"],
      tSig,
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
      tSig,
      {desc: [
        `of property ${preformatK(k)}`,
        "meta programming is not allowed"
      ]}
    );
  }
});


const constructType = (adt, constraints) => {
  let rep, sig = adt[TYPE_SIG];

  constraints.forEach((v, k) => {
    sig = adt[TYPE_SIG].replace(new RegExp(`\\b${k}\\b`), v);
  });

  rep = deserialize(sig);
  return [rep, sig];
};


const match = (_case, nomT, nomS, realT, realS, tSig) => {
  switch (nomT.constructor.name) {
    case "AdtT": return matchAdt(_case, nomT, nomS, realT, realS, tSig);
    case "ArrT": return matchArr(_case, nomT, nomS, realT, realS, tSig);
    case "FunT": return matchFun(_case, nomT, nomS, realT, realS, tSig);
    case "_MapT": return matchMap(_case, nomT, nomS, realT, realS, tSig);
    case "PrimT": return matchPrim(_case, nomT, nomS, realT, realS, tSig);
    case "PolyT": return matchTvar(_case, nomT, nomS, realT, realS, tSig);
    case "RecT": return matchRec(_case, nomT, nomS, realT, realS, tSig);
    case "TupT": return matchTup(_case, nomT, nomS, realT, realS, tSig);
  }
};


const matchAdt = (_case, nomT, nomS, realT, realS, tSig) => {
  if (nomT.tag !== realT.tag) {
    const [from, to] = nomT.range;

    _throw(
      TypeError,
      [`${tSig} case "${_case}" expects`],
      nomS,
      {range: [from, to], desc: [`${serialize(realT)} received`]}
    );
  }

  return nomT.children
    .forEach((xT, n) => {
      const nomT_ = xT[0],
        nomS_ = serialize(nomT_),
        realT_ = realT.children[n][0],
        realS_ = serialize(realT_);

      return match(_case, nomT_, nomS_, realT_, realS_, tSig);
    }, constraints);
};


const matchArr = (_case, nomT, nomS, realT, realS, tSig) => {
  if (nomT.tag !== realT.tag) {
    const [from, to] = nomT.range;

    _throw(
      TypeError,
      [`${tSig} case "${_case}" expects`],
      nomS,
      {range: [from, to], desc: [`${serialize(realT)} received`]}
    );
  }

  return nomT.children
    .forEach((xT, n) => {
      const nomT_ = xT[0],
        nomS_ = serialize(nomT_),
        realT_ = realT.children[n][0],
        realS_ = serialize(realT_);

      return match(_case, nomT_, nomS_, realT_, realS_, tSig);
    }, constraints);
};


const matchFun = (_case, nomT, nomS, realT, realS, tSig) => {
  if (nomT.children.length !== realT.children.length) {
    const [from, to] = nomT.range;

    _throw(
      ArityError,
      [`${tSig} case "${_case}" expects`],
      nomS,
      {range: [from, to], desc: [`${realS} received`]}
    );
  }

  nomT.children
    .forEach((xT, n) => {
      switch (xT.constructor.name) {
        case "ArgT":
        case "NoArgT":
        case "RestT": {
          if (xT.constructor.name !== realT.children[n].constructor.name) {
            const [from, to] = nomT.range;

            _throw(
              ArityError,
              [`${tSig} case "${_case}" expects`],
              nomS,
              {range: [from, to], desc: [`${realS} received`]}
            );
          }

          else if (xT.constructor.name === "NoArgT") return;

          else {
            const nomT_ = xT[0],
              nomS_ = serialize(nomT_),
              realT_ = realT.children[n][0],
              realS_ = serialize(realT_);

            return match(_case, nomT_, nomS_, realT_, realS_, tSig);
          }
        }

        case "ReturnT": return;
      }
    });
};


const matchMap = (_case, nomT, nomS, realT, realS, tSig) => {
  if (nomT.tag !== realT.tag) {
    const [from, to] = nomT.range;

    _throw(
      TypeError,
      [`${tSig} case "${_case}" expects`],
      nomS,
      {range: [from, to], desc: [`${serialize(realT)} received`]}
    );
  }

  return nomT.children
    .forEach((xT, n) => {
      const {k: nominalKeyT, v: nominalValT} = xT[0],
        nominalKeyS = serialize(nominalKeyT),
        nominalValS = serialize(nominalValT),
        realKeyT = realT.children[n][0].k,
        realValT = realT.children[n][0].v,
        realKeyS = serialize(realKeyT),
        realValS = serialize(realValT);

      match(_case, nominalKeyT, nominalKeyS, realKeyT, realKeyS, tSig);
      return match(_case, nominalValT, nominalValS, realValT, realValS, tSig);
    });
};


const matchPrim = (_case, nomT, nomS, realT, realS, tSig) => {
  if (nomT.tag !== realT.tag) {
    const [from, to] = nomT.range;

    _throw(
      TypeError,
      [`${tSig} case "${_case}" expects`],
      nomS,
      {range: [from, to], desc: [`${serialize(realT)} received`]}
    );
  }
};


const matchTvar = (_case, nomT, nomS, realT, realS, tSig) => {};


const matchRec = (_case, nomT, nomS, realT, realS, tSig) => {
  if (nomT.tag !== realT.tag) {
    const [from, to] = nomT.range;

    _throw(
      TypeError,
      [`${tSig} case "${_case}" expects`],
      nomS,
      {range: [from, to], desc: [`${serialize(realT)} received`]}
    );
  }

  return nomT.children
    .forEach((xT, n) => {
      const {k: nominalKey, v: nominalValT} = xT[0],
        nominalValS = serialize(nominalValT),
        realKey = realT.children[n][0].k,
        realValT = realT.children[n][0].v,
        realValS = serialize(realValT);

      if (nominalKey !== realKey) {
        // TODO: add key range
        _throw(
          TypeError,
          [`${tSig} case "${_case}" expects`],
          tSig,
          {range: [0, -1], desc: [`${realKey} received`]}
        );
      }

      return match(_case, nominalValT, nominalValS, realValT, realValS, tSig);
    }, constraints);
};


const matchTup = (_case, nomT, nomS, realT, realS, tSig) => {
  if (nomT.tag !== realT.tag) {
    const [from, to] = nomT.range;

    _throw(
      TypeError,
      [`${tSig} case "${_case}" expects`],
      nomS,
      {range: [from, to], desc: [`${serialize(realT)} received`]}
    );
  }

  return nomT.children
    .forEach((xT, n) => {
      const nomT_ = xT[0],
        nomS_ = serialize(nomT_),
        realT_ = realT.children[n][0],
        realS_ = serialize(realT_);

      return match(_case, nomT_, nomS_, realT_, realS_, tSig);
    }, constraints);
};


/******************************************************************************
*****[ 7.3. Arrays ]***********************************************************
******************************************************************************/


const _Arr = ({immu = false, sig = ""}) => xs => {
  if (types) {
    if (introspect(xs) !== "Array") _throw(
      TypeError,
      ["Arr expects an Array"],
      introspect(xs),
      {desc: ["received"]}
    );

    else if (TYPE_REP in xs) _throw(
      TypeError,
      ["Arr expects an untyped Array"],
      xs[TYPE_SIG],
      {desc: ["received (illegal retyping)"]}
    );

    let tSig = introspectR(xs);

    if (xs.length === 0) {
      if (sig === "") _throw(
        TypeError,
        ["Arr received an empty Array without type annotation"],
        "[?]",
        {desc: ["explicit type annotation necessary"]}
      );

      else tSig = sig;
    }

    const tRep = deserialize(tSig),
      voidPattern = new RegExp(`\\b(?:${Object.keys(VOID).join("|")})\\b`);

    if (tRep.children.length > 1) _throw(
      TypeError,
      ["Arr expects homogeneous Array"],
      tSig,
      {desc: [`mixed typed values received`]}
    );

    else if (tSig.search(voidPattern) !== -1) {
      const {index: from, 0: match} = tSig.match(voidPattern),
        to = from + match.length - 1;

      _throw(
        TypeError,
        ["Arr must not contain void values"],
        tSig,
        {range: [from, to], desc: [`${match} received`]}
      );
    }

    return new Proxy(xs, handleArr(tRep, tSig, immu));
  }

  else return xs;
};


export const Arr = _Arr({});


export const Iarr = _Arr({immu: true})


export const Earr = tSig => _Arr({sig: tSig});


const handleArr = (tRep, tSig, immu) => ({
  get: (xs, i, p) => {
    switch (i) {
      case "toString": return () => tSig;
      case Symbol.toStringTag: return "Arr";
      case Symbol.isConcatSpreadable: return xs[Symbol.isConcatSpreadable];
      case TYPE_REP: return tRep;
      case TYPE_SIG: return tSig;

      case Symbol.toPrimitive: return hint => {
        _throw(
          TypeError,
          ["illegal implicit type conversion"],
          tSig,
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
          tSig,
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
          tSig,
          {desc: [
            `of property ${preformatK(i)}`,
            "duck typing is not allowed"
          ]}
        );
      }
    }

    else return i in xs;
  },

  set: (xs, i, v, p) => setArr(tRep, tSig, immu, xs, i, {value: v}, "set"),
  defineProperty: (xs, i, d) => setArr(tRep, tSig, immu, xs, i, d, "def"),

  deleteProperty: (xs, i) => {
    if (immu) _throw(
      TypeError,
      ["illegal property deletion"],
      tSig,
      {desc: [
        `of property ${preformatK(i)}`,
        "immutable Array"
      ]}
    );

    else {
      if (Number.isNaN(Number(i))) _throw(
        TypeError,
        ["illegal property deletion"],
        tSig,
        {desc: [
          `of property ${preformatK(i)}`,
          "do not use Arrays as Objects"
        ]}
      );

      else {
        if (Number(i) !== xs.length - 1) _throw(
          TypeError,
          ["illegal property deletion"],
          tSig,
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
    tSig,
    {desc: [
      `of property ${preformatK(i)}`,
      "meta programming is not allowed"
    ]}
  )
});


const setArr = (tRep, tSig, immu, xs, i, d, mode) => {
  if (immu) _throw(
    TypeError,
    ["illegal property mutation"],
    tSig,
    {desc: [
      `of property ${preformatK(i)} with type ${introspect(d.value)}`,
      "immutable Array"
    ]}
  );

  else {
    if (Number.isNaN(Number(i))) _throw(
      TypeError,
      ["illegal property setting"],
      tSig,
      {desc: [
        `of property ${preformatK(i)} with type ${introspect(d.value)}`,
        "do not use Arrays as Objects"
      ]}
    );

    else {
      if (Number(i) > xs.length) _throw(
        TypeError,
        ["illegal property setting"],
        tSig,
        {desc: [
          `of property ${preformatK(i)} with type ${introspect(d.value)}`,
          `where Array includes only ${xs.length} elements`,
          "index gaps are not allowed"
        ]}
      );

      else if (tSig !== `[${introspectR(d.value)}]`) {
        const [from, to] = tRep.children[0].range;

        _throw(
          TypeError,
          ["illegal property mutation"],
          tSig,
          {range: [from, to], desc: [
            `of property ${preformatK(i)} with type ${introspect(d.value)}`,
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
*****[ 7.4. Tuples ]***********************************************************
******************************************************************************/


const _Tup = ({immu = false}) => xs => {
  if (types) {
    if (introspect(xs) !== "Array") _throw(
      TypeError,
      ["Tup expects an Array"],
      introspect(xs),
      {desc: ["received"]}
    );

    else if (TYPE_REP in xs) _throw(
      TypeError,
      ["Tup expects an untyped Array"],
      xs[TYPE_SIG],
      {desc: ["received (illegal retyping)"]}
    );

    const tSig = introspectR(xs);

    if (xs.length < 2) _throw(
      TypeError,
      ["Tup received an invalid Array"],
      tSig,
      {range: [0, tSig.length - 1], desc: ["Tuples must comprise at least 2 fields"]}
    );

    const tRep = deserialize(tSig),
      voidPattern = new RegExp(`\\b(?:${Object.keys(VOID).join("|")})\\b`);

    if (tSig.search(voidPattern) !== -1) {
      const {index: from, 0: match} = tSig.match(voidPattern),
        to = from + match.length - 1;

      _throw(
        TypeError,
        ["Tup must not contain void values"],
        tSig,
        {range: [from, to], desc: [`${match} received`]}
      );
    }

    return new Proxy(xs, handleTup(tRep, tSig, immu));
  }

  else return xs;
};


export const Tup = _Tup({});


export const Itup = _Tup({immu: true});


const handleTup = (tRep, tSig, immu) => ({
  get: (xs, i, p) => {
    switch (i) {
      case "toString": return () => tSig;
      case Symbol.toStringTag: return "Tup";
      case Symbol.isConcatSpreadable: return xs[Symbol.isConcatSpreadable];
      case TYPE_REP: return tRep;
      case TYPE_SIG: return tSig;

      case Symbol.toPrimitive: return hint => {
        _throw(
          TypeError,
          ["illegal implicit type conversion"],
          tSig,
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
          tSig,
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
        tSig,
        {desc: [
          `of property ${preformatK(i)}`,
          "duck typing is not allowed"
        ]}
      );
    }
  },

  set: (xs, i, v, p) => setTup(tRep, tSig, immu, xs, i, {value: v}, "set"),
  defineProperty: (xs, i, d) => setTup(tRep, tSig, immu, xs, i, d, "def"),

  deleteProperty: (xs, i) => _throw(
    TypeError,
    ["illegal property deletion"],
    tSig,
    {desc: [
      `of property ${preformatK(i)}`,
      "Tuples are either immutable or sealed"
    ]}
  ),

  ownKeys: xs => _throw(
    TypeError,
    ["illegal property introspection"],
    tSig,
    {desc: [
      `of property ${preformatK(i)}`,
      "meta programming is not allowed"
    ]}
  )
});


const setTup = (tRep, tSig, immu, xs, i, d, mode) => {
  if (immu) _throw(
    TypeError,
    ["illegal property mutation"],
    tSig,
    {desc: [
      `of property ${preformatK(i)} with type ${introspect(d.value)}`,
      "immutable Tuple"
    ]}
  );

  else {
    if (Number.isNaN(Number(i))) _throw(
      TypeError,
      ["illegal property setting"],
      tSig,
      {desc: [
        `of property ${preformatK(i)} with type ${introspect(d.value)}`,
        "do not use Tuples as Objects"
      ]}
    );

    else {
      if (Number(i) >= xs.length) _throw(
        TypeError,
        ["illegal property setting"],
        tSig,
        {desc: [
          `of property ${preformatK(i)} with type ${introspect(d.value)}`,
          `where Tuple includes only ${xs.length} fields`,
          "sealed Tuple"
        ]}
      );

      else if (serialize(tRep.children[i]) !== `${introspect(d.value)}`) {
        const [from, to] = tRep.children[0].range;

        _throw(
          TypeError,
          ["illegal property mutation"],
          tSig,
          {range: [from, to], desc: [
            `of property ${preformatK(i)} with type ${introspect(d.value)}`,
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
*****[ 7.5. Maps ]*************************************************************
******************************************************************************/


const __Map = ({immu = false, sig = ""}) => map => {
  if (types) {
    if (introspect(map) !== "Map") _throw(
      TypeError,
      ["_Map expects a Map"],
      introspect(map),
      {desc: ["received"]}
    );

    else if (TYPE_REP in map) _throw(
      TypeError,
      ["_Map expects an untyped Map"],
      map[TYPE_SIG],
      {desc: ["received (illegal retyping)"]}
    );

    let tSig = introspectR(map);

    if (map.size === 0) {
      if (sig === "") _throw(
        TypeError,
        ["_Map received an empty Map without type annotation"],
        "[?]",
        {desc: ["explicit type annotation necessary"]}
      );

      else tSig = sig;
    }

    const tRep = deserialize(tSig),
      voidPattern = new RegExp(`\\b(?:${Object.keys(VOID).join("|")})\\b`);

    if (tRep.children.length > 1) _throw(
      TypeError,
      ["_Map expects homogeneous Map"],
      tSig,
      {desc: [`mixed typed values received`]}
    );

    else if (tSig.search(voidPattern) !== -1) {
      const {index: from, 0: match} = tSig.match(voidPattern),
        to = from + match.length - 1;

      _throw(
        TypeError,
        ["_Map must not contain void values"],
        tSig,
        {range: [from, to], desc: [`${match} received`]}
      );
    }

    return new Proxy(map, handleMap(tRep, tSig, immu));
  }

  else return map;
};


export const _Map = __Map({});


export const Imap = __Map({immu: true})


export const Emap = tSig => __Map({sig: tSig});


const handleMap = (tRep, tSig, immu) => ({
  get: (map, k, p) => {
    switch (k) {
      case "toString": return () => tSig;
      case Symbol.toStringTag: return "_Map";
      case Symbol.isConcatSpreadable: return map[Symbol.isConcatSpreadable];
      case TYPE_REP: return tRep;
      case TYPE_SIG: return tSig;

      case Symbol.toPrimitive: return hint => {
        _throw(
          TypeError,
          ["illegal implicit type conversion"],
          tSig,
          {desc: [
            `must not be converted to ${capitalize(hint)} primitive`,
            "use explicit type casts instead"
          ]}
        );
      };

      case "get": k => {
        if (map.has(k)) return map.get(k);

        else _throw(
          TypeError,
          ["illegal property access"],
          tSig,
          {desc: [`unknown key ${preformatK(introspect(k))}`]}
        );
      };

      case "set": (k, v) => {
        if (immu) _throw(
          TypeError,
          ["illegal property mutation"],
          tSig,
          {desc: [
            `of property ${preformatK(introspect(k))} with type ${introspect(d.value)}`,
            "immutable Map"
          ]}
        );

        else {
          if (introspectR(k) !== tRep.children[0].k) {
            // TODO: range for keys            

            _throw(
              TypeError,
              ["illegal property mutation"],
              tSig,
              {range: [0, -1], desc: [ 
                `of key ${preformatK(introspect(k))} with type ${introspect(d.value)}`,
                "heterogeneous Maps are not allowed"
              ]}
            );
          }

          else if (introspectR(v) !== tRep.children[0].v) {
            const [from, to] = tRep.children[0].v.range;

            _throw(
              TypeError,
              ["illegal property mutation"],
              tSig,
              {range: [from, to], desc: [
                `of property ${preformatK(introspect(k))} with type ${introspect(d.value)}`,
                "heterogeneous Maps are not allowed"
              ]}
            );
          }

          else return map.set(k, v);
        }
      };

      case "delete": k => {
        if (immu) _throw(
          TypeError,
          ["illegal property mutation"],
          tSig,
          {desc: [
            `of key ${preformatK(introspect(k))} with type ${introspect(d.value)}`,
            "immutable Map"
          ]}
        );

        else {
          if (map.has(k)) return map.delete(k);

          else _throw(
            TypeError,
            ["illegal property deletion"],
            tSig,
            {desc: [`unknown key ${preformatK(introspect(k))}`]}
          );
        }
      };

      case "clear": () => {
        if (immu) _throw(
          TypeError,
          ["illegal property mutation"],
          tSig,
          {desc: [
            `of property ${preformatK(introspect(k))} with type ${introspect(d.value)}`,
            "immutable Array"
          ]}
        );

        else return map.clear();
      };

      default: {
        if (k in map) return map[k];

        else _throw(
          TypeError,
          ["illegal property access"],
          tSig,
          {desc: [`unknown property ${preformatK(k)}`]}
        );
      }
    }
  },

  has: (map, k, p) => {
    switch (k) {
      case TYPE_SIG: return true;
      case TYPE_REP: return true;

      default: _throw(
        TypeError,
        ["illegal property introspection"],
        tSig,
        {desc: [
          `of property ${preformatK(k)}`,
          "duck typing is not allowed"
        ]}
      );
    }
  },

  set: (map, k, v, p) => {
    switch (k) {
      case "toString": return map[k] = v, map;

      default: _throw(
        TypeError,
        ["illegal property mutation"],
        tSig,
        {desc: [
          `of property ${preformatK(k)} with type ${introspect(v)}`,
          "map Objects are immutable"
        ]}
      );
    }
  },

  defineProperty: (map, k, d) => {
    _throw(
      TypeError,
      ["illegal property mutation"],
      tSig,
      {desc: [
        `of property ${preformatK(k)} with type ${introspect(d.value)}`,
        "map Objects are immutable"
      ]}

    );
  },

  deleteProperty: (map, k) => {
    _throw(
      TypeError,
      ["illegal property mutation"],
      tSig,
      {desc: [
        `removal of property ${preformatK(k)}`,
        "map Objects are immutable"
      ]}
    );
  },

  ownKeys: map => _throw(
    TypeError,
    ["illegal property introspection"],
    tSig,
    {desc: [
      `of property ${preformatK(k)}`,
      "meta programming is not allowed"
    ]}
  )
});


/******************************************************************************
*****[ 7.6. Records ]**********************************************************
******************************************************************************/


const _Rec = ({immu = false, sig = ""}) => o => {
  if (types) {
    if (introspect(o) !== "Object") _throw(
      TypeError,
      ["Rec expects an Object"],
      introspect(o),
      {desc: ["received"]}
    );

    else if (TYPE_REP in o) _throw(
      TypeError,
      ["Rec expects an untyped Object"],
      o[TYPE_SIG],
      {desc: ["received (illegal retyping)"]}
    );

    let tSig = introspectR(o);

    if (Object.keys(o).length === 0) _throw(
      TypeError,
      ["Tup received an invalid Array"],
      tSig,
      {range: [0, tSig.length - 1], desc: ["Records must comprise at least 1 field"]}
    );

    const tRep = deserialize(tSig),
      voidPattern = new RegExp(`\\b(?:${Object.keys(VOID).join("|")})\\b`);

    if (tSig.search(voidPattern) !== -1) {
      const {index: from, 0: match} = tSig.match(voidPattern),
        to = from + match.length - 1;

      _throw(
        TypeError,
        ["Rec must not contain void values"],
        tSig,
        {range: [from, to], desc: [`${match} received`]}
      );
    }

    return new Proxy(o, handleRec(tRep, tSig, immu));
  }

  else return o;
};


export const Rec = _Rec({});


export const Irec = _Rec({immu: true})


const handleRec = (tRep, tSig, immu) => ({
  get: (o, k, p) => {
    switch (k) {
      case "toString": return () => tSig;
      case Symbol.toStringTag: return "Rec";
      case Symbol.isConcatSpreadable: return o[Symbol.isConcatSpreadable];
      case TYPE_REP: return tRep;
      case TYPE_SIG: return tSig;

      case Symbol.toPrimitive: return hint => {
        _throw(
          TypeError,
          ["illegal implicit type conversion"],
          tSig,
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
          tSig,
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
        tSig,
        {desc: [
          `of property ${preformatK(k)}`,
          "duck typing is not allowed"
        ]}
      );
    }
  },

  set: (o, k, v, p) => setRec(tRep, tSig, immu, o, k, {value: v}, "set"),
  defineProperty: (o, k, d) => setRec(tRep, tSig, immu, o, k, d, "def"),

  deleteProperty: (o, k) => _throw(
    TypeError,
    ["illegal property deletion"],
    tSig,
    {desc: [
      `of property ${preformatK(k)}`,
      "Records are either immutable or sealed"
    ]}
  ),

  ownKeys: o => _throw(
    TypeError,
    ["illegal property introspection"],
    tSig,
    {desc: [
      `of property ${preformatK(k)}`,
      "meta programming is not allowed"
    ]}
  )
});


const setRec = (tRep, tSig, immu, o, k, d, mode) => {
  if (immu) _throw(
    TypeError,
    ["illegal property mutation"],
    tSig,
    {desc: [
      `of property ${preformatK(k)} with type ${introspect(d.value)}`,
      "immutable Record"
    ]}
  );

  else {
    if (introspect(k) !== "String") _throw(
      TypeError,
      ["illegal property mutation"],
      tSig,
      {desc: [`invalid key type ${introspect(k)}`]}
    );

    else if (!(k in o)) _throw(
      TypeError,
      ["illegal property mutation"],
      tSig,
      {desc: [`unknown key "${k}"`]}
    );

    else if (serialize(tRep.children[k]) !== `${introspect(d.value)}`) {
      const [from, to] = tRep.children[0].range;

      _throw(
        TypeError,
        ["illegal property mutation"],
        tSig,
        {range: [from, to], desc: [
          `of property ${preformatK(k)} with type ${introspect(d.value)}`,
          "fields must maintain their type"
        ]}
      );
    }

    else {
      if (mode === "set") o[k] = d.value;
      else Reflect.defineProperty(o, k, d);
      return true;
    }
  }
};


/******************************************************************************
*****[ 7.7. Subtypes ]*********************************************************
******************************************************************************/


class Int extends Number {
  [Symbol.toPrimitive](t) {
    throw new Error("coerced!");
  }
}


/******************************************************************************
*****[ 7.8. Errors ]***********************************************************
******************************************************************************/


//***[ 7.8.1. Subtypes ]*******************************************************


class TypeSysError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, TypeSysError);
  }
};


class ArityError extends TypeSysError {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ArityError);
  }
};


class ReturnTypeError extends TypeSysError {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ReturnTypeError);
  }
};


class TypeInferenceError extends TypeSysError {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, TypeInferenceError);
  }
};


class TypeRepError extends TypeSysError {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, TypeRepError);
  }
};


class TypeSigError extends TypeSysError {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, TypeSigError);
  }
};


//***[ 7.8.2. Formatting ]*****************************************************


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


const _throw = (Cons, title, subject, {range = [0, -1], desc = []}) => {
  const [from, to] = range;

  throw new Cons(title
    .join("\n")
    .concat(`\n\n${subject}`)
    .concat(range.length === 2 ? `\n${ul(from, to)}` : "")
    .concat(desc.length === 0 ? "" : `\n\n${desc.join("\n\n")}`)
    .concat("\n")
  );
};


/******************************************************************************
*******************************************************************************
*****************************[ 8. MISCALLANIOUS ]******************************
*******************************************************************************
******************************************************************************/


const capitalize = s => s[0].toUpperCase() + s.slice(1);


const last = xs => xs[xs.length - 1];


/******************************************************************************
*******************************************************************************
*****************************[ 9. BUILT-IN TYPES ]*****************************
*******************************************************************************
******************************************************************************/


/******************************************************************************
*****[ 9.1. Value Types ]******************************************************
******************************************************************************/


//***[ 9.1.1. Reference Types ]************************************************


const xor = x => y => !x === !y ? false : true;


/******************************************************************************
*****[ 9.2. Function Types ]***************************************************
******************************************************************************/


//***[ 9.2.1. Generator Functions ]********************************************


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


const nextV = ix => ix.next().value;