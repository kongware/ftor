"use strict";


/**
 * @name monadic lift
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Ident = Symbol.for("ftor/Ident");

  const Ident = x => {
    const Ident = f => f(x);
    return (Ident[$tag] = "Ident", Ident[$Ident] = true, Ident);
  };

  Ident.of = x => Ident(x);

  Ident.chain = ft => tx => tx[$Ident] && tx(x => {
    const r = ft(x);
    return r[$Ident] && r;
  });

  const liftm2 = (of, chain) => f => tx => ty => chain(x => chain(y => of(f(x) (y))) (ty)) (tx);
  const add = x => y => x + y;

  liftm2(Ident.of, Ident.chain) (add) (Ident(2)) (Ident(3)); // Ident(5)

 */


// Monad m => (a -> b -> c) -> m a -> m b -> m c
const liftm2 = (of, chain) => f => tx => ty => chain(x => chain(y => of(f(x) (y))) (ty)) (tx);


// Monad m => (a -> b -> c -> d) -> m a -> m b -> m c -> m d
const liftm3 = (of, chain) => f => tx => ty => tz => chain(x => chain(y => chain(z => of(f(x) (y))) (tz)) (ty)) (tx);


// API


module.exports = {liftm2, liftm3};