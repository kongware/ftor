"use strict";


// dependencies


const $tag = require("./interop/props");


/**
 * @name _$_
 * @note intercepting applicator; impure
 * @type higher order function
 * @status stable
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
    case "function": return (x.name || "λ") + "(" + x.length + ")";

    case "number": {
      if (isNaN(x) || !isFinite) return x.toSting();
      return "Number<" + x + ">";
    }
    
    case "object": {
      if (x === null) return "null";
      
      if (Array.isArray(x)) {
        if (depth > 1 || x.length > 5) return "Array<" + x.length + ">";
        return "Array[" + x.map(x => typeCheck(x, 2)).join(", ") + "]";
      }
      
      if ($tag in x) return x.toString();

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
        if (depth > 1 || len > 5) return x.constructor.name + "{" + len + "}";
        return x.constructor.name + "{" + Object.entries(x)
         .reduce((acc, x) => acc.concat(x), [])
         .map((x, i, xs) => i % 2 === 0 ? x : typeCheck(x, 2))
         .reduce((acc, x, i, xs) => i % 2 === 0 ? acc.concat([x + ":" + xs[i + 1]]) : acc, [])
         .join(", ") + "}";
      }

      let len = Object.keys(x).length;
      if (depth > 1 || len > 5) return "Object{" + len + "}";
      return "Object{" + Object.entries(x)
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
const _$_ = (f, tag = f.name) => (...args) => {
  let r = f(...args);

  args = args.map(typeCheck, 1);
  console.log(tag + "(" + args.join(", ") + ")", "==>", typeCheck(r, 1));
  return r;
};


// ?
const _$$_ = (f, tag = f.name) => (...args1) => {
  let g = f(...args1);

  args1 = args1.map(typeCheck, 1);
  console.log(tag + "(" + args1.join(", ") + ") ...");

  return (...args2) => {
    let r = g(...args2);

    args2 = args2.map(typeCheck, 1);
    console.log(tag + "(" + args1.join(", ") + ")", "(" + args2.join(", ") + ")", "==>", typeCheck(r, 1));
    return r;
  };
};


// ?
const _$$$_ = (f, tag = f.name) => (...args1) => {
  let g = f(...args1);

  args1 = args1.map(typeCheck, 1);
  console.log(tag + "(" + args1.join(", ") + ") ...");

  return (...args2) => {
    let h = g(...args2);

    args2 = args2.map(typeCheck, 1);
    console.log(tag + "(" + args2.join(", ") + ") ...");

    return (...args3) => {
      let r = h(...args3);

      args3 = args3.map(typeCheck, 1);
      console.log(tag + "(" + args1.join(", ") + ")", "(" + args2.join(", ") + ")", "(" + args3.join(", ") + ")", "==>", typeCheck(r, 1));
      return r;
    };
  };
};


// API


module.exports = {_$_, _$$_, _$$$_};