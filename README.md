ftor
====

<img src="https://i.stack.imgur.com/UqCPm.png?s=328&g=1" width="164" height="164" alt="ftor">

An idiomatic, non-dogmatic lazy lib that facilitates the functional paradigm in Javascript.

## Status

This library is experimental and still work in progress.

## Mission

ftor's mission is to convince devs to

* embrace the mighty expressiveness of pure functions
* avoid magic and false simplicity
* reject micro optimizations and performance as an end in itself
* reify effects into first class values
* model data by disjunctions instead of conjunctions
* consider point free as a side effect of declarative programming
* follow algebraic laws, instead of just make stuff up

Regain hope all ye who enter here.

## Criteria

The lib highly depends on:

* pure first and higher order functions
* parametric polymorphic algebraic data types
* ad hoc polymorphism and type classes
* currying and partial application
* function composition and combinatorics
* recursive iteration
* immutable data structures
* DRY, SRP and the principle of least astonishment

## Terminology

* composable function: A function that is partially applicable in its last argument
* operator function: A first order function, i.e. a function that neither expects nor returns a function
* type representative: A plain old Javascript object that contains static methods and forms a type class (e.g. Functor)

## Currying

Operator Functions are offered in curried and uncurried form:

```Javascript
const add = y => x => x + y; // curried form
const add_ = (x, y) => x + y; // uncurried form
```
As you can see the arguments of the curried form are flipped, because this is their natural argument order.

Higher order functions are offered in three variants:

* in curried form
* in composable form, where the passed function is in curried form
* in composable form, where the passed function is in uncurried form

```Javascript
const B2 = f => g => x => y => f(g(x, y)); // curried function
const B2_ = (f, g, x) => y => f(g(x) (y)); // composable function that expects a curried operator function
const B2__ = (f, g, x) => y => f(g(x, y)); // composable function that expects an uncurried operator function
```
As you can see there is a strict naming convention. See more in the naming section. All function variants are bundled in a single module, that is, you can require only the variants you desire.

## Primitive combinators

There are a couple of primitive combinators named with a single upper case letter. This naming is chosen because they behave like operators and as with operator syntax you have to memorize them:

* A (apply)
* B (composition)
* D (binary composition)
* I (identity)
* K (constant)
* T (reverse application)
* U (recursion)

## Records

Javascript's `Object` data type is highly flawed:

* `this` encourages devs to mix data and logic
* getters silently return `undefined` for not existing properties
* it can contain `null`/`undefined`
* it is a mutable data type

`Object`s are designed to be used for everything but cannot do anything right. For this reason ftor treats `Object`s as records. A record is immutable, avoids `this` and throws a `TypeError` when accessing non-existing properties, that is, it solves most of the issues and thus is much safer. Since we don't want to lose object literal syntax and destructuring assignment ftor's records are still plain old Javascript `Object`s - with a policy though.

If you need subtyping use sum types (tagged unions). If you need modularity use ES2015 modules. If you need something to iterate over, use a collection like `Array`. If you need a composite type of related data without named fields, use tuples. Otherwise use records.

## Tuples

Javascripts doesn't support a tuple data type, but a tuple syntax along with multi argument functions. ftor recognizes this quirk and introduces a church encoded tuple type that represents a real tuple data type and beyond that, facilitates working with multi argument functions.

## Type representatives

ftor doesn't rely on the prototype system but on type representatives, which have to be passed around explicitly. Type representative is just a fancy word for a static type dictionary, i.e. a plain old Javascript `Object` with a couple of static methods attached:

```Javascript
// functor type representative of the function instance

const Fun = {
  map: f => g => x => f(g(x))
};
```

While type representatives lead to somewhat verbose code on the calling side, they also improve readability, since you can see the used types in place explicitly . With type representatives we are able to

* mitigate Javascript's lack of type inference
* extend built-ins (object and primitive types) without touching them at all
* define several type classes for each data type

## New data types

ftor introduces the following data types:

* Cont (tagged union)
* Const (?)
* Either (tagged union)
* Ident (?)
* Option (tagged union)
* Ordering (tagged union)
* Tuple (Church encoded)
* to be continued...

