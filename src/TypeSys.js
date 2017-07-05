"use strict";


/**
 * @name type system
 * @type namespace
 * @rev 0
 */


const TypeSys = {}


TypeSys.getType = x => Object.prototype.toString.call(x).split(" ")[1].slice(0, -1);


TypeSys.instanceOf = cons => o => cons.prototype.isPrototypeOf(o);


TypeSys.introspect = x => {
  switch (typeof x) {
    case "undefined": return ["Undefined"];

    case "number": {
      if (isNaN(x)) return ["Num", "NaN"];
      if (!isFinite(x)) return  ["Num", "Infinity"];
      return ["Number"];
    }

    case "string": return ["Str"];
    case "boolean": return ["Boo"];
    case "symbol": return ["Sym"];
    case "function": return ["Fun"];

    case "object": {
      if (x === null) return ["Null"];
      return Array.from(new Set([
        "Object",
        TypeSys.getType(x),
        x.constructor.name
      ]));
    }
  }
};


/**
 * @name virtualize
 * @type higher order function
 * @rev 0
 */


// Object -> (String, Function) -> [? -> ?] -> Function
TypeSys.virtualize = handler => (name, f) => (...cs) => {
  // create new proxy instance
  const g = new Proxy(f, handler(name, cs));

  // enable string coercion for apply traps
  g.toString = Function.prototype.toString.bind(f);

  return g;
};


/**
 * @name handle
 * @note handle apply traps for virtualized functions
 * @type proxy object
 * @rev 0
 */


// (String, [? -> ?]) -> Function
TypeSys.handle = (name, [c, ...cs]) => ({
  // apply trap
  apply: (f, _, args) => {
    let g, r;

    // type check
    r = c(args)

    // handle type mismatch
    if (Error.prototype.isPrototypeOf(r)) {
      switch (r.constructor) {
        case ArityError: {
          throw new ArityError(`${name} expects ${Err.get$(r)[0]} argument(s) (${Err.get$(r)[1]} given)`);
        }

        case TypeError: {
          throw new TypeError(`${name} expects a(n) ${Err.get$(r)[0]} (${Err.get$(r)[1]} given)`);
        }
      }
    }

    // produce the return value
    if (cs.length === 1) {
      // return type check
      r = cs[0](f(...args));

      // handle type mismatch
      if (Error.prototype.isPrototypeOf(r)) {
        throw new ReturnTypeError(`${name} must return a ${Err.get$(r)[0]} (${Err.get$(r)[1]} given)`);
      }

      return r;
    }

    // create new proxy instance
    g = new Proxy(f(...args), handleFun(type, name, cs))

    // enable string coercion for apply traps
    g.toString = Function.prototype.toString.bind(f);

    return g;
  },

  // get trap
  get: (o, k) => k === "name" ? name : o[k];
});



// API


module.exports = TypeSys;