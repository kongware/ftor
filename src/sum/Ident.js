"use strict";


// dependencies


const {$Ident, $tag} = require("../interop");
const {T} = require("../T");


/**
 * @name Identity
 * @note Church encoded; combined namespace/constructor
 * @type sum type
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Ident = Symbol.for("ftor/Ident");
  const $Const = Symbol.for("ftor/Const");

  const Ident = x => {
    const Ident = f => f(x);
    return (Ident[$tag] = "Ident", Ident[$Ident] = true, Ident);
  };

  const Const = x => {
    const Const = f => f(x);
    return (Const[$tag] = "Const", Const[$Const] = true, Const);
  };

  Ident.map = f => tx => tx[$Ident] && Ident(tx(x => f(x)));

  const I = x => x;
  const sqr = x => x * x;

  const x = Ident(5),
   y = Const(5);

  Ident.map(sqr) (x) (I); // 25
  Ident.map(sqr) (y) (I); // TypeError

 */


const Ident = x => {
  const Ident = f => f(x);
  return (Ident[$tag] = "Ident", Ident[$Ident] = true, Ident);
};


/**
 * @name map
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Ident = Symbol.for("ftor/Ident");

  const Ident = x => {
    const Ident = f => f(x);
    return (Ident[$tag] = "Ident", Ident[$Ident] = true, Ident);
  };

  Ident.map = f => tx => tx[$Ident] && Ident(tx(x => f(x)));

  const I = x => x;
  const sqr = x => x * x;
  const dbl = x => x * 2;
  const x = Ident(5);

  Ident.map(sqr) (Ident.map(dbl) (x)) (I); // 100

 */


Ident.map = f => tx => tx[$Ident] && Ident(tx(x => f(x)));


// API


module.exports = Ident;