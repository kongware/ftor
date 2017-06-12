"use strict";


// dependencies


const {$tag, $Option} = require("../interop");
const {compare} = require("../primitive/compare");
const {compareBy} = require("../compareBy");
const EQ = require("../primitive/EQ");
const LT = require("../primitive/LT");
const GT = require("../primitive/GT");


/**
 * @name Option
 * @note Church encoded
 * @type sum type
 * @status stable
 */


const Option = {};


// CONSTRUCTORS


/**
 * @name Some
 * @type constructor
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const I = x => x;

  Some(5) (null) (I); // 5

 */


// forall r . a -> r -> (a -> r) -> r
const Some = x => {
  const Some = r => {
    const Some = f => f(x);
    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  return Some[$tag] = "Some", Some[$Option] = true, Some;
};

Option.Some = Some;


/**
 * @name None
 * @type constructor
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  const I = x => x;

  None(null) (I); // null

 */


// r -> (a -> r) -> r
const None = r => {
  const None = f => r;
  return None[$tag] = "None", None[$Option] = true, None;
};

None[$tag] = "None";
None[$Option] = true;
Option.None = None;


// SETOID


/**
 * @name equal
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  Option.eq = tx => ty => tx[$Option] && ty[$Option] && tx(ty(true) (_ => false)) (x => ty(false) (y => x === y));
  const I = x => x;

  Option.eq(Some("foo")) (Some("foo")); // true
  Option.eq(Some("foo")) (Some("bar")); // false
  Option.eq(Some("foo")) (None); // false
  Option.eq(None) (None); // true

 */


// Setoid a => Option a -> Option a -> Boolean
Option.eq = tx => ty => tx[$Option] && ty[$Option] && tx(ty(true) (_ => false)) (x => ty(false) (y => x === y));


/**
 * @name not equal
 * @type higher order function
 * @status stable
 * @example

  @see Option.eq

 */


// Setoid a => Option a -> Option a -> Boolean
Option.neq = tx => ty => tx[$Option] && ty[$Option] && tx(ty(false) (_ => true)) (x => ty(true) (y => x !== y));


/**
 * @name equal by
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  Option.eqBy = eq => tx => ty => tx[$Option] && ty[$Option] && tx(ty(true) (_ => false)) (x => ty(false) (y => eq(x) (y)));
  const eqId = o => p => o.id === p.id;
  const I = x => x;

  Option.eqBy(eqId) (Some({id: "foo"})) (Some({id: "foo"})); // true
  Option.eqBy(eqId) (Some({id: "foo"})) (Some({id: "bar"})); // false
  Option.eqBy(eqId) (Some({id: "foo"})) (None); // false
  Option.eqBy(eqId) (None) (None); // true

 */


// Setoid a => (a -> a -> Boolean) -> Option a -> Option a -> Boolean
Option.eqBy = eq => tx => ty => tx[$Option] && ty[$Option] && tx(ty(true) (_ => false)) (x => ty(false) (y => eq(x) (y)));


/**
 * @name not equal by
 * @type higher order function
 * @status stable
 * @example

  @see Option.eqBy

 */


// Setoid a => (a -> a -> Boolean) -> Option a -> Option a -> Boolean
Option.neqBy = neq => tx => ty => tx[$Option] && ty[$Option] && tx(ty(false) (_ => true)) (x => ty(true) (y => neq(x) (y)));


// ORD


/**
 * @name compare
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  Option.compare = tx => ty => tx[$Option] && ty[$Option] && tx(ty(EQ) (_ => LT)) (x => ty(GT) (y => compare(x) (y)));
  const compare = x => y => x < y ? LT : y < x ? GT : EQ;

  const LT = -1;
  const EQ = 0;
  const GT = 1;

  Option.compare(Some(2)) (Some(3)); // LT
  Option.compare(Some(3)) (Some(2)); // GT
  Option.compare(Some(2)) (Some(2)); // EQ
  Option.compare(Some(2)) (None); // GT
  Option.compare(None) (None); // EQ

 */


// (Ord a, Number ordering) => Option a -> Option a -> ordering
Option.compare = tx => ty => tx[$Option] && ty[$Option] && tx(ty(EQ) (_ => LT)) (x => ty(GT) (y => compare(x) (y)));


// (Ord a, Number ordering) => Option a -> Option a -> ordering
Option.compare_ = ty => tx => tx[$Option] && ty[$Option] && tx(ty(EQ) (_ => LT)) (x => ty(GT) (y => compare(x) (y)));


/**
 * @name compare by
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  Option.compareBy = compare => tx => ty => tx[$Option] && ty[$Option] && tx(ty(EQ) (_ => LT)) (x => ty(GT) (y => compare(x) (y)));
  const comparek = k => o => p => o[k] < p[k] ? LT : p[k] < o[k] ? GT : EQ;

  const LT = -1;
  const EQ = 0;
  const GT = 1;

  const o = {id: 2}, p = {id: 3}, q = {id: 2};

  Option.compareBy(comparek("id")) (Some(o)) (Some(p)); // LT
  Option.compareBy(comparek("id")) (Some(p)) (Some(o)); // GT
  Option.compareBy(comparek("id")) (Some(o)) (Some(q)); // EQ
  Option.compareBy(comparek("id")) (Some(o)) (None); // GT
  Option.compareBy(comparek("id")) (None) (None); // EQ

 */


// (Ord a, Number ordering) => (a -> a -> Boolean) -> Option a -> Option a -> ordering
Option.compareBy = compare => tx => ty => tx[$Option] && ty[$Option] && tx(ty(EQ) (_ => LT)) (x => ty(GT) (y => compare(x) (y)));


// (Ord a, Number ordering) => (a -> a -> Boolean) -> Option a -> Option a -> ordering
Option.compareBy_ = compare => ty => tx => tx[$Option] && ty[$Option] && tx(ty(EQ) (_ => LT)) (x => ty(GT) (y => compare(x) (y)));


/**
 * @name lower than
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// Ord a => Option a -> Option a -> Boolean
Option.lt = tx => ty => tx[$Option] && ty[$Option] && tx(ty(false) (_ => true)) (x => ty(false) (y => x < y));


/**
 * @name lower than or equal
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// Ord a => Option a -> Option a -> Boolean
Option.lte = tx => ty => tx[$Option] && ty[$Option] && tx(ty(true) (_ => true)) (x => ty(false) (y => x <= y));


/**
 * @name greater than
 * @type higher order function
 * @status stable
 * @example

  @see Option.lt

 */


// Ord a => Option a -> Option a -> Boolean
Option.gt = tx => ty => tx[$Option] && ty[$Option] && tx(ty(false) (_ => false)) (x => ty(true) (y => x > y));


/**
 * @name greater than or equal
 * @type higher order function
 * @status stable
 * @example

  @see Option.lte

 */


// Ord a => Option a -> Option a -> Boolean
Option.gte = tx => ty => tx[$Option] && ty[$Option] && tx(ty(true) (_ => false)) (x => ty(true) (y => x >= y));


/**
 * @name minimum
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// Ord a => Option a -> Option a -> Option a
Option.min = tx => ty => tx[$Option] && ty[$Option] && tx(ty(tx) (_ => tx)) (x => ty(ty) (y => x < y ? tx : ty));


/**
 * @name minimum by
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// Ord a => (a -> a -> Boolean) -> Option a -> Option a -> Option a
Option.minBy = min => tx => ty => tx[$Option] && ty[$Option] && tx(ty(tx) (_ => tx)) (x => ty(ty) (y => min(x) (y) ? tx : ty));


/**
 * @name maximum
 * @type higher order function
 * @status stable
 * @example

  @see Option.min

 */


// Ord a => Option a -> Option a -> Option a
Option.max = tx => ty => tx[$Option] && ty[$Option] && tx(ty(tx) (_ => ty)) (x => ty(tx) (y => x > y ? tx : ty));


/**
 * @name maximum by
 * @type higher order function
 * @status stable
 * @example

  @see Option.minBy

 */


// Ord a => (a -> a -> Boolean) -> Option a -> Option a -> Option a
Option.maxBy = max => tx => ty => tx[$Option] && ty[$Option] && tx(ty(tx) (_ => ty)) (x => ty(tx) (y => max(x) (y) ? tx : ty));


// SEMIGROUP


/**
 * @name append
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// Monoid a => Option a -> Option a -> Option a
Option.append = tx => ty => tx[$Option] && ty[$Option] && tx(ty(None) (_ => ty)) (x => ty(y => x + y));


/**
 * @name prepend
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// Monoid a => Option a -> Option a -> Option a
Option.prepend = ty => tx => tx[$Option] && ty[$Option] && tx(ty(None) (_ => ty)) (x => ty(y => x + y));


/**
 * @name append by
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// Monoid a => (a -> a -> a) -> Option a -> Option a -> Option a
Option.appendBy = append => tx => ty => tx[$Option] && ty[$Option] && tx(ty(None) (_ => ty)) (x => ty(y => append(x) (y)));


/**
 * @name prepend by
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// Monoid a => (a -> a -> a) -> Option a -> Option a -> Option a
Option.prependBy = prepend => ty => tx => tx[$Option] && ty[$Option] && tx(ty(None) (_ => ty)) (x => ty(y => prepend(x) (y)));


// MONOID


/**
 * @name empty
 * @type first order function
 * @status stable
 * @example

  @see None

 */


// a -> Option a
Option.empty = None;


/**
 * @name concat
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// Monoid a => [Option a] -> Option a
Option.concat = (append, empty) => xs => Some(xs.reduce((acc, tx) => append(acc) (tx), empty));


/**
 * @name concat by
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// (Foldable t, Monoid a) => t (Option a) -> Option a
Option.concatBy = (fold, append, empty) => tx => Some(fold(append) (empty) (tx));


// FOLDABLE


/**
 * @name fold left
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  Option.foldl = f => acc => tx => tx[$Option] && tx(acc) (x => f(acc) (x));
  const add = x => y => x + y;
  const I = x => x;

  Option.fold(add) (2) (Some(3)); // 5
  Option.fold(add) (2) (None); // 2

 */


// (b -> a -> b) -> b -> Option a -> b
Option.foldl = f => acc => tx => tx[$Option] && tx(acc) (x => f(acc) (x));


Option.foldr = f => acc => tx => tx[$Option] && tx(acc) (x => f(x) (acc);


Option.foldMap = empty => f => tx => tx[$Either] && tx(_ => empty) (x => f(x));


/**
 * @name length
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  Option.len = tx => tx(0) (_ => 1);

  Option.len(Some("foo")); // 1
  Option.len(None); // 0

 */


// Option a -> Number
Option.len = tx => tx(0) (_ => 1);


/**
 * @name to list
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  Option.toList = tx => tx([]) (x => [x]);

  Option.toList(Some("foo")); // ["foo"]
  Option.toList(None); // []

 */


// Option a -> [a]
Option.toList = tx => tx([]) (x => [x]);


Option.null = tx => tx(true) (_ => false);


Option.has = x => tx => tx(false) (y => x === y);


// TRAVERSABLE


/**
 * @name traverse
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  Option.traverse = (of, map) => ft => tx => tx[$Option] && tx(of(None)) (x => map(Some) (ft(x)));
  const I = x => x;

  const map = f => xs => xs.map(f);
  const of = x => [x];

  Option.traverse(of, map) (sqr = x => [x * x]) (Some(5)) [0] (0) (I); // 25
  Option.traverse(of, map) (sqr = x => [x * x]) (None) [0] (0) (I); // 0

 */


// Applicative f => (a -> f b) -> Option a -> f (Option b)
Option.traverse = (of, map) => ft => tx => tx[$Option] && tx(of(None)) (x => map(Some) (ft(x)));


/**
 * @name sequence
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  Option.sequence = (of, chain) => tx => tx(of(None)) (ty => chain(ty) (y => of(Some(y))));
  const I = x => x;

  const chain = tx => ft => tx.map(x => join(ft(x)));
  const join = ttx => ttx[0];
  const of = x => [x];

  Option.sequence(of, chain) (Some([1, 2, 3])); [Some(1), Some(2), Some(3)]
  Option.sequence(of, chain) (None); // [None]

 */


// Monad m => Option (m a) -> m (Option a)
//Option.sequence = (of, chain) => tx => tx[$Option] && tx(of(None)) (ty => chain(ty) (y => of(Some(y))));
// TODO: replace with sequenceA

// FUNCTOR


/**
 * @name map
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  Option.map = f => tx => tx[$Option] && tx(None) (x => Some(f(x)));
  const sqr = x => x * x;
  const I = x => x;

  Option.map(sqr) (Some(5)) (0) (I); // 25
  Option.map(sqr) (None) (0) (I); // 0

 */


// (a -> b) -> Option a -> Option b
Option.map = f => tx => tx[$Option] && tx(None) (x => Some(f(x)));


// APPLY


/**
 * @name apply
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  Option.map = f => tx => tx[$Option] && tx(None) (x => Some(f(x)));
  Option.ap = tf => tx => tf[$Option] && tx[$Option] && tf(None) (f => tx(None) (x => Some(f(x))));

  const add = x => y => x + y;
  const I = x => x;

  Option.ap(Option.map(add) (Some(2))) (Some(3)) (0) (I); // 5
  Option.ap(Option.map(add) (None)) (Some(3)) (0) (I); // 0
  Option.ap(Option.map(add) (Some(2))) (None) (0) (I); // 0

 */


// Option (a -> b) -> Option a -> Option b
Option.ap = tf => tx => tf[$Option] && tx[$Option] && tf(None) (f => tx(None) (x => Some(f(x))));


// APPLICATIVE


/**
 * @name of
 * @type first order function
 * @status stable
 * @example

   @see Some

 */


// a -> Option a
Option.of = Some;


// MONAD


/**
 * @name join
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;
  
  Option.join = ttx => ttx[$Option] && ttx(None) (tx => tx[$Option] && tx);

  Option.join(Some(Some(2))); // Some(2)
  Option.join(Some(None)); // None
  Option.join(None); // None

 */


// Option (Option a) -> Option a
Option.join = ttx => ttx[$Option] && ttx(None) (tx => tx[$Option] && tx);


/**
 * @name chain
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  Option.map = f => tx => tx[$Option] && tx(None) (x => Some(f(x)));

  Option.chain = tx => ft => tx[$Option] && tx(None) (x => {
    const r = ft(x);
    return r[$Option] && r;
  });

  const sqr = x => Some(x * x);

  const I = x => x;

  Option.chain(Some(5)) (sqr) (0) (I); // 25
  Option.chain(None) (sqr) (0) (I); // 0

 */


// Option a -> (a -> Option b) -> Option b
Option.chain = tx => ft => tx[$Option] && tx(None) (x => {
  const r = ft(x);
  return r[$Option] && r;
});


// ALT


/**
 * @name alt
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  Option.alt = tx => ty => tx(ty) (_ => tx);
  const I = x => x;

  Option.alt(None) (Some(2)) (0) (I); // 2
  Option.alt(Some(1)) (None) (0) (I); // 1
  Option.alt(Some(1)) (Some(2)) (0) (I); // 1
  Option.alt(None) (None) (0) (I); // 0

 */


Option.alt = tx => ty => tx(ty) (_ => tx);


// PLUS


/**
 * @name zero
 * @type first order function
 * @status stable
 * @example

   @see None

 */


// Option a
Option.zero = None;


// SPECIFIC


/**
 * @name isSome
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  Option.isSome = tx => tx[$tag] === "Some";

  Option.isSome(Some(2)); // true
  Option.isSome(None); // false

 */


// Option a -> Boolean
Option.isSome = tx => tx[$tag] === "Some";


/**
 * @name isNone
 * @type higher order function
 * @status stable
 * @example

  @see Option.isSome
  
 */ 


// Option a -> Boolean
Option.isNone = tx => tx[$tag] === "None";


/**
 * @name filter
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  Option.filter = pred => tx => tx(None) (x => pred(x) ? Some(x) : None);
  const even = x => Math.floor(x) === x && (x & 1) === 0;
  const I = x => x;

  Option.filter(even) (Some(2)) (0) (I); // Some(2)
  Option.filter(even) (Some(1)) (0) (I); // None
  Option.filter(even) (None) (0) (I); // None

 */


// (a -> Boolean) -> Option a -> Option a
Option.filter = pred => tx => tx(None) (x => pred(x) ? Some(x) : None);


/**
 * @name fromOption
 * @note semantic sugar (see constructors)
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  Option.fromOption = x => tx => tx(x) (y => y);

  Option.fromOption(0) (Some(2)); // 2
  Option.fromOption(0) (None); // 0

 */ 


// a -> Option a -> a
Option.fromOption = x => tx => tx(x) (y => y);


/**
 * @name cat some
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  Option.catSome = xs => xs.reduce((acc, tx) => tx(acc) (x => acc.concat([x])), []);

  Option.catSome([Some("foo"), None, Some("bar")]); // ["foo", "bar"]

 */


// [Option a] -> [a]
Option.catSome = xs => xs.reduce((acc, tx) => tx(acc) (x => acc.concat([x])), []);


/**
 * @name map some
 * @type higher order function
 * @status stable
 * @example

  const $tag = Symbol.for("ftor/tag");
  const $Option = Symbol.for("ftor/Option");
  const Option = {};

  const Some = x => {
    const Some = r => {
      const Some = f => f(x);
      return Some[$tag] = "Some", Some[$Option] = true, Some;
    };

    return Some[$tag] = "Some", Some[$Option] = true, Some;
  };

  const None = r => {
    const None = f => r;
    return None[$tag] = "None", None[$Option] = true, None;
  };

  None[$tag] = "None";
  None[$Option] = true;

  Option.mapSome = f => xs => xs.reduce((acc, tx) => tx(acc) (x => acc.concat([f(x)])), []);
  const toUpper = x => x.toUpperCase();

  Option.mapSome(toUpper) ([Some("foo"), None, Some("bar")]); // ["FOO", "BAR"]

 */


// (Foldable t, Monoid t) => t (Option a) -> t a
Option.mapSome = f => xs => xs.reduce((acc, tx) => tx(acc) (x => acc.concat([f(x)])), []);


// API


module.exports = {Option, Some, None};