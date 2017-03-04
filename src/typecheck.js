"use strict";

const {tap3} = require("./generic");

const typecheck = {};


typecheck.arguments = (...types) => (...arities) => (f, tag = f.name) => (...args) => {
  if (args.length !== arities[0]) {
   throw new TypeError(`${tag} is ${arities[0]}-ary (${args.length}-ary given)`);
  }

  args.forEach((arg, i) => {
    if (typeof types[i] === "function") {
      if (!(arg instanceof types[i])) {
        throw new TypeError(`${tag} expects type ${types[i]} - ${arg.constructor} given`);
      }
    } else {
      if (typeof arg !== types[i]) {
        throw new TypeError(`${tag} expects type ${types[i]} - ${typeof arg} given`);
      }
    }
  });

  if (arities.length - args.length === 0) {
    return typecheck.returnValue(types[0]) (tag) (f(...args));
  }

  return checkType(...types.slice(args.length))
   (...arities.slice(args.length))
   (typecheck.returnValue("function") (tag) (f(...args)), tag);
}


typecheck.returnValue = tap3(type => tag => x => {
  if (typeof type === "function") {
    if (!(x instanceof type)) {
      throw new TypeError(`${tag} must return a function - ${x.constructor} given`);
    }
  } else {
    if (typeof x !== type) {
      throw new TypeError(`${tag} must return a function - ${typeof x} given`);
    }
  }
});


module.exports = typecheck;