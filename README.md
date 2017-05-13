ftor
====

<img src="https://i.stack.imgur.com/UqCPm.png?s=328&g=1" width="164" height="164" alt="ftor">

An idiomatic, non-dogmatic lazy lib that encodes the functional paradigm in Javascript.

# Status

This library is experimental and still work in progress.

# Main focus

ftor attempts to facilitate the work with pure functions, function composition and combinators and hence depends heavily on the following toolset:

* closures
* first class functions
* higher order functions
* arrow functions
* generator functions (impure)

ftor uses higher order functions to define new types (Church encoding) and instances of `Arrow`s to model control flows. It avoids globally visible mutations, reifies effects to first classe values or shifts them to the edges of an application.

# Principles

ftor maneuvers between the following opposites with the objective of optimal balance:

* abstraction vs. comprehensibility
* functional purity vs. performance
* idiomatic code vs. thinking outside the box

# Fundamentals

## Terminology

* composable function: A pure function that is partially applicable in its last argument
* first order function: A function that neither accepts other functions as arguments nor returns them
* higher order function: A function that accepts other functions as arguments and/or returns them
* action: An impure and regularly nullary function that performs side effects
* Church encoding: Data types that are encoded by higher order functions
* Arrows: The type class that abstracts over function types (not ES2015 arrow functions)

## Naming conventions

The following conventions for name bindings are used:

* `v, w, x, y, z` represent arbitrary types
* `vs, ws, xs, ys, zs` represent collection types
* `o, p, q, r, s` represent `Object` types
* `f, g, h, i, j` represent function types
* `t a, t1 a, t2 a` represent a value wrapped in a sum type
* `t a b, t1 a b, t2 a b` represent alternative values wrapped in a sum type
* `name_` or `_name` indicates a slightly modified variant of an existing function `name`
* `nameBy` or `nameWith` indicates a more general version of an existing function `name`

Please note that names are a quite good indicator of how generic your code is. Generic names indicate generic code and vice versa.

# Todos

a lot.