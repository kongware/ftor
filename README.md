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

## Type signature extensions

To meet Javascript's dynamic type system and idiomatic techniques ftor uses extended, non-standard type signatures:

* `[*]` represents a list of different types, e.g. `[1, "a", true]`
* `(*)` represents a tuple whose length can only be determined at runtime,  e.g. `(1, "a")` or `(1, "a", true)` etc.
* `t *` represents a context that contains an arbitrary number of values either with the same or with various types
* `|` represents a conjunction of two fixed types, e.g. `a -> String|Number`

## Naming conventions

* `v, w, x, y, z` represents type variables (polymorphism)
* `vs, ws, xs, ys, zs` represents polymorphic collections
* `o, p, q, r, s` represents Javascript `Object`s
* `f, g, h, i, j` represents functions
* `t, t1, t2, t3` represents values wrapped in a context
* `Rep, Rep1, Rep2, Rep3` represents type representatives (type dictionary)
* `name_` or `_name` indicates a slightly modified variant of an existing function

Values wrapped in contexts are not always denoted with `t` but with the initial letter of the type class (e.g. `f` for `Functor` or `m` for `Monad`).

Please note that names are a pretty good indicator of how generic your code is. Generic names indicate generic code and vice versa.

## Name conflicts

Pleae note that ftor uses the same generic names for dozens of functions of different data types and type classes. It is your job o create yxour own name spaces to avoid name conflicts.

## Currying

All functions in ftor are in manually curried form. Currying leads to abstraction over arity in many cases and thus facilitates function composition and combinatorics.

## Combinators

There are a couple of combinators which are regularly encountered when working with pure functions. In ftor these combinators have concise names with a single capital letter sometime along with a subsequent number. Just memorize them like operators and you'll soon appreciate their conciseness:

* A (application) :: `(a -> b) -> a -> b`
* A_ (reverse application) :: `a -> (a -> b) -> b`
* B (variadic, partially applicable composition) :: `(Function) -> (a -> b) -> a -> c`
* B_ (variadic compostion) :: `(Function) -> a -> b`
* D (bi-composition) :: `(c -> d -> e) -> (a -> c) -> a -> (b -> d) -> b -> e`
* D2 (composition in 2nd argument) :: `(a -> c -> d) -> a -> (b -> c) -> b -> d`
* D3 (composition in 3rd argument) :: `(a -> b -> d -> e) -> a -> b -> (c -> d) -> c -> e`
* Q (variadic, partially applicable, reverse composition) :: `(Function) -> (a -> b) -> a -> c`
* Q_ (variadic, reverse compostion) :: `(Function) -> a -> b`
* I (identity) :: `a -> a`
* K (constant) :: `a -> b -> a`
* K_ (constant) :: `a -> b -> b`
* U (recursion) :: `(a -> a) -> a -> a`

Please note that some of these names differ from those in the literature.

## Avoiding application hell

In Javascript we cannot shift functions to infix position and treat them like operators. We cannot define our own operators either. We are stuck with functions in prefix position. Hence we sooner or later end up in application hell:

```Javascript
// this concise Haskell code
triple x y z = [x, y, z]
triple <$> (+1) <*> (*2) <*> (^2) $ 10 // [11, 20, 100]

// is transformed into
const triple = x => y => z => [x, y, z];
ap(ap(B_(triple, inc)) (dbl)) (sqr) (10); // [11, 20, 100]
```
While the Javascript version is equally succinct, it is much harder to read. There are a couple of techniques to mitigate this issue.

### Proper code formatting

```Javascript
ap(
  ap(
    B_(triple, inc)
  ) (dbl)
) (sqr) (10);
```
No real progress, but at least it is now recognizable that `ap` is a binary function and that the outer `ap` gets `sqr` and the inner one `dbl` as second argument.

### Flattening through composition

```Javascript
B2_(ap, ap) (B_(triple, inc)) (dbl) (sqr) (10);
```
Yay, we've avoided deeply nested function calls by using the composition combinator. But now the control flow is abstracted and we need to know how exactly this combinator works.

### Using a specific lambda

```Javascript
A(x => triple(inc(x)) (dbl(x)) (sqr(x))) (10);
```
Well, sometimes a good old lambda and explicit argument names are the better choice than a fancy combinator.

### Runnable code

```Javascript
const A = f => x => f(x);
const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);

const B2_ = (...fs) => x => y => 
 fs.slice(0, -1).reduceRight((acc, f) => f(acc), fs[fs.length - 1](x) (y));

const ap = f => g => x => f(x) (g(x));

const inc = x => x + 1;
const dbl = x => x * 2;
const sqr = x => x * x;

const triple = x => y => z => [x, y, z];

ap(ap(B_(triple, inc)) (dbl)) (sqr) (10); // [11, 20, 100]

B2_(ap, ap) (B_(triple, inc)) (dbl) (sqr) (10); // [11, 20, 100]

A(x => triple(inc(x)) (dbl(x)) (sqr(x))) (10); // [11, 20, 100]
```

## Immutability

ftor opts for immutable data but doesn't enforce it with `Object.freeze` or `Object.seal`. Immutability in Javascript is just a policy and ftor provides various operations that comply with this policy.

One of these operations are functional lenses:

