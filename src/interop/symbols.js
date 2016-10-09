const generics = {
  $ap: Symbol.for("ftor/ap"),
  $cata: Symbol.for("ftor/cata"),
  $compare: Symbol.for("ftor/compare"),
  $chain: Symbol.for("ftor/chain"),
  $concat: Symbol.for("ftor/concat"),
  $empty: Symbol.for("ftor/empty"),
  $equals: Symbol.for("ftor/equals"),
  $flatten: Symbol.for("ftor/flatten"),
  $gt: Symbol.for("ftor/gt"),
  $gte: Symbol.for("ftor/gte"),
  $lt: Symbol.for("ftor/lt"),
  $lte: Symbol.for("ftor/lte"),
  $map: Symbol.for("ftor/map"),
  $max: Symbol.for("ftor/min"),
  $min: Symbol.for("ftor/max"),
  $of: Symbol.for("ftor/of"),
  $sequence: Symbol.for("ftor/sequence"),
  $tag: Symbol.for("ftor/tag"),
  $traverse: Symbol.for("ftor/traverse"),
  $a: Symbol.for("ftor/a")
};

const tags = {
  none: Symbol.for("ftor/none"),
  some: Symbol.for("ftor/some")
};

module.exports = Object.assign({}, generics, tags);