ftor
====

<img src="https://i.stack.imgur.com/UqCPm.png?s=328&g=1" width="164" height="164" alt="ftor">

An idiomatic, non-dogmatic lazy lib that facilitates the functional paradigm in Javascript.

## Status

This library is experimental and still work in progress.

## Mission

Functions.

More precisely pure,

first class functions in curried form

that close over their environments.

Such function are used to define higher order functions and primitive combinators,

which are derived to combined combinators and funtion compositions of arbitrary complexity.

Ultimately, this is all you need to create domain specific languages of any expressive power.

Many people claim that this were not idiomatic Javascript. Don't believe them, because Javascript has...

* closurses
* first class functions
* higher order functions
* generator functions
* arrow functions to facillitate currying

Regain hope all ye who enter here.

## Criteria

* purity
* idiomatic patterns instead of magic hacks and false simplicity
* think algebraic, model data with sum types
* parametric and ad-hoc polymorphism
* love higher order functions and combinators and hence hate asyn functions
* declarative programming and point-free
* lazy evaluation when possible
* reify effects to first class values
* immutability and persistent data structures
* do it recursively
* respect DRY, SRP and the principle of least astonishment

## Currying

All functions are manually curried in ftor. However, operator functions, i.e. all first order functions are also provided in uncurried or composable form. Such functions are marked with a trailing underscore in their name.

Composable functions are curried only in their last argument to make them partially applicable (e.g. for function composition).

Usually higher order functions expect curried functions as arguments. To improve performance, iterative higher order functions exceptionally expect uncurried operator functions.

ftor has broad support of the tuple type and thus can handle multi-argument functions pretty well.

## Augmented Built-ins

ftor augments built-ins by utilizing `WeakMap`s. To use these augmented builtins on the calling side, each function must perform an additional lookup to retrieve the desired method.

The following type classes (interfaces) are provided:

* Applicative
* Bounded
* Enum
* Eq (Semigroup)
* Functor
* Monad
* Monoid
* Ord
* Traversable

## New types

ftor introduces the following types:

* Char
* Iterator
* Misc. sum types
* Ordering
* Tuple

Please note that in Javascript in place of the 0-tuple `null` (and `undefined`) is used as the unit type. `null` is a propper unit type, since it can be both, an argument and a property key.

## `Iterators` without observable mutations

ftor contains its own `Iterator` implementation that avoids observable mutations and offers some nice extras like look ahead/behind. It is compatible with the ES2015 `Iterable` protocol though.

## Debugging

Besides common helpers like `tap` or `trace` ftor offers a functional type checker that checks both, expected types of arguments and return values as well as the arity of procedurally applied curried functions. In order to use the type checker, just apply it to functions of imported modules. As long as your code doesn't depend on the `name` or ` length` property  of the function prototype, the type checker doesn't alter the behavior of your program. Hence you can easily remove it as soon as you finish the development stage.

## Naming Convention

* use [v, w, x, y, z] for generic variables of any type
* use [vs, ws, xs, ys, zs] for generic collections
* use [o, p, q, r, s] for generic object types
* use [f, g, h, i, j] for generic functions
* [name_] indicates first order functions (operator functions) in either uncurried or composable form
* [_name] distinguishes either a slightly different variant of an existing function or allows names with leading numbers (e.g. $3rd)
* [$name] may represent a native Symbol
* [$name] may be used to avoid conflicts with reserved identifiers

Functional programming doesn't mean to always use generalized names like `x` or `f`. Use speaking names for specific functions/variables and generic names for generic ones. The specificity of names is a good indicator of how generalized your functions are.

Please note that ftor doesn't take care of naming conflicts within the library. You have to handle that yourself.

## Documentation

The typical ftor function is so atomic that its purpose is easly comprehensible. However, often its application isn't intuitive for programmer, who are accustomed to the imperative style. Hence I will provide inline application examples for each function asap.

## Todos

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
- [ ] introduce ap/chain for arrays
- [ ] look into both/eitherOr/guarded functions
- [ ] are clojure's multimethods terrible?
- [ ] examine monotonic array
- [ ] add object comparison
- [ ] traverse unknown object (tree)
- [ ] object left/right difference + intersection
- [ ] examine bimap
- [ ] examine functional value object
- [ ] introduce unzip
- [ ] introduce Enum type
- [ ] introduce Char type
- [ ] explore finger trees/sequences
- [x] examine functional sum types - rejected
- [x] delete observable type (javascript frp nonsense)
- [x] derive compn from foldr and merge it with comp