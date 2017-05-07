ftor
====

<img src="https://i.stack.imgur.com/UqCPm.png?s=328&g=1" width="164" height="164" alt="ftor">

An idiomatic, non-dogmatic lazy lib that encodes the functional paradigm in Javascript.

# Status

This library is experimental and still work in progress.

# Principles

The most successful strategy to solve complex problems is to decompose them into smaller ones, solve them individually and recompose them again. There is actually a mathematical theory that describes this sort of reasoning: Category theory. Functional programming is the attempt to reify category theory into executable programming code. It is the most robust approach we have and we should start applying it.

Beyond that ftor demonstrates that it is actually a good idea to

* shift state into call stacks
* make control flows explicit
* reify effects to first class values
* move effects to the edge of the application
* do without magic and false simplicity
* turn away from micro optimizations
* consider disjunctions to model data
* stop fetishizing the dot operator
* follow algebraic laws, instead of just makeing stuff up

Regain hope all ye who enter here.

# Fundamentals

## Terminology

* composable function: A pure function that is partially applicable in its last argument
* first order function: A function that solely takes non-functional arguments and solely returns non-functional results
* higher order function: A function that accepts functional arguments and/or returns functional results
* action: An impure (and frequently nullary) function that performs side effects
* type representative (type rep): A plain old Javascript `Object` that contains static methods and forms a type class (e.g. Functor)

## Naming conventions

* `v, w, x, y, z` represents type variables (polymorphism)
* `vs, ws, xs, ys, zs` represents polymorphic collections
* `o, p, q, r, s` represents Javascript `Object`s
* `f, g, h, i, j` represents functions
* `t, t1, t2, t3` represents values wrapped in a context
* `Rep, Rep1, Rep2, Rep3` represents type representatives (type dictionary)
* `name_` or `_name` indicates a slightly modified variant of an existing function `name`
* `nameBy` or `nameWith` indicates a more general version of an existing function `name`
* `$name` indicates a native `Symbol`.

Values wrapped in contexts are not always denoted with `t` but with the initial letter of the type class (e.g. `f` for `Functor` or `m` for `Monad`).

Please note that names are a pretty good indicator of how generic your code is. Generic names indicate generic code and vice versa.

## Type signature extensions

To meet Javascript's dynamic type system and idiomatic techniques ftor uses extended, non-standard type signatures, which are of course less precise and pretty confusing. This reflects the flaws of an untyped language. The following syntax is added:

* `((*) -> a)` matches a variadic function with a rest parameter
* `((*) -> a)` matches an ftor tuple whose length can be only determined at runtime
* `((a, *) -> a)` matches a pair (2-tuple) whose first element is of type `a` and the second can be of any type
* `((*, *) -> a)` matches a pair (2-tuple) whose both elements can be of any type (matches each pair)
* `[*]` matches an `Array` whose elements can be of various type
* `[a, b]` matches an `Array` of two elements of different type
* `[*, b]` matches an `Array` of two elements whose first element can be of any type and the second is of type `a`
* `[*, *]` matches an `Array` of two elements whose both elements can be of any type
* `{key1: a, key2: *}` matches an `Object` with two properties: `key1` of type `a` and `key2` of any type
* `String|Number` matches either `String` or `Number` (conjunction of fixed types)

Please note that `Array` and tuple type signatures that contain commata indicate a data structure of a specific length. Consequently, with type signatures we cannot express an `Array`/tuple with a single element, which is the desired behavior though. As opposed to `Array`s `Object`s and other built-in types are described by their bare type name. Provided that an `Object` consists only of a few properties, the alternative syntax `{key1: a, key2: *}` may be chosen.

## Currying and partial application

All functions in ftor are in manually curried form. Currying leads to abstraction over arity in a lot of scenarios and thus facilitates function composition and combinatorics.

Since Javascript doesn't know left sections (`(2)sub = y => 2 - y`) in the context of partial application, the parameter order of function definitions is significant. Parameter lists are linear, hence there are two different orders:

```Javascript
const sub = x => y => x - y;
const sub_ = y => x => x - y;

const sub2 = sub(2);
const sub2_ = sub_(2);

// partial application

sub2(4); // -2, ouch
sub2_(4); // 2

// full application

sub(2) (4); // -2
sub_(2) (4); // 2, ouch
```
That means, whenever a function is partially applied, the dual version (the one with swapped parameters) should be used, otherwise the default one. This rule applies to all combining operations (semigroup) that are non-commutative.

Please note that ftor pursues the naming convention given in the example above. Functions with flipped parameters carry a trailing underscore in their names. Just picture `sub_(2)` as `sub _ - 2` to get a better intuition.

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

## Type representatives

