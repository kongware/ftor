const generics = {
  $ap: Symbol.for("ftor/ap"),
  $cata: Symbol.for("ftor/cata"),
  $compare: Symbol.for("ftor/compare"),
  $chain: Symbol.for("ftor/chain"),
  $concat: Symbol.for("ftor/concat"),
  $_concat: Symbol.for("ftor/_concat"),
  $empty: Symbol.for("ftor/empty"),
  $equals: Symbol.for("ftor/equals"),
  $flatten: Symbol.for("ftor/flatten"),
  $foldl: Symbol.for("ftor/foldl"),
  $foldr: Symbol.for("ftor/foldr"),
  $foldl_: Symbol.for("ftor/foldl_"),
  $foldr_: Symbol.for("ftor/foldr_"),
  $foldMap: Symbol.for("ftor/foldMap"),
  $foldMap_: Symbol.for("ftor/foldMap_"),
  $gt: Symbol.for("ftor/gt"),
  $_gt: Symbol.for("ftor/_gt"),
  $gte: Symbol.for("ftor/gte"),
  $_gte: Symbol.for("ftor/_gte"),
  $lt: Symbol.for("ftor/lt"),
  $_lt: Symbol.for("ftor/_lt"),
  $lte: Symbol.for("ftor/lte"),
  $_lte: Symbol.for("ftor/_lte"),
  $map: Symbol.for("ftor/map"),
  $max: Symbol.for("ftor/min"),
  $maxBound: Symbol.for("ftor/maxBound"),
  $min: Symbol.for("ftor/max"),
  $minBound: Symbol.for("ftor/minBound"),
  $of: Symbol.for("ftor/of"),
  $sequence: Symbol.for("ftor/sequence"),
  $tag: Symbol.for("ftor/tag"),
  $toJSON: Symbol.for("ftor/toJSON"),
  $toString: Symbol.for("ftor/toString"),
  $traverse: Symbol.for("ftor/traverse"),
  $x: Symbol.for("ftor/x")
};

const tags = {
  none: Symbol.for("ftor/none"),
  some: Symbol.for("ftor/some")
};

module.exports = Object.assign({}, generics, tags);