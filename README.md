ftor
====

<img src="https://i.stack.imgur.com/UqCPm.png?s=328&g=1" width="164" height="164" alt="ftor">

An idiomatic, non-dogmatic lazy lib that facilitates the functional paradigm in Javascript.

## Status

This library is experimental and still work in progress.

## Principles

ftor's mission is to convince devs to

* shift state into call stacks
* make control flows explicit
* reify effects to first class values
* move effects to the edge of the application
* forgo magic and false simplicity
* turn away from micro optimizations
* consider disjunctions to model data
* stop fetishizing the dot operator
* follow algebraic laws, instead of just makeing stuff up

And the most important: Compose everything, always!

Regain hope all ye who enter here.

## Terminology

* composable function: A pure function that is partially applicable in its last argument
* operator function: A pure first order function, i.e. a function that neither expects nor returns a function type
* action: An impure (and frequently nullary) function that performs side effects
* type representative (type rep): A plain old Javascript object that contains static methods and forms a type class (e.g. Functor)

## Currying

All functions in ftor are in manually curried form. Currying leads to abstraction over arity in many cases and thus facilitates function composition and combinatorics.

## Primitive combinators

There are a couple of primitive combinators named with a single upper case letter. This naming is chosen because they behave like operators. Just memorize them and you'll soon appreciate their conciseness.

* A (apply)
* B (composition)
* C (flip arguments)
* D (binary composition)
* I (identity)
* K (constant)
* S (applicative lift)
* T (reverse application)
* U (recursion)

## Immutability

ftor opts for immutable data but doesn't enforce it with `Object.freeze` or `Object.seal`. Immutability in Javascript is just a policy and ftor provides various operations that comply with this policy.

One of these operations are functional lenses:

```Javascript
const Ident = {
  cons: x => ({type: Ident, x: x}),
  map: f => t => Ident.cons(f(t.x)),
  run: t => t.x
};

const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);

const mapBy = f => t => t.type.map(f) (t);

const key = k => f => o => mapBy(v => Object.assign({}, o, {[k]: v})) (f(o[k]));

const index = i => f => xs => mapBy(v => Object.assign([], xs, {[i]: v})) (f(xs[i]));

const map = lens => f => B_(run, lens(B_(cons, f)));

const o = {name: "Bob", addresses: [
  {street: "99 Maple", zip: 94004, type: "home"},
  {street: "77 Sunset", zip: 90069, type: "work"},
  {street: "1 Infinite Loop", zip: 95014, type: "life"},
], friends: [
  {name: "Zarah"},
  {name: "Kalib"}
]}

const _2ndStreetLens = B(key("addresses")) (B(index(1)) (key("street")));

const p = map(_2ndStreetLens) (x => x.toUpperCase()) (o);

console.assert(o !== p); // passes
console.assert(o.friends === p.friends); // passes

console.log(o.addresses[1].street); // "77 Sunset"
console.log(p.addresses[1].street); // "77 SUNSET"
```

Lenses treat `Object`s as immutable and they merely clone the necessary portions of the data structure while sharing the rest.

## Records

Javascript's `Object` data type is highly flawed:

* `this` encourages devs to mix data and logic
* getters silently return `undefined` for not existing properties
* it can contain `null`/`undefined`
* it is a mutable data type

`Object`s are designed to be used for everything but cannot do anything right. For this reason ftor treats `Object`s as records. A record is immutable, avoids `this` and throws a `TypeError` when accessing non-existing properties, that is, it solves most of the issues and thus is much safer. Since we don't want to lose object literal syntax and destructuring assignment ftor's records are still plain old Javascript `Object`s - with a policy though.

If you need subtyping use sum types (tagged unions). If you need modularity use ES2015 modules. If you need something to iterate over, use a collection like `Array`. If you need a composite type of related data without named fields, use tuples. Otherwise use records.

## Tuples

Javascripts doesn't support tuples, because `Array`s may contain various types (e.g. `[1, "a", true]`. However, Javascript supports a tuple like syntax to allow multi argument functions. ftor acknowledges this situation by introducing a church encoded tuple type, i.e. a type with higher order functions as interface:

```Javascript
const Pair = (x, y) => f => f(x, y);
const get1 = (x, _) => x;
const get2 = (_, x) => x;
const bimap = f => g => t => t((x, y) => Pair(f(x), g(y)));
const toArray = (...args) => args

const dbl = x => x + x;
const inc = x => x + 1;

const pair = Pair(1, "a");

pair(get1); // 1
pair(get2); // "a"

toArray(bimap(inc) (dbl) (pair)); // [2, "aa"]
``` 
Genrally, tuples should be selected if a composite type of related data with different types is required.

Tuples implement the following type classes for their elements:

* Bounded
* Ord
* Setoid
* Monoid

