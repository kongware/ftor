"use strict";


/**
 * @name match
 * @note pattern matching
 * @type higher order function
 * @status experimental
 * @example

  ?

 */


// ([a -> b]) -> ([b -> c]) -> a -> c
const match = (...patterns) => (...cons) => x => {
  const aux = (r, i) => r !== null ? cons[i](r)
   : i + 1 in patterns ? aux(patterns[i + 1](x), i + 1)
   : null;

  return aux(patterns[0](x), 0);
};


// ([a -> b -> c]) -> ([c -> d]) -> a -> b -> d
const match2 = (...patterns) => (...cons) => x => y => {
  const aux = (r, i) => r !== null ? cons[i](r)
   : i + 1 in patterns ? aux(patterns[i + 1](x) (y), i + 1)
   : null;

  return aux(patterns[0](x), 0);
};


// ([a -> b -> c -> d]) -> ([d -> e]) -> a -> b -> c -> e
const match3 = (...patterns) => (...cons) => x => y => z => {
  const aux = (r, i) => r !== null ? cons[i](r)
   : i + 1 in patterns ? aux(patterns[i + 1](x) (y) (z), i + 1)
   : null;

  return aux(patterns[0](x), 0);
};


// API


module.exports = {match, match2, match3};