ftor doesn't rely on the prototype system but on type representatives. Type reps are plain old Javascript `Object`s with some static methods that don't depend on `this`. The abandonment of prototypes goes hand in hand with the necessity of passing types explicitly. This is the major drawback of this approach, the advantages outweigh though. More on this later. Here is an extract of the `Ident` type along with the functor type class:

```Javascript
// interop

const $tag = Symbol.for("ftor/tag");
const $x = Symbol.for("ftor/x");

// combined type rep and constructor

const Ident = x => ({[$tag]: "Ident", [$x]: x});

// Functor type class

Ident.map = f => t => Ident(f(t[$x]));

// applying

const sqr = x => x * x;
const x = Ident(5);

Ident.map(sqr) (x); // Ident(25)
```
Every instance of an ftor specific type includes two properties, which are accessable via `Symbol`s. This is essentially done to preclude name conflicts with third party libraries. `$tag` is used to enable a primitive form of pattern matching. ftor offers other sum types with several value constructors, which benefit more form this approach. `$x` provides access to the actual boxed value.

Nice, but why symbols? Well, instead of using strings like "ftor/map" for instance, which inavitably are going to be accessed via a variable in order to avoid typing, I prefer `Symbol`s, which were designed to fulfill exactly this task. There is a name convention in ftor that every `Symbol` has a leading `$` sign in its name, so that no names are blocked for regular variables.

While it is somewhat laborious to pass type reps explicitly, they offer the following advantages:

* they mitigate Javascript's lack of type inference
* they allow us to redefine built-in types
* they enable the definition of multiple type classes per type
* they lead to more readable code, since types are always explicit
* they avoid confusing `Function.prototype.bind` and `this` constructs

Please note that there are sometimes several type classes for a type and as a result of this several type representatives. However, since type reps are just plain old Javascript `Object`s it is easy to merge them in-place while passing them to a function, so that they meet the corresponding requirements.

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

## Debugging

The use of pre-curried arrow functions in ftor results in obfustacted debug information full of anonymous functions. I'd call it rather lambda hell. Since ftor pursues manual currying there is no way to simply add corresponding names during the currying process. However, a proper functional solution must provide means to solve this issue. Hence, ftor ships with a couple of helpers of which the intercepting applicators (`_$_`, `_$$_` etc.) are the most important. Intercepting applicators leave both the input and result of a function untouched but intercept their type information. Their uncommon denotements help to search and replace them in the codebase. You can either apply them at import or simply in-place at the calling code:

```Javascript
const inc = _$_(x => x + 1, "inc");

inc(2); // inc(Number<2>) ==> Number<3>

// or inline

_$_(inc) (2); // inc(Number<2>) ==> Number<3>
```
More complex functions can be intercepted too:

```Javascript
const concat = _$$_(xs => ys => xs.concat(ys), "concat");

concat(["foo"]) (["bar"]);

// logs the sequence

// concat(Array[String<foo>]) ...
// concat(Array[String<foo>]) (Array[String<bar>]) ==> Array[String<foo>, String<bar>]
```
With the intercepting applicators you can visualize the control flow of arbitrarily composed functions. They work with multi argument functions as well as with variadic ones and particularly well with ftor specific types.

## Lazy evaluation

Usually lazy evaluation is implemented at the type level. Since Javascript is evaluated in application order, we cannot help but realize lazyness with means of the language. We can create lazy expressions with functions and lazy functions with thunks. With function composition we can even mimic lazy argument expressions - in a very primitvie way though.

However, without native support lazyness isn't that effective. So far I've encountered basically two use cases.

### Infinite recursion

Thunks allow us to implement infinite recursion:

```Javascript
const evaluate = r => typeof r === "function" && r.length === 0 ? r() : r;
const take = n => xs => n === 0 ? [] : [xs[0], take(n - 1) (evaluate(xs[1]))];
const repeat = x => [x, () => repeat(x)];

JSON.stringify(take(3) (repeat("x"))); // "[x, [x, [x, []]]]"
```

### Stack safe recursion

Thunks enable us to implement stack safe recursion:

```Javascript
const eager = f => (...args) => {
  let g = f(...args);
  
  while (typeof g === "function" && g.length === 0) g = g();
  return g;
}

const repeat = n => f => x => {
  const aux = (x, n) => n === 0 ? x : () => aux(f(x), n - 1);
  return eager(aux) (x, n);
};

const inc = x => x + 1;

repeat(1e6) (inc) (0); // 1000000
```
Maybe there is a kind of lazy monad, which allows us to work with thunks in a fully transparent manner. Further examination are necessary though.

## Parametric and ad-hoc polymorphism

in progress...

## Algebraic data types