```Javascript
const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);
const mapBy = f => t => t.type.map(f) (t);

const Const_ = {};
Const_.map = f => t => Const(t.x);

const Ident_ = {};
Ident_.map = f => t => Ident(f(t.x));

const Const = x => ({type: Const_, x: x});
const Ident = x => ({type: Ident_, x: x});
const runBy = t => "run" in t ? t.run(t) : t.x;

const key = k => f => o => mapBy(v => Object.assign({}, o, {[k]: v})) (f(o[k]));
const index = i => f => xs => mapBy(x => Object.assign([], xs, {[i]: x})) (f(xs[i]));
const view = lens => B_(runBy, lens(Const));
const map = lens => f => B_(runBy, lens(B_(Ident, f)));

const o = {name: "Bob", addresses: [
  {street: "99 Maple", zip: 94004, type: "home"},
  {street: "77 Sunset", zip: 90069, type: "work"},
  {street: "1 Infinite Loop", zip: 95014, type: "life"},
]}

const _2ndStreetLens = B_(key("addresses"), index(1), key("street"));
const p = map(_2ndStreetLens) (x => x.toUpperCase()) (o);

view(_2ndStreetLens) (p); // "77 SUNSET"

console.assert(o !== p); // passes
console.assert(o.friends === p.friends); // passes
```
Lenses treat `Object`s as immutable and merely clone the necessary portions of the data structure while the rest is shared.

## Records

Javascript's `Object` data type is highly flawed:

* `this` encourages devs to mix data and logic
* getters silently return `undefined` for non-existend properties
* instances may contain `null`/`undefined`
* it is a mutable data type

`Object`s are designed to be used for everything but cannot do anything right. For this reason ftor considers `Object`s mainly as records. A record avoids `this`, is immutable and throws a `TypeError` when accessing non-existend properties.

If you need subtyping use sum types (tagged unions). If you need modularity use ES2015 modules. If you need something to iterate over, use a collection like `Array`. If you need a composite type of related data of different types without named fields, use tuples. Otherwise, use records.

## Tuples

Javascripts doesn't support tuples, because `Array`s can contain various types (e.g. `[1, "a", true]`. However, Javascript supports a tuple like syntax to allow multi argument functions. ftor acknowledges this fact by introducing a church encoded, immutable tuple type, i.e. a type with higher order functions as an interface:

```Javascript
const Pair = (x, y) => f => f(x, y);
const get1 = (x, _) => x;
const get2 = (_, x) => x;
const bimap = f => g => t => t((x, y) => Pair(f(x), g(y)));
const toArray = (...args) => args

const dbl = x => x + x;
const inc = x => x + 1;

const pair1 = Pair(1, "a");
const pair2 = bimap(inc) (dbl) (pair1);

pair1(get1); // 1
pair1(get2); // "a"

pair2(toArray); // [2, "aa"]
```
Please note that since tuples are immutable, you always get a new tuple with operations that carry out mutations. ftor also supports lenses that operate on tuples, i.e. retrieving or modifying nested values is as easy as with flat tuples.

It is important to realize that tuples are a non-recursive data type. A `Pair` (`(a, b) -> c`), for instance, is totally unrelated to a `Triple` (`(a, b, c) -> d`). Genrally, tuples should be chosen if a composite type of related data with different types and fix length is required. Considering this properties and because tuples are product types they merely implement the `Bifunctor` and `Trifunctor` type class, whereas the following type classes are delegated to their elements:

* Bounded
* Ord
* Setoid
* Monoid

Provided that `a` and `b` of a `Pair`, for instance, implement the `Ord` type class, the tuple has a notion of order. If it is desired to map over all elements of a tuple or to concat tuples themselves, then you might want to fall back to a collection type like `Array`s.

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

## Pattern matching

Destructuring assignments and first class functions enable a primitive form of pattern matching in Javascript:

```Javascript
const A = f => x => f(x);
const otherwise = A;

const match = (...fs) => x => {
  const aux = (r, i) => r !== null ? r
  : i in fs ? aux(fs[i](x), i + 1)
  : null;

  return aux(fs[0](x), 1);
};

const pattern = f => x => {
  try {
    return f(x);
  } catch (_) {
    return null;
  }
};

const tell = match(
  pattern(([[_]]) => _ === undefined ? "nested empty list" : null),
  pattern(([[x, _]]) => _ === undefined ? "nested single element list" : null),
  pattern(([[x, y]]) => "nested multiple element list"),
  pattern(([_]) => _ === undefined ? "empty list" : null),
  pattern(([x, _]) => _ === undefined ? "single element list" : null),
  pattern(([x, y]) => "multiple element list"),
  otherwise(x => "no list at all")
);

tell([[1, 2]]); // "nested multiple element list"
tell([1]); // "single element list"
tell([[]]); // "nested empty list"
tell({}); // "no list at all"
```
Unfortunately, destructuring assignment throws an error if the pattern doesn't match the data structure. For this reason the operation must be wrapped in a try-catch-block. Additionally, we lose some of the nice features of real pattern matching:

* There are no checks when extracting values: If the type is modified, the pattern matching will start failing
* There are no checks whether all cases are being covered
* There is no checking on tag names: It is easy to make a typo
* It works only for built-in types

## Todos

- [ ] add Ord/Eq/Enum to built-in types
- [ ] add zip/unzip to tuples?
- [ ] add contramap/dimap to tuple?
- [ ] introduce church encoded value objects
- [ ] rename impure functions as actions
- [ ] add nameBy naming convetion to readme
- [ ] add rest operator support for intercept
- [ ] fold with monoids is called mconcat
- [ ] examine natural transformations, hom functor and f-algebra
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