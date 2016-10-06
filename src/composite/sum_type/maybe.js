const flatten = require("..object/array/narmalization/flatten");

class Maybe extends Array {}

module.exports = const maybe = {
  of: x => Maybe.of(x),

  empty: () => Maybe.of(),

  map: f => ftor => 0 in ftor ? maybe.of(f(ftor[0])) : maybe.empty(),

  ap: ftor => gtor => maybe.flatten(
    maybe.map(f => maybe.map(f) (gtor)) (ftor)
  ),

  chain: mf => ftor => maybe.flatten(maybe.map(mf) (ftor)),

  flatten: flatten,

  T: M => {
    return {
      of: x => M.of(maybe.of(x)),

      empty: () => M.empty(maybe.empty()),

      map: f => ftor => M.map(gtor => maybe.map(f) (gtor)) (ftor),

      ap: ftor => gtor => M.flatten(
        M.map(htor => M.map(itor => maybe.ap(htor) (itor)) (gtor)) (ftor)
      ),

      chain: mf => ftor => M.chain(gtor => maybe.chain(mf) (gtor)) (ftor),

      flatten: maybe.flatten,

      lift: maybe.of
    };
  }  
};