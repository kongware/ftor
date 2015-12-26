# ftør

A pragmatic library facilitating functional programming in javascript.

## Status

At least at this early stage ftør is rather a proof of concept than a library for productive use.

## Criteria

* Pragmatic functional approach (readability vs. functional purity vs. performance)
* As much plain old javascript and as little magic as possible
* As little external dependencies as possible
* Using objects in the sense of algebraic data types
* Preference for immutability and persistent data structures
* Preference for factory functions over classical inheritance
* Mimicking of static typing during development
* Don't Repeat Yourself (DRY)
* Single Responsibility Principle (SRP)

## Currying

Currying is a prerequisite for functional programming and a core component of any functional library. Since Javascript does not include native curried functions, a custom solution is necessary. ftør does without auto currying and instead relies on nested, unary functions in the mathematical sense. A curry function exists only for curryfication of external, n-ary functions.

## Environments

ftør distinguishes between two environments: Development and production. Each function is available in both. In the development environment, there are type checks and other control structures in order to promote programming of more robust applications. The environment mimics compiler of statically typed languages to mitigate the drawbacks of dynamic typing. In contrast, the production environment is solely optimized on speed.

## Scope

ftør implements the following functional concepts and generalized interfaces for javascript:

* Algebraic data types (ADT)
* Common combinators
* Currying
* First class operators
* Factory functions
* Function composition
* Functional lenses
* Lazy evaluation
* Memoization
* Persistent data structures
* Point-free style
* Pure functions
* Recursion (TCO mimicking)
* Transducers

##### ADTs include:

* Semigroups, Monoids
* Foldable, Traversable
* Functors, Applicatives, Monads
* Option, Either, Validation, Error
* Reader, Writer, State, IO
* List, Zipper
* and a bunch of ftør specific variants

## Dependencies

none.

## Platform support

ftør assumes an ES5 environment. We don't use transpiler since the really interesting new ECMAscript 2015 features can't be expressed with ES5. ftør will be migrated to ES2015 once the necessary browser support is reached.

## Todo
	
- [ ] documentation
- [ ] installation
- [ ] unit tests
