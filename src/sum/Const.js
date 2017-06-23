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

  Const.map = f => tx => tx[$Const] && Const(tx(x => f(x)));

  const I = x => x;
  const sqr = x => x * x;

  const x = Const(5);

  Const.map(sqr) (x) (I); // 5

 */


// forall r . a -> (a -> r) -> a
const Const = x => {
  const Const = f => x;
  return (Const[$tag] = "Const", Const[$Const] = true, Const);
};


// FOLDABLE


/**
 * @name fold
 * @type higher order function
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


// TRAVERSABLE


/**
 * @name traverse
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Const = Symbol.for("ftor/Const");

  const Const = x => {
    const Const = f => x;
    return (Const[$tag] = "Const", Const[$Const] = true, Const);
  };

  Const.traverse = (of, map) => ft => tx => tx[$Const] && map(Const) (of(tx(_ => null)));

  const map = f => xs => xs.map(f);
  const of = x => [x];
  const I = x => x;

  const r1 = Const.traverse(of, map) (x => x === null ? [] : [x]) (Const(1)); // [Const(1)]
  const r2 = Const.traverse(of, map) (x => x === null ? [] : [x]) (Const(null)); // [Const(null)]

  r1 [0] (I); // 1
  r2 [0] (I); // null

 */


// Applicative f => (a -> f b) -> Const m a -> f (Const m b)
Const.traverse = (of, map) => ft => tx => tx[$Const] && map(Const) (of(tx(_ => null)));


// FUNCTOR


/**
 * @name map
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Const = Symbol.for("ftor/Const");

  const Const = x => {
    const Const = f => x;
    return (Const[$tag] = "Const", Const[$Const] = true, Const);
  };

  Const.map = f => tx => tx[$Const] && tx;

  const comp_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);
  const I = x => x;
  const sqr = x => x * x;
  const dbl = x => x * 2;

  const x = Const(5);

  comp_(Const.map(sqr), Const.map(dbl)) (x) (I); // 5

 */


// (a -> b) -> Const a -> Const b
Const.map = f => tx => tx[$Const] && tx;


// APPLY


/**
 * @name apply
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Const = Symbol.for("ftor/Const");

  const Const = x => {
    const Const = f => x;
    return (Const[$tag] = "Const", Const[$Const] = true, Const);
  };

  Const.ap = append => tx => ty => tx(x => ty(y => Const(append(tx) (ty))));

  const concat = x => y => x.concat(y);
  const I = x => x;

  Const.ap(Const("foo")) (Const("bar"));

 */


// Const m (a -> b) -> Const m a -> Const m b
Const.ap = append => tx => ty => tx(x => ty(y => Const(append(tx) (ty))));


// APPLICATIVE


/**
 * @name of
 * @type higher order function
 * @status stable
 */


// a -> Const a
Const.of = empty => x => empty;


// API


module.exports = Const;