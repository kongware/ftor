const generics = {
  ap: Symbol.for("ftor/ap"),
  cata: Symbol.for("ftor/cata"),
  chain: Symbol.for("ftor/chain"),
  concat: Symbol.for("ftor/concat"),
  empty: Symbol.for("ftor/empty"),
  equals: Symbol.for("ftor/equals"),
  flatten: Symbol.for("ftor/flatten"),
  map: Symbol.for("ftor/map"),
  of: Symbol.for("ftor/of"),
  tag: Symbol.for("ftor/tag"),
  x: Symbol.for("ftor/x")
};

const tags = {
  none: Symbol.for("ftor/none"),
  some: Symbol.for("ftor/some")
};

module.exports = Object.assign({}, generics, tags);