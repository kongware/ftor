ftor
====

<img src="https://i.stack.imgur.com/UqCPm.png?s=328&g=1" width="164" height="164" alt="ftor">

An idiomatic, non-dogmatic lazy lib that facilitates the functional paradigm in Javascript.

## Status

This library is experimental and still work in progress.

## Mission

Functions.

Or more precisely pure, first class functions

in curried form, which close over their environments.

Such function are used to define higher order functions and primitive combinators,

which are derived to combined combinators and funtion compositions of arbitrary complexity.

Ultimately, this is all you need to create domain specific languages of any expressive power.

Many people claim that this were not idiomatic Javascript. Don't believe them, because Javascript ships with...

* closurses
* first class functions
* higher order functions
* generator functions
* arrow functions to facillitate currying

**Regain hope all ye who enter here.**

## Criteria

* love functions
* enjoy purity
* long for TCO
* avoid magic and false simplicity
* reject micro optimizations
* model your data by disjunctions
* follow laws, not your guts
* follow parametricity
* encode declaratively
* point free is an effect, not a purpose
* reify effects
* embrace immutability
* do it recursively
* respect DRY, SRP
* and the principle of least astonishment

## Terminology

* composable function: A function that is partially applicable in its last argument
* operator function: A first class function, i.e. a function without any functions arguments
* type representative: A plain old Javascript object that contains functions (no methods) and represents a type class (e.g. Functor)

## Currying

Operator Functions are offered in two variants in ftor: In curried or uncurried form:

```Javascript
const add = y => x => x + y; // curried form
const add_ = (x, y) => x + y; // uncurried form
```
As you can see the arguments of the curried form are flipped, because this is the natural argument order of curried operator functions.

Higher order functions are offered in three variants: In curried form or in composable form that expects the passed operator function either in curried or uncurried form.

```Javascript
const comp2 = f => g => x => y => f(g(x, y)); // curried function
const comp2_ = (f, g, x) => y => f(g(x) (y)); // composable function that expects a curried operator function
const comp2__ = (f, g, x) => y => f(g(x, y)); // composable function that expects an uncurried operator function
```
As you can see there is a strict naming convention. See more in the naming section.

All variants of a function are bundled in a single module, that is, you can require only the variants you desire.

## Type representatives

ftor doesn't rely on the prototype system but on type represetatives, which have to be passed around explicitly. Type representative is just a fany word for a static type dictionary, i.e. a plain old Javascript `Object` with a couple of attached static methods (or rather funcions):

```Javascript
const _Function = {
  map: f => g => x => f(g(x))
};
```

While type representatives lead to somewhat verbose code on the calling side, they also improve its readability, since you always see the used types in place. With type representatives we are able to

* mitigate Javascript's lack of type inference
* extend built-ins (object and primitive types) without touching them at all
* define several type classes for each data type

## New data types

ftor introduces the following data types:

* Char (subclassed)
* Cont (tagged union)
* Either (tagged union)
* Option (tagged union)
* Ordering (tagged union)
* Tuple (Church encoded)
* to be continued...

Church encoded means that a type is represented solely by higher order functions.

## Type classes and extended built-ins

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

## Tagged unions (sum types)

ftor's sum types must use explicit type dicts instead of prototypes. Each choice of a sum must implement its own value constructor that enriches values with the following meta information:

* type property holding a reference to the corresponding type dict
* tag property to allow pattern matching

Here is an simplyfied sketch of the `Option` type:

```Javascript
// type defintion

const Option = {};

Option.cata = pattern => ({tag, x}) => pattern[tag](x);
Option.fold = f => g => Option.cata({Some: f, None: g});

Option.concat = Rep => ({tag: tagy, x: y}) => ({tag: tagx, x: x}) => tagx === "None"
 ? tagy === "None"
  ? None()
  : Some(y)
 : tagy === "None"
  ? Some(x)
  : Some(Rep.concat(y) (x));

// constructors

const Some = x => ({type: Option, tag: "Some", x: x});
const None = () => ({type: Option, tag: "None"});

// auxiliary functions

const cata = Rep => Rep.cata;
const concat = Rep => Rep.concat;
const fold = Rep => Rep.fold;
const K = x => _ => x;

// mock types/functions/data

const All = {
  concat: y => x => x && y
}

const Any = {
  concat: y => x => x || y
}

const sqr = x => x * x;

const v = Some(5);
const w = None();

const x = Some(true);
const y = Some(false);


// application

fold(Option) (sqr) (K(0)) (v); // 25
fold(Option) (sqr) (K(0)) (w); // 0

concat(Option) (All) (x) (y); // {..., x: false}
concat(Option) (Any) (x) (y); // {..., x: true}
```

## Naming Convention

* use `[v, w, x, y, z]` for generic variables of any type
* use `[vs, ws, xs, ys, zs]` for generic collections
* use `[o, p, q, r, s]` for generic object types
* use `[f, g, h, i, j]` for generic functions
* use `[t1, t2, t3]` for values wrapped in a context, where `t` may be replaced with the initial letter of the type class (e.g. `f` for `Functor` or `m` for `Monad`)
* use `[Rep1, Rep2, Rep3]` to define a type representative (type dictionary)
* `[name_]` indicates an operator function in uncurried form
* `[name_]` indicates a higher order function in composable form, which applies the given operator functions procedurally with one argument per call
* `[name__]` indicates a higher order function in composable form, which applies the given operator function(s) with a single call with multiple arguments
* `[_name]` distinguishes either a slightly different variant of an existing function or avoids naming conflicts with reserved keywords or allows names with leading numbers
* `[$name]` may represent a native Symbol

Functional programming doesn't mean to always use generalized names like `x` or `f`. Use speaking names for specific functions/variables and generic names for generic ones. However, names are a good indicator of how generalized your functions are.

## How to properly require

ftor strongly relies on the one function per module paradigm. However, some functions belong together semantically because, for example, they form a type class. Such functions ought to be grouped in a type representative, which also helps to avoid naming conflicts.

## Debugging

Besides common helpers like `tap` or `trace` ftor offers a functional type checker that checks both, expected types of arguments and return values as well as the arity of procedurally applied curried functions. In order to use the type checker, just apply it to functions of imported modules. As long as your code doesn't depend on the `name` or ` length` property  of the function prototype, the type checker doesn't alter the behavior of your program. Hence you can easily remove it as soon as you finish the development stage.

## Documentation

The typical ftor function is so atomic that its purpose is easly comprehensible. However, often its application isn't intuitive for programmer, who are accustomed to the imperative style. Hence I will provide inline application examples for each function asap.

## Todos

- [ ] add type signature legend
- [ ] add how to require
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