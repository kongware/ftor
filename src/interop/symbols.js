const generics = {
  $ap: Symbol.for("ftor/ap"),
  $cata: Symbol.for("ftor/cata"),
  $compare: Symbol.for("ftor/compare"),
  $chain: Symbol.for("ftor/chain"),
  $concat: Symbol.for("ftor/concat"),
  $empty: Symbol.for("ftor/empty"),
  $equals: Symbol.for("ftor/equals"),
  $flatten: Symbol.for("ftor/flatten"),
  $foldl: Symbol.for("ftor/foldl"),
  $foldl1: Symbol.for("ftor/foldl1"),
  $foldlk: Symbol.for("ftor/foldlk"),
  $foldr: Symbol.for("ftor/foldr"),
  $foldr1: Symbol.for("ftor/foldr1"),
  $foldrk: Symbol.for("ftor/foldrk"),
  $gt: Symbol.for("ftor/gt"),
  $gte: Symbol.for("ftor/gte"),
  $lt: Symbol.for("ftor/lt"),
  $lte: Symbol.for("ftor/lte"),
  $map: Symbol.for("ftor/map"),
  $max: Symbol.for("ftor/max"),
  $maxBound: Symbol.for("ftor/maxBound"),
  $min: Symbol.for("ftor/min"),
  $minBound: Symbol.for("ftor/minBound"),
  $of: Symbol.for("ftor/of"),
  $sequence: Symbol.for("ftor/sequence"),
  $tag: Symbol.for("ftor/tag"),
  $toJSON: Symbol.for("ftor/toJSON"),
  $toString: Symbol.for("ftor/toString"),
  $traverse: Symbol.for("ftor/traverse"),
  $x: Symbol.for("ftor/x")
};

const uncurried_generics = {
  $_concat: Symbol.for("ftor/_concat"),
  $_equals: Symbol.for("ftor/_equals"),
  $_gt: Symbol.for("ftor/_gt"),
  $_gte: Symbol.for("ftor/_gte"),
  $_lt: Symbol.for("ftor/_lt"),
  $_lte: Symbol.for("ftor/_lte"),
  $_map: Symbol.for("ftor/_map"),
  $_max: Symbol.for("ftor/_max"),
  $_min: Symbol.for("ftor/_min"),
}

const tags = {
  none: Symbol.for("ftor/none"),
  some: Symbol.for("ftor/some")
};

module.exports = Object.assign({}, generics, uncurried_generics, tags); 