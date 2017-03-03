ftor
====

<img src="https://i.stack.imgur.com/UqCPm.png?s=328&g=1" width="164" height="164" alt="ftor">

An idiomatic, non-dogmatic lazy lib that facilitates the functional paradigm in Javascript.

## Status

This library is experimental and still work in progress.

## Mission

Functions.

More precisely pure, first class functions in curried form that close over their environments.

Such function are used to define higher order functions and primitive combinators.

Which are derived to combined combinators and funtion compositions of any complexity.

Ultimately, this is all you need to create domain specific languages of any expressive power.

Many people claim that this were not idiomatic Javascript. Don't believe them, because Javascript has...

* closurses
* first class functions
* higher order functions
* generator functions
* arrow functions to facillitate currying

That is all we have and it is sufficient. We just have to get used to a new style of programming: Functional programming.

Regain hope all ye who enter here.

## Criteria

* balance genericity, readability and performance
* prefer idiomatic behavior over magic and hacks
* embrace pure, functions, higher order functions and combinators
* provide both curried and multi-argument functions
* try to explore parametric and return type polymorphism
* try to imitate type inference through explicit type dictionaries
* promote generic and declarative programming
* utilize lazy evaluation through thunks
* reify effects to first class values
* strive for immutability and persistent data structures
* facilitates asynchronous control flows
* abstract state changes by observables and streams
* favor factory functions over constructors/pseudo class crap
* enable algebraic data types, especially sum types
* faciliate recursion and corecursion
* introduce an alternative iteration protocol
* worships mathematics
* respect DRY, SRP and the Principle of Least Astonishment

## Naming Convention

* use [v, w, x, y, z] for generic variables of any type
* use [vs, ws, xs, ys, zs] for generic collections
* use [o, p, q, r, s] for generic object types
* use [f, g, h, i, j] for generic functions
* [name_] represents a slightly different variant of the function [name]
* [$name]: may represent a native Symbol
* [$name]: may be used to avoid conflicts with reserved identifiers
* [$name]: may be used to allow numbers as leading character (e.g. $3rd)

Functional programming doesn't mean to always use generalized names like `x` or `f`. Use speaking names for specific functions/variables and generic names for generic ones. The specificity of names is a good indicator of how generalized your functions are.

Please note that ftor doesn't take care of naming conflicts within the library. You have to handle that yourself.

## Currying

All functions are manually curried in ftor. However, some uncurried versions are available, especially for non-commutative operations. The are marked with an trailing underscore in their name.

## `Iterators` without observable mutations

ftor uses an own `Iterator` implementation that avoids observable mutations and offers some nice extras like look ahead/behind. It is compatible with the ES2015 `Iterable` protocol.

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
- [x] examine functional sum types - rejected
- [x] delete observable type (javascript frp nonsense)
- [x] derive compn from foldr and merge it with comp