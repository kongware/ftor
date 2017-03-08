"use strict";

const {guard, log, negf, print, raise} = require("./generic");

typecheck = {};


typecheck.reflectf = (...preds) => (...arities) => (f, tag = f.name) => (...args) => {
  if (args.length !== arities[0]) {
    throw new TypeError(`${tag} expects an ${arities[0]}-ary lambda (${args.length}-ary given)`);
  }

  args.forEach((arg, i) => preds[i](arg));
  const r = f(...args);

  if (args.length === arities.length) return (preds[1](r), r);

  if (typeof r !== "function") {
    throw new TypeError(`${tag} must return a lambda (${typeof r} given)`);
  }

  return typecheck.reflectf(...preds.slice(args.length)) (...arities.slice(args.length)) (r, tag);
}


typecheck.instanceOf = ctor => x => x instanceof ctor;


typecheck.invalidArgOf = tag => tag + " expects ${0} as argument (${1} given)";


typecheck.invalidRVOf = tag => tag + " must return ${0} (${1} given)";


typecheck.isNotTypeOf = type => x => typeof x !== type;


typecheck.isTypeOf = type => x => typeof x === type;


typecheck.orLog = type => template => x => log(print(template) (type, typeof x));


typecheck.orRaise = type => template => x => raise(TypeError) (print(template) (type, typeof x));


typecheck.validate = type => f => template => guard(f(type) (template)) (typecheck.isNotTypeOf(type));


typecheck.typeOf = x => typeof x;


/*** derived functions ***/


typecheck.isArr = typecheck.isTypeOf("array");


typecheck.isBool = typecheck.isTypeOf("boolean");


typecheck.isFunc = typecheck.isTypeOf("function");


typecheck.isNull = x => x === null;


typecheck.isNum = typecheck.isTypeOf("number");


typecheck.isObj = x => x !== null && typecheck.isTypeOf("object");


typecheck.isNotArr = negf(typecheck.isArr);


typecheck.isNotBool = negf(typecheck.isBool);


typecheck.isNotFunc = negf(typecheck.isFunc);


typecheck.isNotNull = x => x !== null;


typecheck.isNotNum = negf(typecheck.isNum);


typecheck.isNotObj = negf(typecheck.isObj);


typecheck.isNotStr = negf(typecheck.isStr);


typecheck.isNotSym = negf(typecheck.isSym);


typecheck.isStr = typecheck.isTypeOf("string");


typecheck.isSym = typecheck.isTypeOf("symbol");


module.exports = typecheck;