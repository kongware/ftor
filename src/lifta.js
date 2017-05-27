"use strict";


/**
 * @name applicative lift
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
  Ident.ap = tf => tx => tf[$Ident] && tx[$Ident] && tf(f => Ident.map(f) (tx));

  const lifta2 = (map, ap) => f => tx => ty => ap(map(f) (tx)) (ty);
  const add = x => y => x + y;

  lifta2(Ident.map, Ident.ap) (add) (Ident(2)) (Ident(3)); // Ident(5)

 */


// Applicative f => (a -> b -> c) -> f a -> f b -> f c
const lifta2 = (map, ap) => f => tx => ty => ap(map(f) (tx)) (ty);


// Applicative f => (a -> b -> c -> d) -> f a -> f b -> f c -> f d
const lifta3 = (map, ap) => f => tx => ty => tz => ap(ap(map(f) (tx)) (ty)) (tz);


// API


module.exports = {lifta2, lifta3};