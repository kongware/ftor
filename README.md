# ftør

A pragmatic library facilitating functional programming in Javascript.

## Status

At least at this early stage ftør is rather a proof of concept than a library for production use.

## Criteria

* Pragmatic functional approach (readability vs. purity vs. performance)
* As much vanilla Javascript and as little magic as possible
* Promoting the composition of pure functions
* Favor of immutability and persistent data structures
* Encapsulating side effects and language features in contexts
* Favor of factory functions over constructors
* As little external dependencies as possible
* Don't Repeat Yourself (DRY)
* Single Responsibility Principle (SRP)

## Currying

ftør heavily relies on manually curried functions in the strictly mathematical sense. Native methods are wrapped in pre-curried functions as well. A programmatic curry solution is only needed for third party code.

## Modularization

ftør is uncompromisingly modular. Each function or class has its own ES2015 module. For packaging I recommend the rollup.js module bundler with it's "tree-shaking" capability.

## Scope

* Common combinators
* Continuation passing style
* Currying
* First class operators
* First class conditions
* Factory functions
* Function composition
* Functional lenses
* Functors, applicatives, monads
* Kleisi composition
* Lazy evaluation
* Memoization
* Monad transformer
* Monadic promises
* Persistent data structures
* Point-free style
* Pure functions
* Recursion
* Streams and Pipes
* Transducers

## Dependencies

Probably immutable.js or maybe my own prototype based persistent data structure hack.

## Platform support

ftør assumes an ES2015 environment. Use transpilers.

## Todo
	
- [x] just start
- [ ] documentation
- [ ] unit tests
