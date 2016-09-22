const flatten = require("../array/narmalization/flatten");
const map = require("../array/transformation/map");

class List extends Array {}

module.exports = const array = {
  of: x => List.of(x),

  empty: () => List.of();

  map: map,

  ap: ftor => gtor => array.flatten(
    array.map(f => array.map(f) (gtor)) (ftor)
  ),

  flatten: flatten,

  chain: mf => ftor => array.flatten(array.map(mf) (ftor))
};