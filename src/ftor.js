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


const SYM_PREFIX = "github.com/kongware/ftor/";


export const TR = Symbol.for(`${SYM_PREFIX}tr`);


export const TS = Symbol.for(`${SYM_PREFIX}ts`);


const TUP_MAX_FIELDS = 16;


const LESS_GEN = 0;


const EQ_GEN = 1;


const MORE_GEN = 2;


const NO_MGU = 3;


/******************************************************************************
*******************************************************************************
*****************************[ 2. INTROSPECTION ]******************************
*******************************************************************************
******************************************************************************/


const introspect = x => {
  switch (typeof x) {
    case "boolean": return "Boolean";

    case "function": {
      if (TS in x) return x[TS];
      else return "Function";
    }

    case "number": {
      if (Number.isNaN(x)) return "NaN";
      else return "Number";
    }

    case "string": return "String";
    case "symbol": return "Symbol";
    case "undefined": return "Undefined";

    case "object": {
      if (x === null) return "Null";

      else {
        if (TS in x) return x[TS];

        else {
          let tag = getStringTag(x);

          if (tag === "Object" && "constructor" in x) {
            tag = x.constructor.name;
          }

          if (tag === "Number") {
            if (Number.isNaN(x)) return "NaN";
            else return tag;
          }

          else return tag;
        }
      }
    }
  }
};


