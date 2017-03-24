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

## Currying

All functions are manually curried in ftor. However, operator functions, i.e. all first order functions are also provided in uncurried or composable form. Such functions are marked with a trailing underscore in their name.

Composable functions are curried only in their last argument to make them partially applicable (e.g. for function composition):

```Javascript
const comp = f => g => x => f(g(x)); // curried function
const comp_ = (f, g) => x => f(g(x)); // composable function
```

Usually higher order functions expect curried functions as arguments. To improve performance, iterative higher order functions exceptionally expect uncurried operator functions.

ftor has broad support of the tuple type and thus can handle multi-argument functions pretty well.

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

## Tagged unions (sum types)

ftor's sum types must use explicit type dicts instead of prototypes. Each choice of a sum must implement its own value constructor that enriches values with the following meta information:

* type property holding a reference to the corresponding type dict
* tag property to allow pattern matching

Here is an simplyfied sketch of the `Option` type:

```Javascript
// type defintion

const Option = {};

Option.cata = pattern => ({tag, x}) => pattern[tag](x);
Option.fold = f => g => Option.cata({some: f, none: g});

Option.concat = type => ({tag: tagy, x: y}) => ({tag: tagx, x: x}) => tagx === "none"
 ? tagy === "none"
  ? None()
  : Some(y)
 : tagy === "none"
  ? Some(x)
  : Some(type.concat(y) (x));

// constructors

const Some = x => ({type: Option, tag: "some", x: x});
const None = () => ({type: Option, tag: "none"});

// auxiliary functions

const cata = type => type.cata;
const concat = type => type.concat;
const fold = type => type.fold;
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

## Debugging

Besides common helpers like `tap` or `trace` ftor offers a functional type checker that checks both, expected types of arguments and return values as well as the arity of procedurally applied curried functions. In order to use the type checker, just apply it to functions of imported modules. As long as your code doesn't depend on the `name` or ` length` property  of the function prototype, the type checker doesn't alter the behavior of your program. Hence you can easily remove it as soon as you finish the development stage.

## Naming Convention

* use `[v, w, x, y, z]` for generic variables of any type
* use `[vs, ws, xs, ys, zs]` for generic collections
* use `[o, p, q, r, s]` for generic object types
* use `[f, g, h, i, j]` for generic functions
* use `[?x, ?y, ?z]` for values wrapped in a context, where `?` is the first letter of the type class
* use `[Rep]` to define a type representative (type dictionary)
* `[name_]` indicates first order functions (operator functions) in either uncurried or composable form
* `[_name]` distinguishes either a slightly different variant of an existing function or avoids naming conflicts with reserved keywords or allows names with leading numbers
* `[$name]` may represent a native Symbol

Functional programming doesn't mean to always use generalized names like `x` or `f`. Use speaking names for specific functions/variables and generic names for generic ones. The specificity of names is a good indicator of how generalized your functions are.

Please note that ftor doesn't take care of naming conflicts within the library. You have to handle that yourself.

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