```Javascript
const Pair = (x, y) => f => f(x, y);

const compare2 = (Rep1, Rep2) => t2 => t1 => t1((w, x) => t2((y, z) => {
  switch (Rep1.compare(y) (w).tag) {
    case "LT": return LT;
    case "GT": return GT;
    case "EQ": {
      switch (Rep2.compare(z) (x).tag) {
        case "LT": return LT;
        case "GT": return GT;
        case "EQ": return EQ;
      }
    }
  }
}));

const max2 = (Rep1, Rep2) => t2 => t1 => {
  switch (compare2(Rep1, Rep2) (t2) (t1).tag) {
    case "LT": return t2;
    default: return t1;
  }
};

const pair1 = Pair(2, "a");
const pair2 = Pair(2, "b");
const pair3 = Pair(1, "b");

const Num = { compare: y => x => x < y ? LT : y < x ? GT : EQ } // type rep
const Str = { compare: y => x => x < y ? LT : y < x ? GT : EQ } // type rep

max2(Num, Str) (pair2) (pair1); // pair2
max2(Num, Str) (pair3) (pair1); // pair1
``` 
Please note that tuples themselves are not Monoids but the elements they contain may be. Tuples don't implement the enumerable, foldable and mappable (functor) type class intenionally. If you need such behavior please fall back to collections like `Array`s.

## Type representatives

ftor doesn't rely on the prototype system but on type representatives, which have to be passed around explicitly. Type representative is just a fancy word for a static type dictionary, i.e. a plain old Javascript `Object` with a couple of static methods attached:

```Javascript
// functor type representative of the function instance

const Fun = {
  map: f => g => x => f(g(x))
};
```
While type representatives lead to somewhat verbose code on the calling side, they also improve readability, since you can explicitly see the used types in place. With type representatives we are able to

* mitigate Javascript's lack of type inference
* extend built-ins (object and primitive types) without touching them at all
* define several type classes for each data type

Since instances hold a reference to their type representatives we can fall back on this reference when desired (see the lens example above).

## New data types

ftor will eventually introduce the following data types:

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

The following type classes will be offered eventually:

* Alternative (choose)
* Applicative (sequence effects)
* Arrow (function abstraction)
* Bifunctor (covariant in both arguments)
* Bounded
* Comonad (build structures)
* Enum
* Setoid (equality)
* Semigroup (concat)
* Foldable
* Functor (co-/contravariant)
* Monad (sequence effects with dependencies)
* MonadPlus (choose, monoidal monads)
* Monoid (safe concat)
* Ord
* Profunctor (contravariant/covaraint functors)
* Traversable (inside-out)

## Algebraic constructs

ftor will examine the following algebraic constructs:

* Kleisli arrow composition
* corecursion
* F-algebras
* natural transformations
* (co-)yoneda
* free applicatives/monads

## Naming Convention

* use `v, w, x, y, z` for generic variables of any type
* use `vs, ws, xs, ys, zs` for generic collections
* use `o, p, q, r, s` for generic object types
* use `f, g, h, i, j` for generic functions
* use `t1, t2, t3` for values wrapped in a context, where `t` may be replaced with the initial letter of the type class (e.g. `f` for `Functor` or `m` for `Monad`)
* use `Rep1, Rep2, Rep3` to define a type representative (type dictionary)
* `name_` or `_name` indicates a slightly modified variant of an existing function
* `$name` represents a strictly (or greedy) evaluated version of a function

Functional programming doesn't mean to always use generalized names like `x` or `f`. Use speaking names for specific functions/variables and generic names for generic ones. However, names are a good indicator of how generalized your functions are.

## On-Demand types

ftor strongly relies on the one function per module paradigm. However, various functions may form a type class and hence must be grouped in a type representative as demonstrated wihtin the lens example above:

```Javascript
const Ident = {};

Ident.cons = require("../sum/ident/cons");
Ident.map = require("../sum/ident/map");
Ident.run = require("../sum/ident/run");
```
Please note that on-demand types are experimental and I am not sure if I'll continue to pursue this approach.

## Type signatures

To meet Javascript's dynamic type system ftor uses extended type signatures:

* `[*]` represents a list of various types (e.g. `[1, "a", true]`)
* `(*)` represents the rest syntax `...` in argument lists (e.g. `(*) -> [*]`)
* `|` represents a conjunction (e.g. `(a -> b) -> a -> b|null`)

## Todos

- [ ] add type rep dependencies to inline doc
- [ ] add Ord/Eq/Enum to built-in types
- [ ] add zip/unzip to tuples
- [ ] add contramap/dimap to tuple?
- [ ] foldMap + concatMap
- [ ] introduce church encoded value objects
- [ ] rename impure functions as actions
- [ ] add nameBy naming convetion to readme
- [ ] add rest operator support for intercept
- [ ] provide missing code examples
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
- [ ] introduce unzip
- [ ] introduce Enum type
- [ ] explore finger trees/sequences and tries
- [ ] Tuple has not foldable