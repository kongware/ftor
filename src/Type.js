"use strict";


// DEPENDENCIES


const Err = require("./proto/Err");


/**
 * @name Type
 * @type namespace
 */


const Type = {}


// PROXY


/**
 * @name virtualize
 * @type higher order function
 * @rev 0
 */


// Object -> (String, Function) -> (...? -> ?) -> Function
Type.virtualize = handler => (name, f) => (...cs) => {
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
Type.handle = (name, [c, ...cs]) => ({
  // apply trap
  apply: (f, _, args) => {
    let g, r;

    // type check
    r = c(args)

    // handle type mismatch
    if (Error.prototype.isPrototypeOf(r)) {
      const [x, y] = Err.get$(r);

      switch (r.constructor) {
        case ArityError: {
          throw new ArityError(`${name} expects ${x} argument(s) (${y} received)`);
        }

        case TypeError: {
          throw new TypeError(`${name} expects a(n) ${x} (${y} received)`);
        }
      }
    }

    // produce the return value
    if (cs.length === 1) {
      // return type check
      r = cs[0] (f(...args));

      // handle type mismatch
      if (Error.prototype.isPrototypeOf(r)) {
        const [x, y] = Err.get$(r);
        throw new ReturnTypeError(`${name} must return a(n) ${x} (${y} returned)`);
      }

      return r;
    }

    // create new proxy instance
    g = new Proxy(f(...args), handle(type, name, cs))

    // enable string coercion for apply traps
    g.toString = Function.prototype.toString.bind(f);

    return g;
  },

  // get trap
  get: (o, k) => k === "name" ? name : o[k]
});


 // REFLECTION


/**
 * @name get type
 * @type higher order function
 * @rev 0
 */


// a -> String
Type.get = x => Object.prototype.toString.call(x).split(" ")[1].slice(0, -1);


/**
 * @name instance of
 * @type higher order function
 * @rev 0
 */


// a -> Boolean
Type.instanceOf = cons => o => cons.prototype.isPrototypeOf(o);


/**
 * @name introspect
 * @type higher order function
 * @rev 0
 */


// a -> [String]
Type.introspect = x => {
  switch (typeof x) {
    case "undefined": return ["Undefined"];

    case "number": {
      if (isNaN(x)) return ["Number", "NaN"];
      if (!isFinite(x)) return  ["Num", "Infinity"];
      return ["Number"];
    }

    case "string": return ["String"];
    case "boolean": return ["Boolean"];
    case "symbol": return ["Symbol"];
    case "function": return ["Function"];

    case "object": {
      if (x === null) return ["Null"];
      return Array.from(new Set([
        "Object",
        Type.get(x),
        x.constructor.name
      ]));
    }
  }
};


// CONTRACTS


// Number -> [a] -> [a]|TypeError (String [?])
Type.lenOf = n => xs => xs.length === n ? xs : Err(TypeError) (Type.introspect(xs));


// Number -> Number|TypeError (String [?])
Type.num = x => typeof x === "number" ? x : Err(TypeError) (introspect(x));

Type.num.toString = () => "Number";


// API


module.exports = Type;