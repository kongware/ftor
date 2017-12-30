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


const LESS_GEN = 0;


const EQ_GEN = 1;


const MORE_GEN = 2;


const NO_MGU = 3;


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
                  IntrospectionError,
                  ["invalid Tuple"],
                  x,
                  {desc: [
                    `Tuple must not contain more than ${TUP_MAX_FIELDS} fields`,
                    `${ss.length} fields received`
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


const AdtT = (Cons => (range, tag, children) => new Cons(range, tag, children))
  (class AdtT {
    constructor(range, tag, children) {
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
      this.value = child;
    }
  });


const NoArgT = (Cons => range => new Cons(range))
  (class NoArgT {
    constructor(range) {
      this.range = range;
      this.value = null;
    }
  });


const RestT = (Cons => child => new Cons(child))
  (class RestT {
    constructor(child) {
      this.value = child;
    }
  });


const ReturnT = (Cons => child => new Cons(child))
  (class ReturnT {
    constructor(child) {
      this.value = child;
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
*****[ 3.10. Misc ]************************************************************
******************************************************************************/


const cloneT = xT => {
  switch (xT.constructor.name) {
    case "AdtT": return deserialize(serialize(AdtT(xT.range, xT.tag, xT.children)));
    case "ArrT": return deserialize(serialize(ArrT(xT.range, xT.children)));
    case "FunT": return deserialize(serialize(FunT(xT.name, xT.range, xT.children)));
    case "_MapT": return deserialize(serialize(_MapT(xT.range, xT.children)));
    case "PolyT": return deserialize(serialize(PolyT(xT.range, xT.tag)));
    case "PrimT": return deserialize(serialize(PrimT(xT.range, xT.tag)));
    case "RecT": return deserialize(serialize(RecT(xT.range, xT.children)));
    case "TupT": return deserialize(serialize(TupT(xT.range, xT.children)));
    case "UnitT": return deserialize(serialize(UnitT(xT.range)));
  }
};


const sliceFunT = funT => {
  return deserialize(
    serialize(
      FunT(funT.name, funT.range, funT.children.slice(1))
    )
  );
};


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
            const {tag: tag_, children} = arg.value;
            if (children.length === 0) return tag_;
            else return serialize(arg.value);
          }

          case "RestT": {
            const {tag: tag_, children} = arg.value;
            if (c.length === 0) return `...${tag}`;
            else return `...${serialize(arg.value)}`;
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
              return [AdtT(range, tag, tReps), n + 1, depth - 1];
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
                {depth, context: c_, phase: p, buf: b, name, range: [n - 3], tag: "", tReps: []}
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


const unify = (t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons) => {
  switch (t1Rep.constructor.name) {
    case "AdtT": return unifyAdt(t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons);
    case "ArrT": return unifyArr(t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons);
    case "FunT": return unifyFun(t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons);
    case "_MapT": return unifyMap(t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons);
    case "PolyT": return unifyPoly(t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons);
    case "PrimT": return unifyPrim(t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons);
    case "RecT": return unifyRec(t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons);
    case "TupT": return unifyTup(t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons);
    case "UnitT": return unifyUnit(t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons);
  }
};


const unifyAdt = (t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons) => {

};


const unifyArr = (t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons) => {
  switch (t2Rep.constructor.name) {
    case "AdtT":
    case "FunT":
    case "_MapT":
    case "PrimT":
    case "RecT":
    case "TupT":
    case "UnitT": {
      const range = retrieveRange(fRep, nthArg);

      _throw(
        cons,
        [`${fRep.name || "lambda"} expects`],
        fSig,
        {
          range,
          desc: [`${t2Sig} received`],
          sigLog: state.sigLog,
          constraints: state.constraints
        }
      );
    }

    case "ArrT": {
      return unify(
        t1Rep.children[0],
        serialize(t1Rep.children[0]),
        t2Rep.children[0],
        serialize(t2Rep.children[0]),
        state,
        {mode, nthArg},
        fRep,
        fSig,
        xSig,
        cons
      );
    }

    case "PolyT": {
      return constrain(
        t2Rep,
        serialize(t2Rep),
        t1Rep,
        serialize(t1Rep),
        state,
        {mode, nthArg},
        fRep,
        fSig,
        xSig,
        cons
      );
    }
  }
};


const unifyFun = (t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons) => {
  switch (t2Rep.constructor.name) {
    case "AdtT":
    case "ArrT":
    case "_MapT":
    case "PrimT":
    case "RecT": 
    case "TupT":
    case "UnitT": {
      const range = retrieveRange(fRep, nthArg);

      _throw(
        cons,
        [`${fRep.name || "lambda"} expects`],
        fSig,
        {
          range,
          desc: [`${t2Sig} received`],
          sigLog: state.sigLog,
          constraints: state.constraints
        }
      );
    }
    
    case "FunT": {
      [t2Sig, state.nthPostfix] = fresh(t2Sig, state.nthPostfix);
      t2Rep = deserialize(t2Sig);

      if (t1Rep.children.length < t2Rep.children.length) {
        t1Rep.children.forEach((argRep, n) => {
          if (n === t1Rep.children.length - 1) {
            t2Rep = sliceFunT(t2Rep);

            state = constrain(
              argRep.value,
              serialize(argRep.value),
              t2Rep,
              serialize(t2Rep),
              state,
              {mode, nthArg: n},
              fRep,
              fSig,
              xSig,
              cons
            );

            state = unify(
              argRep.value,
              serialize(argRep.value),
              t2Rep,
              serialize(t2Rep),
              state,
              {mode, nthArg: n},
              fRep,
              fSig,
              xSig,
              cons
            );
          }
          
          else {
            state = constrain(
              argRep.value,
              serialize(argRep.value),
              t2Rep.children[n].value,
              serialize(t2Rep.children[n].value),
              state,
              {mode, nthArg: n},
              fRep,
              fSig,
              xSig,
              cons
            );

            state = unify(
              argRep.value,
              serialize(argRep.value),
              t2Rep.children[n].value,
              serialize(t2Rep.children[n].value),
              state,
              {mode, nthArg: n},
              fRep,
              fSig,
              xSig,
              cons
            );
          }
        });
      }

      else if (t1Rep.children.length > t2Rep.children.length) {
        t2Rep.children.forEach((argRep, n) => {
          if (n === t2Rep.children.length - 1) {
            t1Rep = sliceFunT(t1Rep);

            state = constrain(
              t1Rep,
              serialize(t1Rep),
              argRep.value,
              serialize(argRep.value),
              state,
              {mode, nthArg: n},
              fRep,
              fSig,
              xSig,
              cons
            );

            state = unify(
              t1Rep,
              serialize(t1Rep),
              argRep.value,
              serialize(argRep.value),
              state,
              {mode, nthArg: n},
              fRep,
              fSig,
              xSig,
              cons
            );
          }
          
          else {
            state = constrain(
              t1Rep.children[n].value,
              serialize(t1Rep.children[n].value),
              argRep.value,
              serialize(argRep.value),
              state,
              {mode, nthArg: n},
              fRep,
              fSig,
              xSig,
              cons
            );

            state = unify(
              t1Rep.children[n].value,
              serialize(t1Rep.children[n].value),
              argRep.value,
              serialize(argRep.value),
              state,
              {mode, nthArg: n},
              fRep,
              fSig,
              xSig,
              cons
            );
          }
        });
      }

      else {
        t1Rep.children.forEach((argRep, n) => {
          state = constrain(
            argRep.value,
            serialize(argRep.value),
            t2Rep.children[n].value,
            serialize(t2Rep.children[n].value),
            state,
            {mode, nthArg: n},
            fRep,
            fSig,
            xSig,
            cons
          );
          
          state = unify(
            argRep.value,
            serialize(argRep.value),
            t2Rep.children[n].value,
            serialize(t2Rep.children[n].value),
            state,
            {mode, nthArg: n},
            fRep,
            fSig,
            xSig,
            cons
          );
        });
      }

      return state;
    }

    case "PolyT": {
      return constrain(t2Rep, t2Sig, t1Rep, t1Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons);
    }
  }
};


const unifyMap = (t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons) => {

};


const unifyPoly = (t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons) => {
  return constrain(t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons);
};


const unifyPrim = (t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, cons) => {
  switch (t2Rep.constructor.name) {
    case "AdtT":
    case "ArrT":
    case "FunT":
    case "_MapT":
    case "RecT":
    case "TupT":
    case "UnitT": {
      const range = retrieveRange(fRep, nthArg);

      _throw(
        cons,
        [`${fRep.name || "lambda"} expects`],
        fSig,
        {
          range,
          desc: [`${t2Sig} received`],
          sigLog: state.sigLog,
          constraints: state.constraints
        }
      );
    }

    case "PolyT": {
      return constrain(t2Rep, t2Sig, t1Rep, t1Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons);
    }

    case "PrimT": {
      if (t1Sig !== t2Sig) {
        const range = retrieveRange(fRep, nthArg);

        _throw(
          cons,
          [`${fRep.name || "lambda"} expects`],
          fSig,
          {
            range,
            desc: [`${t2Sig} received`],
            sigLog: state.sigLog,
            constraints: state.constraints
          }
        );
      }

      else return state;
    }
  }
};


const unifyRec = (t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons) => {

};


const unifyTup = (t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons) => {

};


const unifyUnit = (t1Rep, t1Sig, t2Rep, t2Sig, state, {mode, nthArg}, fRep, fSig, xSig, cons) => {

};


const constrain = (kRep, kSig, vRep, vSig, state, {mode, nthArg}, fRep, fSig, xSig, cons) => {
  kSig = kSig.replace(/\([a-z0-9_]+ :: /, "(");
  vSig = vSig.replace(/\([a-z0-9_]+ :: /, "(");

  if (kSig !== vSig) {
    occurs(kRep, kSig, vSig, state, nthArg, fRep, fSig, xSig, cons);
    occurs(vRep, vSig, kSig, state, nthArg, fRep, fSig, xSig, cons);
  }

  if (state.constraints.has(kSig)) {
    const vSig_ = state.constraints.get(kSig),
      vRep_ = deserialize(vSig_);

    if (vSig !== vSig_) {
      return unify(vRep_, vSig_, vRep, vSig, state, {mode, nthArg}, fRep, fSig, xSig, cons);
    }
  }

  else {
    if (mode === "map") {
      if (mgu(kRep, vRep) === LESS_GEN) {
        state.constraints.set(vSig, kSig);
      }

      else state.constraints.set(kSig, vSig);
    }
  }

  if (state.contraConst.has(kSig)) {
    const vSig_ = state.contraConst.get(kSig),
      vRep_ = deserialize(vSig_);

    if (vSig !== vSig_) {
      if (!state.contraSet.has(`${vSig_} ~ ${vSig}`)) {
        state.contraSet.add(`${vSig_} ~ ${vSig}`);
        constrain(vRep_, vSig_, vRep, vSig, state, {mode: "verify", nthArg}, fRep, fSig, xSig, cons);
      }
    }
  }

  else {
    if (!state.constraints.has(kSig)) {
      state.contraConst.set(kSig, vSig);
    }
  }

  if (state.contraConst.has(vSig)) {
    const kSig_ = state.contraConst.get(vSig),
      kRep_ = deserialize(kSig_);

    if (kSig !== kSig_) {
      if (!state.contraSet.has(`${kSig_} ~ ${kSig}`)) {
        state.contraSet.add(`${kSig_} ~ ${kSig}`);
        constrain(kRep_, kSig_, kRep, kSig, state, {mode: "verify", nthArg}, fRep, fSig, xSig, cons);
      }
    }
  }

  else {
    if (!state.constraints.has(vSig)) {
      state.contraConst.set(vSig, kSig);
    }
  }

  return state;
};


const occurs = (kRep, kSig, vSig, state, nthArg, fRep, fSig, xSig, cons) => {
  if (kSig.search(/\b[a-z][0-9]?\b/) !== -1) {
    if (vSig.search(new RegExp(`\\b${kSig}\\b`)) !== -1) {
      const range = retrieveRange(fRep, nthArg);

      _throw(
        cons,
        [`${fRep.name || "lambda"} creates an infinite type`],
        `${fSig} applied to ${xSig}`,
        {
          range,
          desc: [`${kSig} occurs in substitution ${vSig}`],
          sigLog: state.sigLog,
          constraints: state.constraints
        }
      );
    }
  }
};


const fresh = (fSig, nthPostfix) => {
  const fSig_ = fSig.replace(/\b([a-z])\b/g, `$1${nthPostfix}`);
  return [fSig_, fSig_ === fSig ? nthPostfix : nthPostfix + 1];
};


const mgu = (kRep, vRep) => {
  const aux = (kRep, vRep) => {
    switch (kRep.constructor.name) {
      case "AdtT": {

      }

      case "ArrT": {
        switch (vRep.constructor.name) {
          case "ArrT": return aux(kRep.children[0], vRep.children[0]);
          case "FunT": return NO_MGU;
          case "PrimT": return NO_MGU;
          case "PolyT": return LESS_GEN;
        }
      }

      case "FunT": {
        switch (vRep.constructor.name) {
          case "ArrT": return NO_MGU;
          
          case "FunT": {
            return mguFun(kRep, vRep, 0, aux);
          }
          
          case "PrimT": return NO_MGU;
          case "PolyT": return LESS_GEN;
        }
      }

      case "_MapT": {

      }
      
      case "PrimT": {
        switch (vRep.constructor.name) {
          case "ArrT": return NO_MGU;
          case "FunT": return NO_MGU;
          case "PrimT": return EQ_GEN;
          case "PolyT": return LESS_GEN;
        }
      }

      case "PolyT": {
        switch (vRep.constructor.name) {
          case "ArrT": return MORE_GEN;
          case "FunT": return MORE_GEN;
          case "PrimT": return MORE_GEN;
          
          case "PolyT": {
            kTvars.add(kRep.tag);
            vTvars.add(vRep.tag);
            return EQ_GEN;
          }
        }
      }

      case "RecT": {

      }
      
      case "TupT": {

      }
      
      case "UnitT": {

      }
    }
  };

  const kTvars = new Set(),
    vTvars = new Set(),
    r = aux(kRep, vRep, new Set(), new Set());

  if (r === NO_MGU) return EQ_GEN;

  else {
    if (r === EQ_GEN) {
      if (kTvars.size < vTvars.size) return LESS_GEN;
      else if (kTvars.size > vTvars.size) return MORE_GEN;
      else return EQ_GEN;
    }

    else return r;
  }
};


const mguFun = (kRep, vRep, n, aux) => {
  const kArgRep = kRep.children[n],
    vArgRep = vRep.children[n];

  switch (kArgRep.constructor.name) {
    case "ArgT": {
      switch (vArgRep.constructor.name) {
        case "ArgT": {
          const r = aux(kArgRep.value, vArgRep.value);

          if (r === EQ_GEN) {
            return mguFun(kRep, vRep, n + 1, aux);
          }

          else return r;
        }
        
        case "RestT": {
          if (kArgRep.value.tag === "Arr") {
            const r = aux(kArgRep.value[0], vArgRep.value);

            if (r === EQ_GEN) {
              return mguFun(kRep, vRep, n + 1, aux);
            }

            else return r;
          }

          else return NO_MGU;
        }

        case "NoArgT": return NO_MGU;

        case "ReturnT": {
          if (kArgRep.value.constructor.name === "PolyT") {
            return MORE_GEN;
          }

          else return NO_MGU;
        }
      }
    }

    case "RestT": {
      switch (vArgRep.constructor.name) {
        case "ArgT": {
          if (vArgRep.value.tag === "Arr") {
            const r = aux(kArgRep.value, vArgRep.value[0]);

            if (r === EQ_GEN) {
              return mguFun(kRep, vRep, n + 1, aux);
            }

            else return r;
          }

          else return NO_MGU;
        }
        
        case "RestT": {
          const r = aux(kArgRep.value, vArgRep.value);

          if (r === EQ_GEN) {
            return mguFun(kRep, vRep, n + 1, aux);
          }

          else return r;
        }

        case "NoArgT":
        case "ReturnT": return NO_MGU;
      }
    }

    case "NoArgT": {
      switch (vArgRep.constructor.name) {
        case "NoArgT": return mguFun(kRep, vRep, n + 1, aux);
        default: return NO_MGU;
      }
    }

    case "ReturnT": {
      switch (vArgRep.constructor.name) {
        case "ArgT": {
          if (vArgRep.value.constructor.name === "PolyT") {
            return LESS_GEN;
          }

          else return NO_MGU;
        }
        
        case "ReturnT": {
          return aux(kArgRep.value, vArgRep.value);
        }

        default: return NO_MGU;
      }
    }
  }
};


const substitute = (fSig, constraints) => {
  const aux = (fSig, fSig_) => {
    constraints.forEach((v, k) => {
      if (fSig.search(new RegExp(`\\b${escapeRegExp(k)}\\b`)) !== -1) {
        if (v[0] === "(") {
          fSig = fSig.replace(new RegExp(`\\b${escapeRegExp(k)}$`), v.slice(1, -1));
          fSig = fSig.replace(new RegExp(`\\b${escapeRegExp(k)}(?=\\))`, "g"), v.slice(1, -1));
          fSig = fSig.replace(new RegExp(`\\b${escapeRegExp(k)}\\b`, "g"), v);
        }

        else {
          fSig = fSig.replace(new RegExp(`\\b${escapeRegExp(k)}\\b`, "g"), v);
        }
      }
    });

    if (fSig === fSig_) return [deserialize(fSig), fSig];
    else return aux(fSig, fSig);
  };

  return aux(fSig, fSig);
};


/******************************************************************************
*****[ 6.1. Misc ]*************************************************************
******************************************************************************/


const escapeRegExp = s => s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");


const retrieveRange = (fRep, nthArg) => {
  if (nthArg === null) {
    const argRep = fRep.children[0];

    switch (argRep.constructor.name) {
      case "ArgT":
      case "RestT":
      case "ReturnT": return argRep.value.range;
      case "NoArgT": return argRep.range;
    }
  }

  else {
    const argRep = fRep.children[0].value.children[nthArg];

    switch (argRep.constructor.name) {
      case "ArgT":
      case "RestT":
      case "ReturnT": return argRep.value.range;
      case "NoArgT": return argRep.range;
    }
  }
};


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

    if (fRep.name !== "") {
      Reflect.defineProperty(f, "name", {value: fRep.name || "lambda"});
    }

    return new Proxy(f, handleFun(
      fRep,
      fSig,
      {
        nthCall: 0,
        nthPostfix: 0,
        constraints: null,
        contraConst: null,
        contraSet: null,
        sigLog: null
      }
    ));
  }

  else return f;
};


const handleFun = (fRep, fSig, state) => {
  return {
    apply: (g, _, arg) => {
      if (state.nthCall === 0) {
        state = {
          nthCall: 0,
          nthPostfix: 0,
          constraints: new Map(),
          contraConst: new Map(),
          contraSet: new Set(),
          sigLog: []
        };
      }

      const argRep = fRep.children[0];

      switch (argRep.constructor.name) {
        case "ArgT": {
          verifyUnary(arg, argRep, fRep, fSig, state.sigLog);
          const tSig = introspect(arg[0]);
          
          state = unify(
            argRep.value,
            serialize(argRep.value),
            deserialize(tSig),
            tSig,
            state,
            {mode: "map", nthArg: null},
            fRep,
            fSig,
            tSig,
            TypeError
          );

          break;
        }

        case "NoArgT": {
          verifyNullary(arg, argRep, fRep, fSig, state.sigLog);
          break;
        }

        case "RestT": {
          const argSig = serialize(argRep.value);

          arg.forEach((arg_, n) => {
            const tSig = introspect(arg_);

            state = unify(
              argRep.value,
              argSig,
              deserialize(tSig),
              tSig,
              state,
              {mode: "map", nthArg: null},
              fRep,
              fSig,
              tSig,
              TypeError
            );
          });

          break;
        }
      }

      if (fRep.children[1].constructor.name === "ReturnT") {
        const r = g(...arg),
          rSig = introspect(r);

        state = unify(
          fRep.children[1].value,
          serialize(fRep.children[1].value),
          deserialize(rSig),
          rSig,
          state,
          {mode: "map", nthArg: null},
          fRep,
          fSig,
          rSig,
          ReturnTypeError
        );

        return r;
      }

      else {
        const h = g(...arg);

        if (fRep.name !== "") {
          Reflect.defineProperty(h, "name", {value: fRep.name});
        }

        let fRep_ = sliceFunT(fRep),
          fSig_ = "";

        state.sigLog.unshift(fSig);
        [fRep_, fSig_] = substitute(serialize(fRep_), state.constraints);
        
        return new Proxy(h, handleFun(
          fRep_,
          fSig_,
          {
            nthCall: state.nthCall + 1,
            nthPostfix: state.nthPostfix,
            constraints: state.constraints,
            contraConst: state.contraConst,
            contraSet: state.contraSet,
            sigLog: state.sigLog
          }
        ));
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
            "function objects are immutable"
          ]}
        );
      }
    },

    defineProperty: (f, k, d) => {
      switch (k) {
        case "name": return Reflect.defineProperty(f, k, d), f;
      }

      _throw(
        TypeError,
        ["illegal property mutation"],
        fSig,
        {desc: [
          `of property ${preformatK(k)} with type ${introspect(d.value)}`,
          "function objects are immutable"
        ]}

      );
    },

    deleteProperty: (f, k) => {
      _throw(
        TypeError,
        ["illegal property mutation"],
        fSig,
        {desc: [
          `removal of property ${preformatK(k)}`,
          "function objects are immutable"
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


const verifyNullary = (arg, argRep, fRep, fSig, sigLog) => {
  if (arg.length !== 0) _throw(
    ArityError,
    [`${fRep.name || "lambda"} expects 0 arguments`],
    fSig,
    {
      range: argRep.value.range,
      desc: [`${arg.length} argument(s) received`],
      sigLog
    }
  );
};


const verifyUnary = (arg, argRep, fRep, fSig, sigLog) => {
  if (arg.length !== 1) _throw(
    ArityError,
    [`${fRep.name || "lambda"} expects 1 argument`],
    fSig,
    {
      range: argRep.value.range,
      desc: [`${arg.length} argument(s) received`],
      sigLog
    }
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


class IntrospectionError extends TypeSysError {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, IntrospectionError);
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


const _throw = (Cons, title, sig, {range = [0, -1], desc = [], sigLog = [], constraints = new Map()}) => {
  const [from, to] = range;

  throw new Cons(title
    .join("\n")
    .concat(`\n\n${sig}`)
    .concat(
      range.length === 0 ? ""
        : `\n${ul(from, to)}`
    )
    .concat(
      desc.length === 0 ? ""
        : `\n\n${desc.join("\n\n")}`
    )
    .concat(
      sigLog.length === 0 ? ""
        : `\n\nPREVIOUS TYPE SIGNATURES:\n\n${sigLog.join("\n")}`
    )
    .concat(
      constraints.size === 0 ? ""
        : `\n\nTYPE CONSTRAINTS:\n\n${Array.from(constraints).map(pair => {
          return pair.join(" ~ ");
        }, "").join("\n")}`
    )
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