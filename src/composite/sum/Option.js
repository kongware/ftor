const factory = require("./factory");
const I = require("../../polymorphic/primitive/I");
const K = require("../../polymorphic/primitive/K");
const notf2 = require("../../polymorphic/negation/notf2");
const take = require("../product/object/array/subarray/take");
const {$tag} = require("../../interop/symbols");

module.exports = Option = {

  /*** setup ***/

  some: Symbol.for("ftor/Option.some"),

  none: Symbol.for("ftor/Option.none"),



  /*** foldable ***/

  // cata :: Object -> Option a -> a

  cata: o => X => o[X[$tag]](...take(1) (X)),

  // fold :: (a -> b) -> (() -> Option) -> Option a -> b

  fold: f => g => X => Option.cata({[Option.some]: f, [Option.none]: g}) (X),



  /*** setoid ***/

  // equals :: Setoid a => Object -> Option a -> Option a -> Boolean

  equals: TypeA => X => Y => Option.fold(x => Option.fold(y => TypeA.eq(y) (x)) (false) (Y)) (K(false)) (X),



  /*** ord ***/

  // compare :: Ord a => Object -> Option a -> Option a -> Order

  compare: TypeA => X => Y => Option.fold(x => Option.fold(y => TypeA.compare(y) (x)) (K(EQ)) (Y)) (K(EQ)) (X),

  // lt :: Ord a => Object -> Option a -> Option a -> Boolean

  lt: TypeA => X => Y => Option.fold(x => Option.fold(y => TypeA.lt(y) (x)) (K(false)) (Y)) (K(false)) (X),

  // gt :: Ord a => Object -> Option a -> Option a -> Boolean

  gt: TypeA => X => Y => Option.fold(x => Option.fold(y => TypeA.gt(y) (x)) (K(false)) (Y)) (K(false)) (X),

  // lte :: Ord a => Object -> Option a -> Option a -> Boolean

  lte: TypeA => notf2(Option.gt),

  // gte :: Ord a => Object -> Option a -> Option a -> Boolean

  gte: TypeA => notf2(Option.lt),

  // min :: Ord a => Object -> Option a -> Option a -> Option a

  min: TypeA => X => Y => Option.fold(x => Option.fold(y => factory(Option.some) (TypeA.min(y) (x))) (K(false)) (Y)) (K(false)) (X),

  // max :: Ord a => Object -> Option a -> Option a -> Option a

  max: TypeA => X => Y => Option.fold(x => Option.fold(y => factory(Option.some) (TypeA.max(y) (x))) (K(false)) (Y)) (K(false)) (X),



  /*** semigroup ***/

  // concat :: Monoid a => Object -> Option a -> Option a -> Option a

  concat: TypeA => X => Y => Option.fold(x => Option.fold(y => TypeA.concat(y) (x)) (K(Option.empty())) (Y)) (K(Option.empty())) (X),



  /*** monoid ***/

  // empty :: () -> Option a

  empty: () => factory(Option.none) (),



  /*** functor ***/

  // map :: (a -> b) -> Option a -> Option b

  map: f => X => Option.fold(x => factory(Option.some) (f(x))) (K(Option.empty())) (X),



  /*** apply ***/

  // ap :: Option (a -> b) -> Option a -> Option b

  ap: X => Y => Option.fold(f => Option.fold(x => Option.of(f(x))) (K(Option.empty())) (Y)) (K(Option.empty())) (X),

  // fst :: Option a -> Option b -> Option a

  fst: X => Y => Option.fold(() => Option.fold(() => X) (K(Option.empty())) (Y)) (K(Option.empty())) (X)

  // snd :: Option a -> Option b -> Option b

  snd: X => Y => Option.fold(() => Option.fold(() => Y) (K(Option.empty())) (Y)) (K(Option.empty())) (X)



  /*** applicative ***/

  // of :: a -> Option a

  of: x => factory(Option.some) (x),



  /*** monad ***/

  // flatten :: Option (Option a) -> Option a

  flatten: X => X[0],

  // chain :: (a -> Option b) -> Option a -> Option b

  chain: fX => X => Option.flatten(Option.map(fX) (X)),



  /*** traversable ***/

  // traverse :: Applicative f => Object -> (a -> f b) -> Option a -> f (Option b)

  traverse: TypeF => fX => X => Option.fold(x => TypeF.map(Option.of) (fX(x))) (K(TypeF.of(Option.empty()))) (X),

  // sequence :: Applicative f => Option (f a) -> f (Option a)

  sequence: TypeF => X => Option.traverse(TypeF) (I) (X),



  /*** serializing ***/

  // toString :: Option a -> String

  toString: X => Option.fold(x => "(ftor) Option.Some(" + x + ")") (() => "(ftor) Option.None") (X),

  // toJSON :: Option a -> Object

  toJSON: X => Option.fold(x => ({"#type": "ftor:Option.Some", value: x})) (() => ({"#type": "ftor:Option.None"})) (X),



  /*** specific ***/

  // getOrElse :: a -> Option a -> a

  getOrElse: x => X => Option.fold(I) (K(x)) (X),

  // orElse :: Option a -> Option a -> Option a

  orElse: X => Y => Option.fold(Option.of) (Option.fold(Option.of) (Option.empty) (Y)) (X),

  // maybe :: b -> (a -> b) -> Option a -> b

  option: x => f => X => Option.fold(x => f(x)) (K(x)) (X),

  // toArray :: Option a -> Array a

  toArray: X => Option.fold(x => [x]) (K([])) (X)
};



/*** examples ***/

/*** fold

const x = factory(Option.some) (2);
const y = factory(Option.none) ();

const inc = t => Option.fold(x => x + 1) (() => 0) (t);

console.log( inc(x) ); // 3
console.log( inc(y) ); // 0

***/

/*** map

const x = factory(Option.some) (2);
const y = factory(Option.none) ();

const inc = x => x + 1;

console.log( Option.map(inc) (x) ); // [3]
console.log( Option.map(inc) (y) ); // []

***/