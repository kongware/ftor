"use strict";


// dependencies


const {$tag, $Option} = require("../interop");


/**
 * @name Option
 * @note Church encoded
 * @type sum type
 * @status unstable
 */


const Option = {};


// constructors


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


// a -> r -> (a -> r) -> r
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


/**
 * @name empty
 * @type higher order function
 * @status stable
 * @example

   @see None

 */


// a -> Option a
Option.empty = None;


/**
 * @name fold
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

  Option.fold = f => acc => tx => tx[$Option] && tx(acc) (x => f(acc) (x));
  const add = x => y => x + y;
  const I = x => x;

  Option.fold(add) (2) (Some(3)); // 5
  Option.fold(add) (2) (None); // 2

 */


// (b -> a -> b) -> b -> Option a -> b
Option.fold = f => acc => tx => tx[$Option] && tx(acc) (x => f(acc) (x));


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
Option.sequence = (of, chain) => tx => tx(of(None)) (ty => chain(ty) (y => of(Some(y))));


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

  Option.alt = tx => ty => tx(ty) (() => tx);
  const I = x => x;

  Option.alt(None) (Some(2)) (0) (I); // 2
  Option.alt(Some(1)) (None) (0) (I); // 1
  Option.alt(Some(1)) (Some(2)) (0) (I); // 1
  Option.alt(None) (None) (0) (I); // 0

 */


Option.alt = tx => ty => tx(ty) (() => tx);


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


/**
 * @name of
 * @type higher order function
 * @status stable
 * @example

   @see Some

 */


// a -> Option a
Option.of = Some;


/**
 * @name ap
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


// API


module.exports = {Option, Some, None};