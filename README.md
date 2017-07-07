ftor
====

<img src="https://i.stack.imgur.com/UqCPm.png?s=328&g=1" width="164" height="164" alt="ftor">

# Status

This library is experimental and still work in progress.

## What

ftor is a library that adapts the functional paradigm meaningfully for untyped languages like Javascript.

## Why

ftor teaches you the fundamental functional idioms, which are extremely generalized concepts and language agnostic. This means you can use this knowledge in countless scenarios, regardless of the programming language you're working on. In order to achieve this ftor doesn't force you to learn a new language. You can just stick to the Lingua Franca of the web - Javascript.

With ftor you develop a feel for

* types
* effects
* purity
* compositon
* polymorphism
* immutability
* currying
* co-/recursion
* lazy evaluation

There is a good chance that you are a better programmer afterwards :D

## Design Principles

* abstraction vs. comprehensibility
* advanced techniques vs. low barrier to entry
* functional purity vs. performance
* idiomatic code vs. thinking outside the box

## Programming Guidelines

* whenever you can do it with a pure function, just do it with a pure function
* reify effects to first class values
* defer the execution of effects as long as possible
* avoid visible mutations but learn to appreciate private ones
* model your domain with alternatives instead of hierarchies
* prefer tail recursive algorithms over loops
* transform statements into first class expressions


All of these guidelines have the same purpose, which is somehow the fetish of functional programming:

**Everything must be composable!**

## Terminology

* composable function: A pure function that is partially applicable in its last argument
* first order function: A function that neither accepts function types as arguments nor returns them
* higher order function: A function that accepts function types as arguments and/or returns them
* action: An impure and regularly nullary function that performs side effects
* Church encoding: Data types that are encoded by higher order functions
* Arrows: The type class that abstracts over function types (not ES2015 arrow functions)

## Naming conventions

The following conventions for name bindings are used:

* `name_` or `_name` indicates eihter a slightly modified variant of an existing function `name` or just avoids name conflicts with reserved keywords or native functions.
* `nameBy` or `nameWith` indicates a more general version of an existing function `name`
* `$name` regularly represents a `Symbol`

Otherwise I tend to use the first letter of a type for name bindings, e.g. `f` for functions. When I need to name several functions, I fall back to alphabetically following letters, e.g. `g`, `h` etc. for functions.

For more specific functions I also use descriptive names sometimes. Since ftor is a generic library it doesn't happen often, though.

## Type signature extension

The following type signature extension is neccesary given the fact that Javascript is dynamically typed. Please note that `?` represents the lack of a type.

Functions:

* `Function` represents an untyped function with unknown arity
* `? -> ?` represents an untyped unary function
* `? -> ? -> ?` represents an untyped binary function

Multi-argument functions and tuples:

* `(a, b) -> a` represents either a multi-argument function or a tuple (pair) of type `a` and `b`
* `(...a) -> a` represents a variadic function (rest syntax)
* `(...?) -> ?` represents an untyped variadic function (rest syntax)

Arrays and collections:

* `[?]` represents an untyped `Array` collection
* `[a, b]` represents an heterogeneous `Array` that acts like a pair tuple
* `[a, b, c]` represents an heterogeneous `Array` that acts like a triple tuple

Objects, dictionaries and records:

* `{?}` represents an untyped `Object` with key/value-pairs of type `String`/untyped
* `{x: a}` represents a heterogeneous `Object` with at least a key/value-pair of type `String`/`a`
* `{x: a, y: b}` represents a heterogeneous `Object` with at least two key/value-pairs of type `String`/`a` and `String`/`b`
* `{a}` represents a homogenous dictionary with key/value-pairs of type `String`/`a`
* `{k a}` represents a homogenous dictionary with key/value-pairs of type `k`/`a`
* `{a, b}` represents a record with two fields and keys of type `String`

Input/Output and side effects:

* `IO` represents an interaction with the real world (side effect)

## ES2015 modules

I'll switch to ES2015 modules as soon as there is native support by browser vendors.

# Runtime type system

Functional programming without strict types isn't reasonable. Hence we must pretend Javascript would have a strict type system. But how would such a type system affect our programming? How should we develop a better feeling for types when there are none?

For this reason ftor ships with a pluggable runtime type system, that is to say you can switch it on and off whenever you want. It covers curried, multi-argument, variadic and polymorphic functions, all built-in types, polymorphic types, tuples, records, homogenous collections and dictionaries and above all, sum types!

See more within a few days...