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

It uses higher order functions to define new types (Church encoding) and instances of the `Arrow` type class to model control flows. It avoids globally visible mutations, reifies effects to first classe values or shifts them to the edges of an application.

# Principles

ftor maneuvers between the following opposites with the objective of optimal balance:

* abstraction vs. comprehensibility
* functional purity vs. performance
* idiomatic code vs. thinking outside the box

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
* `f, g, h, i, j` represent function types
* `ft`, `gt`, `ht` represent Kleisli arrows, i.e. functions that return monads
* `tv`, `tw`, `tx`, `ty`, `tz` represent a value wrapped in a sum type
* `name_` or `_name` indicates a slightly modified variant of an existing function `name`
* `nameBy` or `nameWith` indicates a more general version of an existing function `name`

Please note that names are a quite good indicator of how generic your code is. Generic names indicate generic code and vice versa.

## Purity and referential transparency

## Currying and abstraction over arity

## Higher order functions and inversion of control

## Common combinators

## Point-free vs. procedural style

## Abstraction over recursion

### Folding

### Folding with mutual recursion

### Transducing

## Church encoding in untyped languages

## Algebraic data types

### Product types

* Records (`Object`s)
* Lists (`Array`s)
* Tuples

### Sum types

* monomorphic types (e.g. enumerations)
* polymorphic types (e.g. Either)

### Other types

* Recursive types
* Function types
* Singleton types
* Unit types

### Pattern matching

## Immutability and persistant data structures

## Polymorphism in untyped languages

### Ad hoc Polymorphism

### Parametric polymorphism

### Parametricity

## Lazyness in strictly evaluated languages

# Data types

## Primitives

## Product types

## Sum types

## Type classes

# Debugging

# Research

* Arrows/Kleisli arrows
* Corecursion
* F-algebra + Cata-/Anamorphisms
* Hylomorphisms
* Natural transformations
* Coyoneda
* Free applicatives/monads/arrows

# Todos

- [ ] add `Option` to function that may return undefined
- [ ] foldlk/foldrk is distinguished because of prematurely exiting
- [ ] right folds are derived by applying a flipped binary operation to fold
- [ ] ftor throws when getting/deleting non-existing `Object` properties
- [ ] use recursion instead of `xs.map((x, idx) => ...)`
- [ ] Ordering type is pointless in untyped language
- [ ] fold a list of tuples into a single tuple
- [ ] fold nth element of a list of tuples
- [ ] replace foldl/r with fold inside Either
- [ ] concat means `[a] -> [a] -> [a]` in ftor whereas `[[a]] -> [a]` is join
- [ ] append/prepend for tuples?
- [ ] add flatten example for `foldMap`
- [ ] type class functions are passed to functions in Javascript's tuple-like syntax
- [ ] replace `[a, b]` array misuses with pair tuples