"use strict";


// dependencies


const $tag = require("./global/interop");


/**
 * @name _$_
 * @note intercepting applicator; impure
 * @type higher order function
 * @status unstable
 * @example

   const add = _$$_(x => y => x + y, "add");

   // logs the sequence

   // add(Number<2>) ...
   // add(Number<2>) (Number<3>) ==> Number<5>
 */


// internal


const typeCheck = (x, depth) => {
  switch (typeof x) {
    case "boolean": return "Boolean<" + x + ">";
    case "function": return (x.name || "λ") + (x.length === 0 ? "(_)" : "(" + "*".repeat(x.length) + ")");

    case "number": {
      if (isNaN(x) || !isFinite) return x.toSting();
      return "Number<" + x + ">";
    }
    
    case "object": {
      if (x === null) return "null";
      
      if (Array.isArray(x)) {
        if (depth > 1 || x.length > 5) return "[*" + x.length + "]";
        return "[" + x.map(x => typeCheck(x, 2)).join(", ") + "]";
      }
      
      if ($tag in x) return x[$tag] + "{" + typeCheck(x, 2) + "}";

      if (x instanceof Map) {
        if (depth > 1 || x.size > 5) return "Map{" + x.size + "}";
        return "Map{" + Array.from(x.entries(x))
         .reduce((acc, x) => acc.concat(x), [])
         .map(x => typeCheck(x, 2))
         .reduce((acc, x, i, xs) => i % 2 === 0 ? acc.concat([x + ":" + xs[i + 1]]) : acc, [])
         .join(", ") + "}";
      }

      if (x instanceof Set) {
        if (depth > 1 || x.size > 5) return "Set{" + x.size + "}";
        return "Set{" + Array.from(x.values(x))
         .map(x => typeCheck(x, 2))
         .join(", ") + "}";
      }

      if (Symbol.iterator in x) return "Iterator";
      
      if (constructor in x) {
        let len = Object.keys(x).length;
        if (depth > 1 || len > 5) return x.constructor.name + "{*" + len + "}";
        return x.constructor.name + "{" + Object.entries(x)
         .reduce((acc, x) => acc.concat(x), [])
         .map((x, i, xs) => i % 2 === 0 ? x : typeCheck(x, 2))
         .reduce((acc, x, i, xs) => i % 2 === 0 ? acc.concat([x + ":" + xs[i + 1]]) : acc, [])
         .join(", ") + "}";
      }

      let len = Object.keys(x).length;
      if (depth > 1 || len > 5) return "{*" + len + "}";
      return "{" + Object.entries(x)
       .reduce((acc, x) => acc.concat(x), [])
       .map((x, i, xs) => i % 2 === 0 ? x : typeCheck(x, 2))
       .reduce((acc, x, i, xs) => i % 2 === 0 ? acc.concat([x + ":" + xs[i + 1]]) : acc, [])
       .join(", ") + "}";
    }

    case "string": return "String<" + x + ">";
    case "symbol": return x.toString();
    case "undefined": return "undefined";
    default: return constructor in x ? x.constructor.name : "Host";
  }
};


// ?
const _$_ = (f, tag = f.name) => {
  const a = (...args) => {
    let r = f(...args);

    args = args.map(typeCheck, 1);
    console.log(tag + "(" + args.join(", ") + ")", "==>", typeCheck(r, 1));
    return r;
  };

  Object.defineProperty(a, "name", {value: tag, writable: true});
  Object.defineProperty(a, "length", {value: f.length, writable: true});
  return a;  
};


// ?
const _$$_ = (f, tag = f.name) => {
  const a = (...args1) => {
    let g = f(...args1);

    args1 = args1.map(typeCheck, 1);
    console.log(tag + "(" + args1.join(", ") + ") ...");

    const b = (...args2) => {
      let r = g(...args2);

      args2 = args2.map(typeCheck, 1);
      console.log(tag + "(" + args1.join(", ") + ")", "(" + args2.join(", ") + ")", "==>", typeCheck(r, 1));
      return r;
    };

    Object.defineProperty(b, "name", {value: tag, writable: true});
    Object.defineProperty(b, "length", {value: g.length, writable: true});
    return b;
  };

  Object.defineProperty(a, "name", {value: tag, writable: true});
  Object.defineProperty(a, "length", {value: f.length, writable: true});
  return a;
};


// ?
const _$$$_ = (f, tag = f.name) => {
  const a = (...args1) => {
    let g = f(...args1);

    args1 = args1.map(typeCheck, 1);
    console.log(tag + "(" + args1.join(", ") + ") ...");

    const b = (...args2) => {
      let h = g(...args2);

      args2 = args2.map(typeCheck, 1);
      console.log(tag + "(" + args1.join(", ") + ")", "(" + args2.join(", ") + ") ...");

      const c = (...args3) => {
        let r = h(...args3);

        args3 = args3.map(typeCheck, 1);
        console.log(tag + "(" + args1.join(", ") + ")", "(" + args2.join(", ") + ")", "(" + args3.join(", ") + ")", "==>", typeCheck(r, 1));
        return r;
      };

      Object.defineProperty(c, "name", {value: tag, writable: true});
      Object.defineProperty(c, "length", {value: h.length, writable: true});
      return c;
    };

    Object.defineProperty(b, "name", {value: tag, writable: true});
    Object.defineProperty(b, "length", {value: g.length, writable: true});
    return b;
  };

  Object.defineProperty(a, "name", {value: tag, writable: true});
  Object.defineProperty(a, "length", {value: f.length, writable: true});
  return a;
};


// API


module.exports = {_$_, _$$_, _$$$_};