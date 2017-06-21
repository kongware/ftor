ftor
====

<img src="https://i.stack.imgur.com/UqCPm.png?s=328&g=1" width="164" height="164" alt="ftor">

# Status

This library is experimental and still work in progress.

# What is ftor good for?

ftor is a library that adapts the functional paradigm meaningfully for untyped languages like Javascript.

# Why should I learn it?

ftor teaches you the fundamental functional idioms, which are extremely generalized concepts and language agnostic. This means you can use this knowledge in countless scenarios, regardless of the programming language you're working on. In order to achieve this ftor doesn't force you to learn a knew language. You can just stick to the Lingua Franca of the web - Javascript.

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

# Design Principles

* abstraction vs. comprehensibility
* advanced techniques vs. low barrier to entry
* functional purity vs. performance
* idiomatic code vs. thinking outside the box

# Programming Guidelines

* whenever you can do it with a pure function, just do it with a pure function
* reify effects to first class values
* defer the execution of effects as long as possible
* avoid visible mutations but learn to appreciate private ones
* model your domain with alternatives instead of hierarchies
* prefer tail recursive algorithms over loops
* transform statements into first class expressions


All of these guidelines have the same purpose, which is kind of like the fetish of functional programming:

**Everything must be composable!**

# Fundamentals

## Terminology

* composable function: A pure function that is partially applicable in its last argument
* first order function: A function that neither accepts function types as arguments nor returns them
* higher order function: A function that accepts function types as arguments and/or returns them
* action: An impure and regularly nullary function that performs side effects
* Church encoding: Data types that are encoded by higher order functions
* Arrows: The type class that abstracts over function types (not ES2015 arrow functions)

## Naming conventions

The following conventions for name bindings are used:

* `v`, `w`, `x`, `y`, `z` represent arbitrary types
* `vs`, `ws`, `xs`, `ys`, `zs` represent collection types
* `iv`, `iw`, `ix`, `iy`, `iz` represent either iterables or iterators
* `o`, `p`, `q`, `r`, `s` represent `Object` types
* `f`, `g`, `h`, `i`, `j` represent function types
* `ft`, `gt`, `ht` represent Kleisli arrows, i.e. functions that return functors/applicatives/monads etc.
* `tv`, `tw`, `tx`, `ty`, `tz` represent a value wrapped in a sum type
* `t`, `u`, `v` `w` represent product types except `Array`s and `Object`s
* `name_` or `_name` indicates a slightly modified variant of an existing function `name`
* `nameBy` or `nameWith` indicates a more general version of an existing function `name`