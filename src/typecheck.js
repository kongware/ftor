"use strict";

const {guard, log, negf, raise} = require("./generic");

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


typecheck.checkAndLog = type => template => guard(
  x => log(print(template) (type, typeof x))
) (isNotNum);


typecheck.checkAndRaise = type => template => guard(
  x => raise(TypeError) (print (template) (type, typeof x))
) (isNotNum);


typecheck.instanceOf = ctor => x => x instanceof ctor;


typecheck.isTypeOf = type => x => typeof x === type;


typecheck.wrongArgOf = tag => tag + " expects ${0} as argument (${1} given)";


typecheck.wrongRVOf = tag => tag + " must return ${0} (${1} given)";


/*** derived functions ***/


typecheck.isArr = typecheck.isTypeOf("array");


typecheck.isBool = typecheck.isTypeOf("boolean");


typecheck.isFunc = typecheck.isTypeOf("function");


typecheck.isNull = x => x === null;


typecheck.isNum = typecheck.isTypeOf("number");


typecheck.isObj = x => x !== null && typecheck.isTypeOf("object");


typecheck.isNotArr = negf(isArr);


typecheck.isNotBool = negf(isBool);


typecheck.isNotFunc = negf(isFunc);


typecheck.isNotNull = x => x !== null;


typecheck.isNotNum = negf(isNum);


typecheck.isNotObj = negf(isObj);


typecheck.isNotStr = negf(isStr);


typecheck.isNotSym = negf(isSym);


typecheck.isStr = typecheck.isTypeOf("string");


typecheck.isSym = typecheck.isTypeOf("symbol");


module.exports = typecheck;