ftor
====

<img src="https://i.stack.imgur.com/UqCPm.png?s=328&g=1" width="164" height="164" alt="ftor">

An idiomatic, non-dogmatic lazy lib that facilitates the functional paradigm in Javascript.

## Status

This library is experimental and still work in progress.

## Criteria / Mission

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
* [name_] represents an uncurried function (e.g. const name = (x, y, z) => {})
* [$name]: represents a native Symbol

Functional programming doesn't mean to always use obfuscated names like x or f. Use speaking names for specific functions/variables and generic names for generic ones.

## Currying

All functions are manually curried in ftor. However, some uncurried versions are available, especially for non-commutative operations. The are marked with an trailing underscore in their name.

## Next

Well, this manpage is also work in progress...