in progress...

### Sum types

in progress...

### Product types

in progress...

### Recursive types

in progress...

### Function types

in progress...

### Singleton types

in progress...

### Unit type

in progress...

### Zero type

in progress...

### Pattern matching

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
Unfortunately, destructuring assignment throws an error if the pattern doesn't match the data structure. For this reason the operation must be wrapped in a try-catch-block. Additionally, we lose some of the nice features of native pattern matching:

* There are no checks when extracting values: If the type is modified, the pattern matching will start failing
* There are no checks whether all cases are being covered
* There is no checking on tag names: It is easy to make a typo
* It works only for built-in types

# Types

## Boolean

Since Javascript has only functions in prefix position, the argument order is crucial in conjunction with semigroups. For this reason ftor doesn't implement a `Dual` type class to abstract over swapped `append`-like operations but provides such an operation for each type class.

Please also note that both `All` and `Any` monoids work with native `Boolean`s. There is no type wrapper. Whether a `Boolean` is treated as `All`, `Any` or `Bool` depends solely on the passed type representative. Moreover, most of the functions connected to the `Boolean` type perform implicit or explicit type coercion, i.e. work with all types, because all types in Javascript are inherently truthy/falsy. It is just that we deal with a dynamically typed language and we should embrace this behavior when it makes sense.

## Records

Javascript's `Object` data type has a lot of drawbacks:

* it is a mutable
* `this` encourages devs to mix data and logic
* getters silently return `undefined` for non-existend properties
* instances may contain `null`/`undefined`

Additionally, there is a widespread misuse of the type within the Javascript community. `Object`s are not supposed to be collections or homogeneous dictionaries. If you need something to iterate over, use a collection like `Array`. If you need a dict, use ES2015 `Map`. If you don't need named fields, use tuples. Otherwise, use records.

ftor has a rather strict understanding of `Object`s. It considers them either as records or as namespaces to structure code. A record is a composite type of related data of various type, in which each element is named. Records avoid `this` and are immutable and thus solve some of the drawbacks. Since we don't want to lose the object literal syntax and destructuring assignment, ftor's records are plain old Javascript `Object`s and the listed properties are merely a policy.

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

## Various types

ftor will eventually introduce the following data types:

* Cont (tagged union)
* Const (tagged union)
* Either (tagged union)
* Ident (tagged union)
* Option (tagged union)
* Ordering (tagged union)
* Tuple (Church encoded)
* to be continued...

Church encoded means that a type is represented solely by higher order functions.

# Type classes

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

# Algebras

ftor will examine the following algebraic constructs:

* Arrows/Kleisli arrows
* Corecursion
* F-algebra + Cata-/Anamorphisms
* Hylomorphisms
* Natural transformations
* Coyoneda
* Free applicatives/monads/arrows

# Miscellaneous

## Application hell and point-free style

In Javascript we cannot define our own operators in infix position and move them to prefix position as desired. We are stuck with functions and prefix notation. This is not the best prerequisite for lambda abstractions:

```Javascript
// this concise Haskell code
triple x y z = [x, y, z]
triple <$> (+1) <*> (*2) <*> (^2) $ 10 // [11, 20, 100]

// is transformed into
const triple = x => y => z => [x, y, z];
ap(ap(B_(triple, inc)) (dbl)) (sqr) (10); // [11, 20, 100]
```
The result is a deeply nested function application, also known as function composition. I'd rather call it application hell. There are a couple of techniques to mitigate this issue.

### Proper code formatting

```Javascript
ap(
  ap(
    B_(triple, inc)
  ) (dbl)
) (sqr) (10);
```
No real progress, but at least it is now comprehensable that `ap` is a binary function and that the outer one receives `sqr` and the inner one `dbl` as second argument.

### Further lambda abstraction and point-free style

```Javascript
B2_(ap, ap) (B_(triple, inc)) (dbl) (sqr) (10);
```
Yay, we've avoided deeply nested function calls by using the binary composition combinator. But now the control flow is even more abstracted and we need to know how exactly this combinator works.

### Using a specific lambda

```Javascript
A(x => triple(inc(x)) (dbl(x)) (sqr(x))) (10);
```
Well, sometimes a good old lambda and explicit argument names are the better choice than lambda abstraction through combinators. The control flow is now quite obvious and even though we are less DRY it is the preferable way of solving the task.

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
## Modelling the world with alternatives instead of hierarchies

in progress...

# Todos

- [ ] replace $x as accessor for box values
- [ ] box types have usually no run method unless $x contains a function
- [ ] switch to decentralized type classes!!!
- [ ] reconsider fundamental approach: throwing or silently returning null
- [ ] reconsider pattern matching