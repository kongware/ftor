"use strict";


// dependencies


const {$Ident, $tag} = require("../interop");


/**
 * @name Identity
 * @note Church encoded; combined namespace/constructor
 * @type sum type
 * @status unstable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Ident = Symbol.for("ftor/Ident");
  const $Const = Symbol.for("ftor/Const");

  const Ident = x => {
    const Ident = f => f(x);
    return (Ident[$tag] = "Ident", Ident[$Ident] = true, Ident);
  };

  const Const = x => {
    const Const = f => x;
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


// a -> (a -> r) -> r
const Ident = x => {
  const Ident = f => f(x);
  return (Ident[$tag] = "Ident", Ident[$Ident] = true, Ident);
};


/**
 * @name fold
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Ident = Symbol.for("ftor/Ident");

  const Ident = x => {
    const Ident = f => f(x);
    return (Ident[$tag] = "Ident", Ident[$Ident] = true, Ident);
  };

  Ident.fold = f => acc => tx => tx[$Ident] && tx(x => f(acc) (x));
  const add = x => y => x + y;

  Ident.fold(add) (5) (Ident(5)); // 10

 */


// (a -> b -> a) -> a -> Ident b -> a
Ident.fold = f => acc => tx => tx[$Ident] && tx(x => f(acc) (x));


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

  const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);
  const I = x => x;
  const sqr = x => x * x;
  const dbl = x => x * 2;

  const x = Ident(5);

  B_(Ident.map(sqr), Ident.map(dbl)) (x) (I); // 100

 */


// (a -> b) -> Ident a -> Ident b
Ident.map = f => tx => tx[$Ident] && Ident(tx(x => f(x)));


/**
 * @name apply
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
  Ident.ap = tf => tx => tf[$Ident] && tf(f => Ident.map(f) (tx));

  const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);
  const I = x => x;
  const add = x => y => x + y;

  B_(Ident.ap, Ident.map(add)) (Ident(5)) (Ident(5)) (I); // 10

 */


// Ident (a -> b) -> Ident a -> Ident b
Ident.ap = tf => tx => tf[$Ident] && tf(f => Ident.map(f) (tx));


/**
 * @name chain
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

  Ident.chain = ft => tx => tx[$Ident] && tx(x => {
    const r = ft(x);
    return r[$Ident] && r;
  });

  const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);
  const I = x => x;
  const add = x => y => x + y;

  Ident.chain(x => Ident.chain(y => Ident(add(x) (y))) (Ident(5))) (Ident(5)) (I); // 10
  Ident.chain(x => Ident.chain(y => Ident(add(x) (y))) (Ident(5))) (Ident(5)) (I); // TypeError

 */


// (a -> Ident(b)) -> Ident a -> Ident b
Ident.chain = ft => tx => tx[$Ident] && tx(x => {
  const r = ft(x);
  return r[$Ident] && r;
});


/**
 * @name traverse
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Ident = Symbol.for("ftor/Ident");

  const Ident = x => {
    const Ident = f => f(x);
    return (Ident[$tag] = "Ident", Ident[$Ident] = true, Ident);
  };

  Ident.traverse = map => ft => tx => tx(x => map(Ident) (ft(x)));

  const map = f => xs => xs.map(f);
  const I = x => x;

  const r1 = Ident.traverse(map) (x => x === null ? [] : [x]) (Ident(1)); // [Ident(1)]
  const r2 = Ident.traverse(map) (x => x === null ? [] : [x]) (Ident(null)); // []

  r1 [0] (I); // 1
  r2; // []

 */


// (Functor t, Foldable t, Applicative f) => (a -> f b) -> t a -> f (t b)
Ident.traverse = map => ft => tx => map(y => Ident(y)) (tx(x => ft(x)));


Ident.traverse = map => ft => tx => tx(x => map(Ident) (ft(x)));


// API


module.exports = Ident;