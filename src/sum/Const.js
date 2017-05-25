"use strict";


// dependencies


const {$Const, $tag} = require("../interop");


/**
 * @name Constant
 * @note Church encoded; combined namespace/constructor
 * @type sum type
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Const = Symbol.for("ftor/Const");
  const $Ident = Symbol.for("ftor/Ident");

  const Const = x => {
    const Const = f => x;
    return (Const[$tag] = "Const", Const[$Const] = true, Const);
  };

  const Ident = x => {
    const Ident = f => f(x);
    return (Ident[$tag] = "Ident", Ident[$Ident] = true, Ident);
  };

  Const.map = f => tx => tx[$Const] && Const(tx(x => f(x)));

  const I = x => x;
  const sqr = x => x * x;

  const x = Const(5),
   y = Ident(5);

  Const.map(sqr) (x) (I); // 5
  Const.map(sqr) (y) (I); // TypeError

 */


// a -> (a -> r) -> a
const Const = x => {
  const Const = f => x;
  return (Const[$tag] = "Const", Const[$Const] = true, Const);
};


/**
 * @name fold
 * @type higher order function
 * @class Foldable
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Const = Symbol.for("ftor/Const");

  const Const = x => {
    const Const = f => x;
    return (Const[$tag] = "Const", Const[$Const] = true, Const);
  };

  Const.fold = f => acc => tx => tx[$Const] && acc;
  const add = x => y => x + y;

  Const.fold(add) (2) (Const(3)); // 2

 */


// (b -> a -> b) -> b -> Const a -> b
Const.fold = f => acc => tx => tx[$Const] && acc;


// API


module.exports = Const;