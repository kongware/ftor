"use strict";


/**
 * @name _$_
 * @note debugging; interception; haskell-style
 * @type impure higher order function
 * @status experimental
 * @example

   const _$$_ = (f, tag = f.name) => (...args1) => (...args2) => {
     let r;
     f = f(...args1);
     r = f(...args2);
     args1 = args1.map(x => typeof x + "(" + x + ")");
     args2 = args2.map(x => typeof x + "(" + x + ")");
     console.log(tag + "(" + args1.join(", ") + ")", "(" + args2.join(", ") + ")", "===", typeof r + "(" + r + ")");
     return r;
   };

   const add = _$$_(x => y => x + y, "add");

   add(2) (3); // add(number(2)) (number(3)) === number(5)
   add(2) ("3"); // add(number(2)) (string(3)) === string(23)

 */


// ?
const _$_ = (f, tag = f.name) => (...args) => {
  let r = f(...args);
  args = args.map(x => typeof x + "(" + x + ")");
  console.log(tag + "(" + args.join(", ") + ")", "===", typeof r + "(" + r + ")");
  return r;
};


const _$$_ = (f, tag = f.name) => (...args1) => (...args2) => {
  let r;
  f = f(...args1);
  r = f(...args2);
  args1 = args1.map(x => typeof x + "(" + x + ")");
  args2 = args2.map(x => typeof x + "(" + x + ")");
  console.log(tag + "(" + args1.join(", ") + ")", "(" + args2.join(", ") + ")", "===", typeof r + "(" + r + ")");
  return r;
};


const _$$$_ = (f, tag = f.name) => (...args1) => (...args2) => (...args3) => {
  let r;
  f = f(...args1);
  f = f(...args2);
  r = f(...args3);
  args1 = args1.map(x => typeof x + "(" + x + ")");
  args2 = args2.map(x => typeof x + "(" + x + ")");
  args3 = args3.map(x => typeof x + "(" + x + ")");
  console.log(tag + "(" + args1.join(", ") + ")", "(" + args2.join(", ") + ")", "(" + args3.join(", ") + ")", "===", typeof r + "(" + r + ")");
  return r;
};


// API


module.exports = {_$_, _$$_, _$$$_};