const introspectR = x => {
  const tag = getStringTag(x);

  switch (typeof x) {
    case "boolean": return "Boolean";

    case "function": {
      if (tag === "Fun") return x[TS];
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
        if (TS in x) return x[TS];

        else {
          switch (tag) {
            case "Array": {
              if (x.length === 0) return "[a]";
              else if (x.length === 1) return `[${introspectR(x[0])}]`;

              else {
                const [s, sigs] = x.reduce(([s, sigs, n], y, m) => {
                    if (m !== n + 1) _throw(
                      TypeError,
                      ["invalid Array"],
                      "Array",
                      {desc: [`index gap at #${n + 1} detected`]}
                    );

                    y = introspectR(y);
                    return [s.add(y), sigs.concat(y), n + 1];
                  }, [new Set(), [], -1]);

                if (s.size === 1) return `[${sigs[0]}]`;

                else if (sigs.length > TUP_MAX_FIELDS) _throw(
                  TypeError,
                  ["invalid Tuple"],
                  `[${sigs.slice(0, 3).join(", ").concat("...")}]`,
                  {desc: [
                    `Tuple must not contain more than ${TUP_MAX_FIELDS} fields`,
                    `${s.size} fields received`
                  ]}
                );
                
                else return `[${sigs.join(", ")}]`;
              }
            }

            case "Map": {
              const s = Array.from(x).reduce((s, [k, v]) => {
                  k = introspectR(k);
                  v = introspectR(v);
                  return s.add(`{${k}::${v}}`);
                }, new Set());

              if (s.size === 0) return "{k::v}";
              else if (s.size === 1) return s.values().value;

              else {
                const sigs = Array.from(s);

                _throw(
                  TypeError,
                  ["_Map expects homogeneous Map"],
                  sigs.length > 3
                    ? sigs.slice(0, 3).join(", ").concat("...")
                    : sigs.join(", "),
                  {desc: [`${s.zize} pairs of different type received`]}
                );
              }
            }

            case "Object": {
              const sigs = Object.entries(x).reduce((sigs, [k, v]) => {
                  v = introspectR(v);
                  return sigs.concat(`${k}: ${v}`);
                }, []);

              if (sigs.length === 0) _throw(
                TypeError,
                ["invalid Record"],
                `{${sigs.join(", ")}}`,
                {desc: ["Records must at least contain 1 field"]}
              );

              else return `{${sigs.join(", ")}}`
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
*****[ 3.3. Empty ]************************************************************
******************************************************************************/


const EmptyT = (Cons => new Cons())
  (class EmptyT {
    constructor() {
      this.tag = "Empty";
      this.children = [];
    }
  });


/******************************************************************************
*****[ 3.4. Functions ]********************************************************
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
*****[ 3.5. Maps ]*************************************************************
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
*****[ 3.6. Primitives ]*******************************************************
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
*****[ 3.7. Polytypes ]********************************************************
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
*****[ 3.8. Records ]**********************************************************
******************************************************************************/


const RecT = (Cons => (range, rvar, children) => new Cons(range, rvar, children))
  (class RecT {
    constructor(range, rvar, children) {
      this.range = range;
      this.tag = "Rec";
      this.rvar = rvar;
      this.children = children;
    }
  });


/******************************************************************************
*****[ 3.9. Tuples ]***********************************************************
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
*****[ 3.10. Misc ]************************************************************
******************************************************************************/


const cloneT = xT => {
  switch (xT.constructor.name) {
    case "AdtT": return deserialize(serialize(AdtT(xT.range, xT.tag, xT.children)));
    case "ArrT": return deserialize(serialize(ArrT(xT.range, xT.children)));
    case "EmptyT": return EmptyT;
    case "FunT": return deserialize(serialize(FunT(xT.name, xT.range, xT.children)));
    case "_MapT": return deserialize(serialize(_MapT(xT.range, xT.children)));
    case "PolyT": return deserialize(serialize(PolyT(xT.range, xT.tag)));
    case "PrimT": return deserialize(serialize(PrimT(xT.range, xT.tag)));
    case "RecT": return deserialize(serialize(RecT(xT.range, xT.rvar, xT.children)));
    case "TupT": return deserialize(serialize(TupT(xT.range, xT.children)));
  }
};


const sliceFunT = (funT, n) => {
  return deserialize(
    serialize(
      FunT(funT.name, funT.range, funT.children.slice(n))
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
    case "Empty": return "";
    case "Fun": return serializeFun(tRep.name, tag, children);
    case "_Map": return serializeMap(tag, children);
    case "Rec": return serializeRec(tag, tRep.rvar, children);
    case "Tup": return serializeTup(tag, children);
    
    default: {
      if (tRep.constructor.name === "AdtT") return serializeAdt(tag, children);

      else if (children.length > 0) throw new SerialError(
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
            if (children.length === 0) return `...${tag_}`;
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


const serializeRec = (tag, rvar, tReps) => {
  return "{"
    .concat(tReps
      .map(({k, v}) => {
        if (v.children.length === 0) return `${k}: ${v.tag}`;
        else return `${k}: ${serialize(v)}`;
      })
      .join(", ")
    )
    .concat(rvar === "" ? "" : `, ..${rvar}`)
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
      ParseError,
      ["invalid type signature"],
      tSig,
      {range: [n, n], desc: ["unexpected end of signature"]}
    );

    else if (c.search(/[a-z0-9(\[{<>}\]), \-.:_]/i) !== 0) _throw(
      ParseError,
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
                {depth: depth + 1, context, phase: "TVAR", buf: "", range, tag: buf, tReps}
              );
            }
          }

          case "TVAR": {
            if (c === ",") {
              if (tReps.length === 0) _throw(
                ParseError,
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
                ParseError,
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
                ParseError,
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
                ParseError,
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
            const phase_ = lookAheadFun(tSig.slice(n));

            if (phase_ === false) _throw(
              ParseError,
              ["invalid type signature"],
              tSig,
              {range: [tSig.length, tSig.length], desc: [`symbol ")" expected`]}
            );

            return aux(
              tSig, n,
              {depth, context, phase: phase_, buf, name, range, tag, tReps}
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
                ParseError,
                ["invalid type signature"],
                tSig,
                {range: [n + 3, n + 3], desc: [`symbol " " expected`]}
              );

              else if (next === ":") _throw(
                ParseError,
                ["invalid type signature"],
                tSig,
                {range: [n + 2, n + 2], desc: [`symbol ":" expected`]}
              );

              else _throw(
                ParseError,
                ["invalid type signature"],
                tSig,
                {range: [n + 1, n + 1], desc: [`symbol ":" expected`]}
              );
            } 

            else _throw(
              ParseError,
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
                ParseError,
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
                ParseError,
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
                ParseError,
                ["invalid type signature"],
                tSig,
                {range: [n, n], desc: [`token " -> " expected`]}
              );
            }

            else _throw(
              ParseError,
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
              ParseError,
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
              ParseError,
              ["invalid type signature"],
              tSig,
              {range: [n, n], desc: ["unexpected symbol"]}
            );
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
              ParseError,
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
            if (c.search(/[a-z0-9_]/i) === 0) {
              return aux(
                tSig, n + 1,
                {depth, context, phase, buf: buf + c, range, tag, tReps}
              );
            }

            else if (c === ".") {
              return aux(
                tSig, n + 1,
                {depth, context, phase: "RVAR", buf: c, range, tag, tReps}
              );
            }

            else if (c === ":") {
              if (buf === "") _throw(
                ParseError,
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
                ParseError,
                ["invalid type signature"],
                tSig,
                {range: [n + 1, n + 1], desc: [`symbol " " expected`]}
              );
            }

            else _throw(
              ParseError,
              ["invalid type signature"],
              tSig,
              {range: [n, n], desc: ["unexpected symbol"]}
            );
          }

          case "VALUE": {
            if (c === ",") {
              if (tReps.length === 0) _throw(
                ParseError,
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
                ParseError,
                ["invalid type signature"],
                tSig,
                {range: [n + 1, n + 1], desc: [`symbol " " expected`]}
              );
            }

            else if (c === "}") {
              return [RecT(range, "", tReps), n + 1, depth - 1];
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

          case "RVAR": {
            if (c === ".") {
              if (buf === ".") {
                return aux(
                  tSig, n + 1,
                  {depth, context, phase: "RVAR", buf: buf + ".", range, tag, tReps}
                );
              }

              else _throw(
                ParseError,
                ["invalid type signature"],
                tSig,
                {range: [n, n], desc: ["unexpected symbol"]}
              );
            }

            else if (c.search(/[a-z]/) === 0) {
              if (buf === "..") {
                return aux(
                  tSig, n + 1,
                  {depth, context, phase: "RVAR", buf: c, range, tag, tReps}
                );
              }

              else _throw(
                ParseError,
                ["invalid type signature"],
                tSig,
                {range: [n, n], desc: ["unexpected symbol"]}
              );
            }

            else if (c.search(/[0-9]/) === 0) {
              if (buf.search(/[a-z]/) === 0 && buf.length === 1) {
                return aux(
                  tSig, n + 1,
                  {depth, context, phase: "RVAR", buf: buf + c, range, tag, tReps}
                );
              }

              else _throw(
                ParseError,
                ["invalid type signature"],
                tSig,
                {range: [n, n], desc: ["unexpected symbol"]}
              );
            }

            else if (c === "}") {
              return [RecT(range, buf, tReps), n + 1, depth - 1];
            }

            else _throw(
              ParseError,
              ["invalid type signature"],
              tSig,
              {range: [n, n], desc: ["unexpected symbol"]}
            );
          }
        }
      }
    }
  };

  if (tSig === "") return EmptyT;

  const {context, phase, buf} = getContext(tSig, 0);

  const [tRep, n, depth] = aux(
    tSig, 0,
    {depth: 0, context, phase, buf, range: [0], tag: "", tReps: []}
  );

  if (depth === 0 && tSig.length !== n) _throw(
    ParseError,
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

  // Arr / Tup

  if (c === "[") {
    return {context: "ARR", phase: "OUTER", buf: ""};
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
    ParseError,
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


const unify = (t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons) => {
  switch (t1Rep.constructor.name) {
    case "AdtT": return unifyAdt(t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons);
    case "ArrT": return unifyArr(t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons);
    case "EmptyT": return unifyEmpty(t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons);
    case "FunT": return unifyFun(t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons);
    case "_MapT": return unifyMap(t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons);
    case "PolyT": return unifyPoly(t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons);
    case "PrimT": return unifyPrim(t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons);
    case "RecT": return unifyRec(t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons);
    case "TupT": return unifyTup(t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons);
  }
};


const unifyAdt = (t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons) => {
  switch (t2Rep.constructor.name) {
    case "ArrT":
    case "EmptyT":
    case "FunT":
    case "_MapT":
    case "RecT":
    case "PrimT":
    case "TupT": {
      const range = retrieveRange(fRep, nthParam);

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

    case "AdtT": {
      t1Rep.children.forEach((tRep, n) => {
        state = unify(
          tRep,
          serialize(tRep),
          t2Rep.children[n],
          serialize(t2Rep.children[n]),
          state,
          {nthParam},
          fRep,
          fSig,
          xSig,
          cons
        );
      });

      return state;
    }

    case "PolyT": {
      return constrain(
        t2Rep,
        serialize(t2Rep),
        t1Rep,
        serialize(t1Rep),
        state,
        {nthParam},
        fRep,
        fSig,
        xSig,
        cons
      );
    }
  }
};


const unifyArr = (t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons) => {
  switch (t2Rep.constructor.name) {
    case "AdtT":
    case "EmptyT":
    case "FunT":
    case "_MapT":
    case "PrimT":
    case "RecT":
    case "TupT": {
      const range = retrieveRange(fRep, nthParam);

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
        {nthParam},
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
        {nthParam},
        fRep,
        fSig,
        xSig,
        cons
      );
    }
  }
};


const unifyEmpty = (t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons) => {
  switch (t2Rep.constructor.name) {
    case "AdtT":
    case "ArrT":
    case "FunT":
    case "_MapT":
    case "RecT":
    case "PrimT":
    case "TupT": {
      const range = retrieveRange(fRep, nthParam);

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

    case "EmptyT": return state;

    case "PolyT": {
      return constrain(
        t2Rep,
        serialize(t2Rep),
        t1Rep,
        serialize(t1Rep),
        state,
        {nthParam},
        fRep,
        fSig,
        xSig,
        cons
      );
    }
  }
};


const unifyFun = (t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons) => {
  switch (t2Rep.constructor.name) {
    case "AdtT":
    case "ArrT":
    case "EmptyT":
    case "_MapT":
    case "PrimT":
    case "RecT": 
    case "TupT": {
      const range = retrieveRange(fRep, nthParam);

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
      [t2Sig, state.nthTvar] = fresh(t2Sig, state.nthTvar);
      t2Rep = deserialize(t2Sig);

      if (t1Rep.children.length < t2Rep.children.length) {
        t1Rep.children.forEach((argRep, n) => {
          if (n === t1Rep.children.length - 1) {
            t2Rep = sliceFunT(t2Rep, n);

            state = constrain(
              argRep.value,
              serialize(argRep.value),
              t2Rep,
              serialize(t2Rep),
              state,
              {nthParam: n},
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
              {nthParam: n},
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
              {nthParam: n},
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
              {nthParam: n},
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
            t1Rep = sliceFunT(t1Rep, n);

            state = constrain(
              t1Rep,
              serialize(t1Rep),
              argRep.value,
              serialize(argRep.value),
              state,
              {nthParam: n},
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
              {nthParam: n},
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
              {nthParam: n},
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
              {nthParam: n},
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
            {nthParam: n},
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
            {nthParam: n},
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
      return constrain(t2Rep, t2Sig, t1Rep, t1Sig, state, {nthParam}, fRep, fSig, xSig, cons);
    }
  }
};


const unifyMap = (t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons) => {
  switch (t2Rep.constructor.name) {
    case "AdtT":
    case "ArrT":
    case "EmptyT":
    case "FunT":
    case "RecT":
    case "PrimT":
    case "TupT": {
      const range = retrieveRange(fRep, nthParam);

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

    case "_MapT": {
      state = unify(
        t1Rep.children[0].k,
        serialize(t1Rep.children[0].k),
        t2Rep.children[0].k,
        serialize(t2Rep.children[0].k),
        state,
        {nthParam},
        fRep,
        fSig,
        xSig,
        cons
      );

      return unify(
        t1Rep.children[0].v,
        serialize(t1Rep.children[0].v),
        t2Rep.children[0].v,
        serialize(t2Rep.children[0].v),
        state,
        {nthParam},
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
        {nthParam},
        fRep,
        fSig,
        xSig,
        cons
      );
    }
  }
};


const unifyPoly = (t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons) => {
  return constrain(t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons);
};


const unifyPrim = (t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons) => {
  switch (t2Rep.constructor.name) {
    case "AdtT":
    case "ArrT":
    case "EmptyT":
    case "FunT":
    case "_MapT":
    case "RecT":
    case "TupT": {
      const range = retrieveRange(fRep, nthParam);

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
      return constrain(t2Rep, t2Sig, t1Rep, t1Sig, state, {nthParam}, fRep, fSig, xSig, cons);
    }

    case "PrimT": {
      if (t1Sig !== t2Sig) {
        const range = retrieveRange(fRep, nthParam);

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


const unifyRec = (t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons) => {
  switch (t2Rep.constructor.name) {
    case "AdtT":
    case "ArrT":
    case "EmptyT":
    case "FunT":
    case "_MapT":
    case "PrimT":
    case "TupT": {
      const range = retrieveRange(fRep, nthParam);

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

    case "RecT": {
      const keys1 = t1Rep.children.reduce((acc, {k, v}, n) => {
        return acc.set(k, n);
      }, new Map());

      const keys2 = t2Rep.children.reduce((acc, {k, v}, n) => {
        return acc.set(k, n);
      }, new Map());

      t1Rep.children.forEach(({k, v}, n) => {
        if (!keys2.has(k)) {
          const range = retrieveRange(fRep, nthParam);

          _throw(
            cons,
            [`${fRep.name || "lambda"} expects`],
            fSig,
            {
              range,
              desc: [`missing key ${prettyPrintK(k)}`]
            }
          );
        }

        state = unify(
          v,
          serialize(v),
          t2Rep.children[keys2.get(k)].v,
          serialize(t2Rep.children[keys2.get(k)].v),
          state,
          {nthParam},
          fRep,
          fSig,
          xSig,
          cons
        );
      });

      if (t1Rep.rvar === "") {
        if (keys1.size !== keys2.size) {
          t2Rep.children.forEach(({k, v}, n) => {
            if (!keys1.has(k)) {
              const range = retrieveRange(fRep, nthParam);

              _throw(
                cons,
                [`${fRep.name || "lambda"} expects`],
                fSig,
                {
                  range,
                  desc: [`unexpected key ${prettyPrintK(k)}`]
                }
              );
            }
          });          
        }
      }

      else {
        const rowRep = cloneT(t2Rep);
        rowRep.rvar = "";

        rowRep.children = rowRep.children.filter(({k, v}, n) => {
          if (keys1.has(k)) return false;
          else return true;
        });

        if (rowRep.children.length === 0) {
          state = constrain(
            deserialize(t1Rep.rvar),
            t1Rep.rvar,
            EmptyT,
            "",
            state,
            {nthParam},
            fRep,
            fSig,
            xSig,
            cons
          );
        }

        else {
          state = constrain(
            deserialize(t1Rep.rvar),
            t1Rep.rvar,
            rowRep,
            serialize(rowRep),
            state,
            {nthParam},
            fRep,
            fSig,
            xSig,
            cons
          );
        }
      }

      return state;
    }

    case "PolyT": {
      return constrain(t2Rep, t2Sig, t1Rep, t1Sig, state, {nthParam}, fRep, fSig, xSig, cons);
    }
  }
};


const unifyTup = (t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons) => {
  switch (t2Rep.constructor.name) {
    case "AdtT":
    case "ArrT":
    case "EmptyT":
    case "FunT":
    case "_MapT":
    case "RecT":
    case "PolyT":
    case "PrimT": {
      const range = retrieveRange(fRep, nthParam);

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
      return constrain(
        t2Rep,
        serialize(t2Rep),
        t1Rep,
        serialize(t1Rep),
        state,
        {nthParam},
        fRep,
        fSig,
        xSig,
        cons
      );
    }

    case "TupT": {
      t1Rep.children.forEach((tRep, n) => {
        state = unify(
          tRep,
          serialize(tRep),
          t2Rep.children[n],
          serialize(t2Rep.children[n]),
          state,
          {nthParam},
          fRep,
          fSig,
          xSig,
          cons
        );
      });
    }
  }
};


const constrain = (t1Rep, t1Sig, t2Rep, t2Sig, state, {nthParam}, fRep, fSig, xSig, cons) => {
  let kRep, kSig, vRep, vSig;

  if (mgu(t1Rep, t2Rep) === LESS_GEN) {
    kRep = t2Rep;
    kSig = t2Sig;
    vRep = t1Rep;
    vSig = t1Sig;
  }

  else {
    kRep = t1Rep;
    kSig = t1Sig;
    vRep = t2Rep;
    vSig = t2Sig;
  }

  kSig = kSig.replace(/\([a-z0-9_]+ :: /, "(");
  vSig = vSig.replace(/\([a-z0-9_]+ :: /, "(");

  if (state.constraints.has(kSig)) {
    const vSig_ = state.constraints.get(kSig),
      vRep_ = deserialize(vSig_);

    if (vSig !== vSig_) {
      return unify(vRep_, vSig_, vRep, vSig, state, {nthParam}, fRep, fSig, xSig, cons);
    }
  }

  else {
    state.constraints.set(kSig, vSig);
  }

  occurs(state, nthParam, fRep, fSig, xSig, cons);
  return state;
};


const occurs = (state, nthParam, fRep, fSig, xSig, cons) => {
  state.constraints.forEach((v1, k1) => {
    if (k1.search(/\b[a-z][0-9]?\b/) !== -1) {
      state.constraints.forEach((v2, k2) => {
        /*if (k1 !== k2) {
          if (k2.search(new RegExp(`\\b${k1}\\b`)) !== -1) {
            const range = retrieveRange(fRep, nthParam);

            _throw(
              cons,
              [`${fRep.name || "lambda"} applied to ${xSig} creates an infinite type`],
              fSig,
              {
                range,
                desc: [`"${k1}" occurs in substitution ${k2}`],
                sigLog: state.sigLog,
                constraints: state.constraints
              }
            );
          }
        }*/
          
        if (k1 !== v2) {
          if (v2.search(new RegExp(`\\b${k1}\\b`)) !== -1) {
            const range = retrieveRange(fRep, nthParam);

            _throw(
              cons,
              [`${fRep.name || "lambda"} applied to ${xSig} creates an infinite type`],
              fSig,
              {
                range,
                desc: [`"${k1}" occurs in substitution ${v2}`],
                sigLog: state.sigLog,
                constraints: state.constraints
              }
            );
          }
        }
      });
    }
  });
};


const fresh = (fSig, nthTvar) => {
  const fSig_ = fSig.replace(/\b([a-z])\b/g, `$1${nthTvar}`);
  return [fSig_, fSig_ === fSig ? nthTvar : nthTvar + 1];
};


const mgu = (kRep, vRep) => {
  const aux = (kRep, vRep) => {
    switch (kRep.constructor.name) {
      case "AdtT": {
        switch (vRep.constructor.name) {
          case "ArrT":
          case "EmptyT":
          case "FunT":
          case "_MapT":
          case "PrimT":
          case "RecT":
          case "TupT": return NO_MGU;

          case "AdtT": {
            const aux_ = n => {
              const r = aux(kRep.children[n], vRep.children[n]);

              if (n === kRep.children.length - 1) return r;
              else if (r === EQ_GEN) return aux_(n + 1);
              else return r;
            };

            if (kRep.children.length !== vRep.children.length) return NO_MGU;
            else return aux_(0);
          }

          case "PolyT": return LESS_GEN;
        }
      }

      case "ArrT": {
        switch (vRep.constructor.name) {
          case "AdtT":
          case "EmptyT":
          case "FunT":
          case "_MapT":
          case "PrimT":
          case "RecT":
          case "TupT": return NO_MGU;

          case "ArrT": {
            return aux(kRep.children[0], vRep.children[0]);
          }

          case "PolyT": return LESS_GEN;
        }
      }

      case "EmptyT": {
        switch (vRep.constructor.name) {
          case "AdtT":
          case "ArrT":
          case "FunT":
          case "_MapT":
          case "PrimT":
          case "RecT":
          case "TupT": return NO_MGU;

          case "EmptyT": return EQ_GEN;
          case "PolyT": return LESS_GEN;
        }
      }

      case "FunT": {
        switch (vRep.constructor.name) {
          case "AdtT":
          case "ArrT":
          case "EmptyT":
          case "_MapT":
          case "PrimT":
          case "RecT":
          case "TupT": return NO_MGU;
          
          case "FunT": {
            return mguFun(kRep, vRep, 0, aux);
          }
          
          case "PolyT": return LESS_GEN;
        }
      }

      case "_MapT": {
        switch (vRep.constructor.name) {
          case "AdtT":
          case "ArrT":
          case "EmptyT":
          case "FunT":
          case "PrimT":
          case "RecT":
          case "TupT": return NO_MGU;

          case "_MapT": {
            const r = aux(kRep.children[0].k, vRep.children[0].k);
            if (r === EQ_GEN) return aux(kRep.children[0].v, vRep.children[0].v);
            else return r;
          }

          case "PolyT": return LESS_GEN;
        }
      }
      
      case "PrimT": {
        switch (vRep.constructor.name) {
          case "AdtT":
          case "ArrT":
          case "EmptyT":
          case "FunT":
          case "_MapT":
          case "RecT":
          case "TupT": return NO_MGU;

          case "PrimT": {
            if (kRep.tag === vRep.tag) return EQ_GEN;
            else return NO_MGU;
          }

          case "PolyT": return LESS_GEN;
        }
      }

      case "PolyT": {
        switch (vRep.constructor.name) {
          case "AdtT":
          case "ArrT":
          case "EmptyT":
          case "FunT":
          case "_MapT":
          case "PrimT":
          case "RecT":
          case "TupT": return MORE_GEN;

          case "PolyT": {
            kTvars.add(kRep.tag);
            vTvars.add(vRep.tag);
            return EQ_GEN;
          }
        }
      }

      case "RecT": {
        switch (vRep.constructor.name) {
          case "AdtT":
          case "ArrT":
          case "EmptyT":
          case "FunT":
          case "_MapT":
          case "PrimT":
          case "TupT": return NO_MGU;

          case "RecT": {
            const aux_ = n => {
              const r = aux(kRep.children[n], vRep.children[n]);

              if (n === kRep.children.length - 1) return r;
              else if (r === EQ_GEN) return aux_(n + 1);
              else return r;
            };

            if (kRep.children.length !== vRep.children.length) return NO_MGU;
            else return aux_(0);
          }

          case "PolyT": return LESS_GEN;
        }
      }
      
      case "TupT": {
        switch (vRep.constructor.name) {
          case "AdtT":
          case "ArrT":
          case "EmptyT":
          case "FunT":
          case "_MapT":
          case "PrimT":
          case "RecT": return NO_MGU;

          case "PolyT": return LESS_GEN;

          case "TupT": {
            const aux_ = n => {
              const r = aux(kRep.children[n], vRep.children[n]);

              if (n === kRep.children.length - 1) return r;
              else if (r === EQ_GEN) return aux_(n + 1);
              else return r;
            };

            if (kRep.children.length !== vRep.children.length) return NO_MGU;
            else return aux_(0);
          }
        }
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
  constraints.forEach((v, k) => {
    if (k.search(/^[a-z][0-9]?$/) === 0) {
      if (v === "") {
        fSig = fSig.replace(new RegExp(`, \\.\\.${escapeRegExp(k)}\\b`, "g"), v);
      }

      else {
        fSig = fSig.replace(new RegExp(`\\.\\.${escapeRegExp(k)}\\b`, "g"), v.slice(1, -1));
      }
    }

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

  return [deserialize(fSig), fSig];
};


/******************************************************************************
*****[ 6.1. Misc ]*************************************************************
******************************************************************************/


const escapeRegExp = s => s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");


const retrieveRange = (fRep, nthParam) => {
  if (nthParam === null) {
    const argRep = fRep.children[0];

    switch (argRep.constructor.name) {
      case "ArgT":
      case "RestT":
      case "ReturnT": return argRep.value.range;
      case "NoArgT": return argRep.range;
    }
  }

  else {
    const argRep = fRep.children[0].value.children[nthParam];

    switch (argRep.constructor.name) {
      case "ArgT":
      case "RestT":
      case "ReturnT": return argRep.value.range;
      case "NoArgT": return argRep.range;
    }
  }
};


const prettyPrint = fSig => {};


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
        nthTvar: 0,
        constraints: null,
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
          nthTvar: 0,
          constraints: new Map(),
          sigLog: []
        };
      }

      else state.constraints = new Map();

      const argRep = fRep.children[0];

      switch (argRep.constructor.name) {
        case "ArgT": {
          verifyUnary(arg, argRep, fRep, fSig, state.sigLog);
          const tSig = introspectR(arg[0]);
          
          state = unify(
            argRep.value,
            serialize(argRep.value),
            deserialize(tSig),
            tSig,
            state,
            {nthParam: null},
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
            const tSig = introspectR(arg_);

            state = unify(
              argRep.value,
              argSig,
              deserialize(tSig),
              tSig,
              state,
              {nthParam: null},
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
          rSig = introspectR(r);

        state = unify(
          fRep.children[1].value,
          serialize(fRep.children[1].value),
          deserialize(rSig),
          rSig,
          state,
          {nthParam: null},
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

        let fRep_ = sliceFunT(fRep, 1),
          fSig_ = "";

        state.sigLog.unshift(fSig);
        [fRep_, fSig_] = substitute(serialize(fRep_), state.constraints);
        
        return new Proxy(h, handleFun(
          fRep_,
          fSig_,
          {
            nthCall: state.nthCall + 1,
            nthTvar: state.nthTvar,
            constraints: state.constraints,
            sigLog: state.sigLog
          }
        ));
      }
    },

    get: (f, k, p) => {
      switch (k) {
        case "toString": return () => fSig;
        case Symbol.toStringTag: return "Fun";
        case TR: return fRep;
        case TS: return fSig;

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
            {desc: [`unknown property ${prettyPrintK(k)}`]}
          );
        }
      }
    },

    has: (f, k, p) => {
      switch (k) {
        case TS: return true;
        case TR: return true;

        default: _throw(
          TypeError,
          ["illegal property introspection"],
          fSig,
          {desc: [
            `of property ${prettyPrintK(k)}`,
            "duck typing is not allowed"
          ]}
        );
      }
    },

    set: (f, k, v, p) => {
      switch (k) {
        case "toString": return f[k] = v, f;

        default: _throw(
          TypeError,
          ["illegal property mutation"],
          fSig,
          {desc: [
            `of property ${prettyPrintK(k)} with type ${introspect(v)}`,
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
          `of property ${prettyPrintK(k)} with type ${introspect(d.value)}`,
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
          `removal of property ${prettyPrintK(k)}`,
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
          `of property ${prettyPrintK(k)}`,
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
      range: argRep.range,
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
      range: argRep.range,
      desc: [`${arg.length} argument(s) received`],
      sigLog
    }
  );
};


/******************************************************************************
*****[ 7.2. Algebraic Data Types ]*********************************************
******************************************************************************/


export const Adt = (cons, tSig) => _case => {
  // check case = record of typed functions with capitalized names
  // check that type vars of all cases are in scope
  const adt = new cons();

  if (types) {
    if (introspect(cons) !== "Function") _throw(
      TypeError,
      ["Adt expects"],
      "(Function, String -> Function -> {run: Function})",
      {range: [1, 9], desc: [`${introspect(cons)} received`]}
    );

    else if (cons.name.toLowerCase() === cons.name) _throw(
      TypeError,
      ["Adt expects type constructor with capitalized name"],
      "(Function, String -> Function -> {run: Function})",
      {range: [1, 9], desc: [`name "${cons.name}" received`]}
    );

    else if (introspect(tSig) !== "String") _throw(
      TypeError,
      ["Adt expects"],
      "(Function, String -> Function -> {run: Function})",
      {range: [11, 17], desc: [`${introspect(tSig)} received`]}
    );

    else if (getStringTag(_case) !== "Fun") _throw(
      TypeError,
      ["Adt expects"],
      "(Function, String -> Function -> {run: Function})",
      {range: [21, 28], desc: [
        "a typed function"
        `${introspect(_case)} received`,
      ]}
    );

    else if (_case.name.toLowerCase() === _case.name) _throw(
      TypeError,
      ["Adt expects data constructor with capitalized name"],
      "(Function, String -> Function -> {run: Function})",
      {range: [21, 28], desc: [`name "${_case.name}" received`]}
    );

    const tvars = U(f => r => {
      const s = r.replace(/\([^()]+\)/g, "");
      return s === r ? s : f(f) (s);
    }) (_case[TS].slice(1, -1)).match(/\b[a-z]\b/g);

    const tvars_ = new Set(tSig.match(/\b[a-z]\b/g));

    tvars.forEach(tvar => {
      if (!tvars_.has(tvar)) _throw(
        TypeError,
        [`invalid case for ${tSig}`],
        _case[TS],
        {desc: [`"${tvar}" is out of scope`]}
      );
    });

    const tRep = deserialize(tSig);
    adt.run = cases => _case(cases);
    return new Proxy(adt, handleAdt(tRep, tSig, cons));
  }

  else return adt;
};


const handleAdt = (tRep, tSig, cons) => {
  return {
    get: (o, k, p) => {
      switch (k) {
        case "toString": return () => tSig;
        case Symbol.toStringTag: return cons.name;
        case TR: return tRep;
        case TS: return tSig;

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
            {desc: [`unknown property ${prettyPrintK(k)}`]}
          );
        }
      }
    },

    has: (o, k, p) => {
      switch (k) {
        case TS: return true;
        case TR: return true;

        default: _throw(
          TypeError,
          ["illegal property introspection"],
          tSig,
          {desc: [
            `of property ${prettyPrintK(k)}`,
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
          tSig,
          {desc: [
            `of property ${prettyPrintK(k)} with type ${introspect(v)}`,
            "ADTs are immutable"
          ]}
        );
      }
    },

    defineProperty: (o, k, d) => {
      switch (k) {
        case "name": return Reflect.defineProperty(o, k, d), o;
      }

      _throw(
        TypeError,
        ["illegal property mutation"],
        tSig,
        {desc: [
          `of property ${prettyPrintK(k)} with type ${introspect(d.value)}`,
          "ADTs are immutable"
        ]}

      );
    },

    deleteProperty: (o, k) => {
      _throw(
        TypeError,
        ["illegal property mutation"],
        tSig,
        {desc: [
          `removal of property ${prettyPrintK(k)}`,
          "ADTs are immutable"
        ]}
      );
    },

    ownKeys: o => {
      _throw(
        TypeError,
        ["illegal property introspection"],
        tSig,
        {desc: [
          `of property ${prettyPrintK(k)}`,
          "meta programming is not allowed"
        ]}
      );
    }
  };
};


/******************************************************************************
*****[ 7.3. Arrays ]***********************************************************
******************************************************************************/


export const Arr = xs => {
  if (types) {
    if (introspect(xs) !== "Array") _throw(
      TypeError,
      ["Arr expects an Array"],
      introspect(xs),
      {desc: ["received"]}
    );

    else if (TR in xs) return xs;

    const tSig = introspectR(xs),
      tRep = deserialize(tSig);

    if (tRep.tag === "Tup") _throw(
      TypeError,
      ["Arr expects homogeneous Array"],
      tSig,
      {desc: [`${tRep.children.length} elements of different type received`]}
    );

    return new Proxy(xs, handleArr(tRep, tSig));
  }

  else return xs;
};


const handleArr = (tRep, tSig) => ({
  get: (xs, i, p) => {
    switch (i) {
      case "toString": return () => tSig;
      case Symbol.toStringTag: return "Arr";
      case Symbol.isConcatSpreadable: return xs[Symbol.isConcatSpreadable];
      case TR: return tRep;
      case TS: return tSig;

      case Symbol.toPrimitive: return hint => {
        _throw(
          TypeError,
          ["illegal type coercion"],
          tSig,
          {desc: [
            `to target type ${capitalize(hint)}`,
            "implicit type convertions are not allowed"
          ]}
        );
      };

      default: {
        if (i in xs) return xs[i];

        else _throw(
          TypeError,
          ["invalid property access"],
          tSig,
          {desc: [
            `of ${prettyPrintK(i)}`,
            "unknown property"
          ]}
        );
      }
    }
  },

  has: (xs, i, p) => {
    if (Number.isNaN(Number(i))) {
      switch (i) {
        case TS: return true;
        case TR: return true;

        default: _throw(
          TypeError,
          ["illegal non-numeric property introspection"],
          tSig,
          {desc: [
            `of ${prettyPrintK(i)}`,
            "duck typing is not allowed"
          ]}
        );
      }
    }

    else return i in xs;
  },

  set: (xs, i, v, p) => setArr(tRep, tSig, xs, i, {value: v}, {mode: "set"}),
  defineProperty: (xs, i, d) => setArr(tRep, tSig, xs, i, d, {mode: "def"}),

  deleteProperty: (xs, i) => {
    if (Number.isNaN(Number(i))) _throw(
      TypeError,
      ["illegal non-numeric property deletion"],
      tSig,
      {desc: [
        `of ${prettyPrintK(i)}`,
        "Arrays are immutable for non-numeric properties"
      ]}
    );

    else {
      if (Number(i) !== xs.length - 1) _throw(
        TypeError,
        ["illegal property deletion"],
        tSig,
        {desc: [
          `of index #${prettyPrintK(i)}`,
          "deletion would cause an index gap"
        ]}
      );
    }

    return delete xs[i];
  },

  ownKeys: xs => _throw(
    TypeError,
    ["illegal property introspection"],
    tSig,
    {desc: [
      `of own keys/values/entries`,
      "meta programming is not allowed"
    ]}
  )
});


const setArr = (tRep, tSig, xs, i, d, {mode}) => {
  if (Number.isNaN(Number(i))) {
    switch (i) {
      case "length": return xs.length = d.value;

      default: _throw(
        TypeError,
        ["illegal non-numeric property mutation"],
        tSig,
        {desc: [
          `of ${prettyPrintK(i)} with type ${introspect(d.value)}`,
          "Arrays are immutable for non-numeric properties"
        ]}
      );
    }
  }

  else {
    if (Number(i) > xs.length) _throw(
      TypeError,
      ["illegal property setting"],
      tSig,
      {desc: [
        `of ${prettyPrintK(i)} with type ${introspect(d.value)}`,
        "setting would cause an index gap"
      ]}
    );

    else if (tSig !== `[${introspectR(d.value)}]`) {
      _throw(
        TypeError,
        ["illegal property mutation"],
        tSig,
        {desc: [
          `of ${prettyPrintK(i)} with type ${introspect(d.value)}`,
          "Arrays must preserve their type"
        ]}
      );
    }

    else {
      if (mode === "set") xs[i] = d.value;
      else Reflect.defineProperty(xs, i, d);
      return xs;
    }
  }
};


/******************************************************************************
*****[ 7.5. Maps ]*************************************************************
******************************************************************************/


export const _Map = map => {
  if (types) {
    if (introspect(map) !== "Map") _throw(
      TypeError,
      ["_Map expects a ES2015 Map"],
      introspect(map),
      {desc: ["received"]}
    );

    else if (TR in xs) return xs;

    const tSig = introspectR(map),
      tRep = deserialize(tSig);

    if (tRep.children.length > 1) _throw(
      TypeError,
      ["_Map expects homogeneous Map"],
      tSig,
      {desc: [`${tRep.children.length} pairs of different type received`]}
    );

    return new Proxy(map, handleMap(tRep, tSig));
  }

  else return map;
};


const handleMap = (tRep, tSig) => ({
  get: (map, k, p) => {
    switch (k) {
      case "toString": return () => tSig;
      case Symbol.toStringTag: return "_Map";
      case Symbol.isConcatSpreadable: return map[Symbol.isConcatSpreadable];
      case TR: return tRep;
      case TS: return tSig;

      case Symbol.toPrimitive: return hint => {
        _throw(
          TypeError,
          ["illegal type coercion"],
          tSig,
          {desc: [
            `to target type ${capitalize(hint)}`,
            "implicit type convertions are not allowed"
          ]}
        );
      };

      case "get": k => {
        if (map.has(k)) return map.get(k);

        else _throw(
          TypeError,
          ["illegal property access"],
          tSig,
          {desc: [
            `of ${prettyPrintK(introspect(k))}`,
            "unknown property"
          ]}
        );
      };

      case "set": (k, v) => {
        if (introspectR(k) !== tRep.children[0].k) {
          _throw(
            TypeError,
            ["illegal property mutation"],
            tSig,
            {desc: [ 
              `of key ${prettyPrintK(introspect(k))} with type ${introspect(d.value)}`,
              "Maps must preserve their type"
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
              `of value ${prettyPrintV(introspect(k))} with type ${introspect(d.value)}`,
            ]}
          );
        }

        else return map.set(k, v);
      }

      case "delete": k => {
        if (map.has(k)) return map.delete(k);

        else _throw(
          TypeError,
          ["illegal property deletion"],
          tSig,
          {desc: [
            `of ${prettyPrintK(introspect(k))}`,
            "unknown property"
          ]}
        );
      }

      default: {
        if (k in map) return map[k];

        else _throw(
          TypeError,
          ["invalid property access"],
          tSig,
          {desc: [
            `of ${prettyPrintK(k)}`,
            "unknown property"
          ]}
        );
      }
    }
  },

  has: (map, k, p) => {
    switch (k) {
      case TS: return true;
      case TR: return true;

      default: _throw(
        TypeError,
        ["illegal property introspection"],
        tSig,
        {desc: [
          `of ${prettyPrintK(k)}`,
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
          `of ${prettyPrintK(k)} with type ${introspect(v)}`,
          "_Map objects are immutable"
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
        `of ${prettyPrintK(k)} with type ${introspect(d.value)}`,
        "_Map objects are immutable"
      ]}

    );
  },

  deleteProperty: (map, k) => {
    _throw(
      TypeError,
      ["illegal property deletion"],
      tSig,
      {desc: [
        `of ${prettyPrintK(k)}`,
        "_Map objects are immutable"
      ]}
    );
  },

  ownKeys: map => _throw(
    TypeError,
    ["illegal property introspection"],
    tSig,
    {desc: [
      `of ${prettyPrintK(k)}`,
      "meta programming is not allowed"
    ]}
  )
});


/******************************************************************************
*****[ 7.5. Records ]**********************************************************
******************************************************************************/


export const Rec = o => {
  if (types) {
    if (introspect(o) !== "Object") _throw(
      TypeError,
      ["Rec expects an Object"],
      introspect(o),
      {desc: ["received"]}
    );

    else if (TR in o) return o;

    const tSig = introspectR(o),
      tRep = deserialize(tSig);

    return new Proxy(o, handleRec(tRep, tSig));
  }

  else return o;
};


const handleRec = (tRep, tSig) => ({
  get: (o, k, p) => {
    switch (k) {
      case "toString": return () => tSig;
      case Symbol.toStringTag: return "Rec";
      case Symbol.isConcatSpreadable: return o[Symbol.isConcatSpreadable];
      case TR: return tRep;
      case TS: return tSig;

      case Symbol.toPrimitive: return hint => {
        _throw(
          TypeError,
          ["illegal type coercion"],
          tSig,
          {desc: [
            `to target type ${capitalize(hint)}`,
            "implicit type convertions are not allowed"
          ]}
        );
      };

      default: {
        if (k in o) return o[k];

        else _throw(
          TypeError,
          ["invalid property access"],
          tSig,
          {desc: [
            `of ${prettyPrintK(k)}`,
            "unknown property"
          ]}
        );
      }
    }
  },

  has: (o, k, p) => {
    switch (k) {
      case TS: return true;
      case TR: return true;

      default: _throw(
        TypeError,
        ["illegal property introspection"],
        tSig,
        {desc: [
          `of ${prettyPrintK(k)}`,
          "duck typing is not allowed"
        ]}
      );
    }
  },

  set: (o, k, v, p) => setRec(tRep, tSig, o, k, {value: v}, {mode: "set"}),
  defineProperty: (o, k, d) => setRec(tRep, tSig, o, k, d, {mode: "def"}),

  deleteProperty: (o, k) => _throw(
    TypeError,
    ["illegal property deletion"],
    tSig,
    {desc: [
      `of ${prettyPrintK(k)}`,
      "Records are sealed"
    ]}
  ),

  ownKeys: o => _throw(
    TypeError,
    ["illegal property introspection"],
    tSig,
    {desc: [
      `of ${prettyPrintK(k)}`,
      "meta programming is not allowed"
    ]}
  )
});


const setRec = (tRep, tSig, o, k, d, {mode}) => {
  if (!(k in o)) _throw(
    TypeError,
    ["illegal property mutation"],
    tSig,
    {desc: [
      `unknown key ${prettyPrintK(k)}`,
      "Records are sealed"
    ]}
  );

  else if (serialize(tRep.children[k]) !== `${introspect(d.value)}`) {
    const [from, to] = tRep.children[0].range;

    _throw(
      TypeError,
      ["illegal property mutation"],
      tSig,
      {range: [from, to], desc: [
        `of ${prettyPrintK(k)} with type ${introspect(d.value)}`,
        "Record fields must preserve their type"
      ]}
    );
  }

  else {
    if (mode === "set") o[k] = d.value;
    else Reflect.defineProperty(o, k, d);
    return o;
  }
};


/******************************************************************************
*****[ 7.6. Tuples ]***********************************************************
******************************************************************************/


export const Tup = xs => {
  if (types) {
    if (introspect(xs) !== "Array") _throw(
      TypeError,
      ["Tup expects an Array"],
      introspect(xs),
      {desc: ["received"]}
    );

    else if (TR in xs) return xs;

    const tSig = introspectR(xs),
      tRep = deserialize(tSig);

    if (tRep.tag === "Arr") _throw(
      TypeError,
      ["Tup received an invalid Array"],
      tSig,
      {desc: [
        "Tuples must contain at least 2 fields",
        `${tRep.children.length} field(s) received`
      ]}
    );

    return new Proxy(xs, handleTup(tRep, tSig));
  }

  else return xs;
};


const handleTup = (tRep, tSig) => ({
  get: (xs, i, p) => {
    switch (i) {
      case "toString": return () => tSig;
      case Symbol.toStringTag: return "Tup";
      case Symbol.isConcatSpreadable: return xs[Symbol.isConcatSpreadable];
      case TR: return tRep;
      case TS: return tSig;

      case Symbol.toPrimitive: return hint => {
        _throw(
          TypeError,
          ["illegal type coercion"],
          tSig,
          {desc: [
            `to target type ${capitalize(hint)}`,
            "implicit type convertions are not allowed"
          ]}
        );
      };

      default: {
        if (i in xs) return xs[i];

        else _throw(
          TypeError,
          ["invalid property access"],
          tSig,
          {desc: [
            `of ${prettyPrintK(i)}`,
            "unknown property"
          ]}
        );
      }
    }
  },

  has: (xs, i, p) => {
    switch (i) {
      case TS: return true;
      case TR: return true;

      default: _throw(
        TypeError,
        ["illegal property introspection"],
        tSig,
        {desc: [
          `of ${prettyPrintK(i)}`,
          "duck typing is not allowed"
        ]}
      );
    }
  },

  set: (xs, i, v, p) => setTup(tRep, tSig, xs, i, {value: v}, {mode: "set"}),
  defineProperty: (xs, i, d) => setTup(tRep, tSig, xs, i, d, {mode: "def"}),

  deleteProperty: (xs, i) => _throw(
    TypeError,
    ["illegal property deletion"],
    tSig,
    {desc: [
      `of property ${prettyPrintK(i)}`,
      "Tuples are sealed"
    ]}
  ),

  ownKeys: xs => _throw(
    TypeError,
    ["illegal property introspection"],
    tSig,
    {desc: [
      `of ${prettyPrintK(i)}`,
      "meta programming is not allowed"
    ]}
  )
});


const setTup = (tRep, tSig, xs, i, d, {mode}) => {
  if (Number.isNaN(Number(i))) _throw(
    TypeError,
    ["illegal property mutation"],
    tSig,
    {desc: [
      `of property ${prettyPrintK(i)} with type ${introspect(d.value)}`,
      "Tuples are immutable for non-numeric properties"
    ]}
  );

  else {
    if (Number(i) >= xs.length) _throw(
      TypeError,
      ["illegal property setting"],
      tSig,
      {desc: [
        `of ${prettyPrintK(i)} with type ${introspect(d.value)}`,
        `where Tuple includes only ${xs.length} fields`,
        "Tuples are sealed"
      ]}
    );

    else if (serialize(tRep.children[i]) !== `${introspect(d.value)}`) {
      const [from, to] = tRep.children[0].range;

      _throw(
        TypeError,
        ["illegal property mutation"],
        tSig,
        {range: [from, to], desc: [
          `of ${prettyPrintK(i)} with type ${introspect(d.value)}`,
          "Tuple fields must preserve their type"
        ]}
      );
    }

    else {
      if (mode === "set") xs[i] = d.value;
      else Reflect.defineProperty(xs, i, d);
      return xs;
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


class ArityError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ArityError);
  }
};


class ReturnTypeError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ReturnTypeError);
  }
};


class ParseError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, ParseError);
  }
};


class SerialError extends Error {
  constructor(x) {
    super(x);
    Error.captureStackTrace(this, SerialError);
  }
};


//***[ 7.8.2. Throwing ]*******************************************************


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
        : `\n\nINTERMEDIATES:\n\n${sigLog.join("\n")}`
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


//***[ 7.8.3. Formatting ]*****************************************************


const ul = (n, m) => Array(n + 1).join(" ") + Array(m - n + 2).join("^");


const prettyPrintK = x => {
  const tag = getStringTag(x);
  
  if (tag === "Symbol") return x.toString();
  else if (tag === "String" && Number.isNaN(Number(x))) return `"${x}"`;
  else return `index #${x}`;
};


const prettyPrintV = x => {
  const tag = getStringTag(x);
  
  if (tag === "Symbol") return x.toString();
  else if (tag === "String") return `"${x}"`;
  else return x;
};


/******************************************************************************
*******************************************************************************
*****************************[ 8. MISCALLANIOUS ]******************************
*******************************************************************************
******************************************************************************/


const capitalize = s => s[0].toUpperCase() + s.slice(1);


const last = xs => xs[xs.length - 1];


const xor = x => y => !x === !y ? false : true;


const U = f => f(f);


//***[ 8.1. Generator Functions ]********************************************


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