Church encoded means that a type is represented solely by higher order functions.

## Type classes

The following type classes are offered:

* Applicative
* Bounded
* Enum
* Eq (Semigroup)
* Functor
* Monad
* Monoid
* Ord
* Traversable
* to be continued...

## Naming Convention

* use `v, w, x, y, z` for generic variables of any type
* use `vs, ws, xs, ys, zs` for generic collections
* use `o, p, q, r, s` for generic object types
* use `f, g, h, i, j` for generic functions
* use `t1, t2, t3` for values wrapped in a context, where `t` may be replaced with the initial letter of the type class (e.g. `f` for `Functor` or `m` for `Monad`)
* use `Rep1, Rep2, Rep3` to define a type representative (type dictionary)
* `name_` indicates an operator function in uncurried form
* `name_` indicates a higher order function in composable form, which applies the given operator functions procedurally with one argument per call
* `name__` indicates a higher order function in composable form, which applies the given operator function(s) with a single call with multiple arguments
* `_name` distinguishes either a slightly different variant of an existing function or avoids naming conflicts with reserved keywords or allows names with leading numbers
* `$name` represents a strictly (or greedy) evaluated version of a function

Functional programming doesn't mean to always use generalized names like `x` or `f`. Use speaking names for specific functions/variables and generic names for generic ones. However, names are a good indicator of how generalized your functions are.

## How to properly require

ftor strongly relies on the one function per module paradigm. However, some functions belong together semantically because, for example, they form a type class. Such functions ought to be grouped in a type representative when imported, which also helps to avoid naming conflicts:

```Javascript
  const _Function = {}; // "on demand" type representative
  
  _Function.map = require("./comp").comp; // _Function implements the Functor type class
  _Function.ap = require("./ap").ap;
  _Function.of = require("./K"); // _Function implements the Applicative type class
  _Function.chain = require("./chain").chain; // _Function implements the Monad type class
  
  // or with destructuring assignment
  
  ({map: _Function.map} = require("./comp"));
  ({ap: _Function.ap} = require("./ap"));
  ({of: _Function.of} = require("./K"));
  ({chain: _Function.chain} = require("./chain"));
```

## Type signatures

To meet Javascript's dynamic type system ftor uses extended type signatures:

* `[*]` represents a list of various types (e.g. `[1, "a", true]`)
* `(*)` represents the rest syntax `...` in argument lists (e.g. `(*) -> [*]`)
* `|` represents a conjunction (e.g. `(a -> b) -> a -> b|null`)

## Todos

- [ ] rename notf to notBy
- [ ] add immutability and lenses to readme
- [ ] add nameBy naming convetion to readme
- [ ] provide missing code examples
- [ ] reconsider right to left pipe hof
- [ ] add a trace function
- [ ] fold with monoids is called mconcat
- [ ] examine natural transformations, hom functor and f-algebra
- [ ] fold Objects without intermediate (generator i/o Object.keys(Object.values)
- [ ] replace uncurried versions with (...args)
- [ ] introduce continuation functor as compk
- [ ] check out CPS aux functions
- [ ] introduce on as wrapper of addEventListener
- [ ] check out event stream aux functions
- [ ] introduce new typeclasses
- [ ] introduce enum type
- [ ] introduce sum types
- [ ] examine monadic traverse
- [ ] examine kleisli composition
- [ ] introduce Haskell's scan
- [ ] examine co-recursion/unfold
- [ ] examine tree un-/serilization
- [ ] introduce common transducers
- [ ] introduce group/groupBy
- [ ] review functional comparators/comparator modifier
- [ ] look into functional lenses
- [ ] look into both/eitherOr/guarded functions
- [ ] are clojure's multimethods a good idea?
- [ ] examine monotonic array
- [ ] add object comparison
- [ ] traverse unknown object (tree)
- [ ] object left/right difference + intersection
- [ ] examine bimap
- [ ] examine functional value object
- [ ] introduce unzip
- [ ] introduce Enum type
- [ ] explore finger trees/sequences and tries
- [ ] Tuple has not foldable