ftor
====

<img src="http://kongware.net/i/ftor.png" width="174" height="57" vspace="16" alt="ftor"><br>
An idiomatic, non-dogmatic lazy lib that facilitates the functional paradigm in Javascript.

## Status

This library is experimental, still a work in progress and thus has an unstable API.

## Criteria

* weighs genericity up against readability and performance
* prefers idiomatic code over magic
* embraces pure, curried functions and combinator logic
* builds on parametric polymorphism and return type polymorphism
* passes type dictionaries explicitly around to imitate type inference
* promotes generic programming
* benefits from lazy evaluation and lazy composition
* encapsulates effects and makes them explicit
* strives for immutability and persistent data structures
* facilitates handling of asynchronous control flows
* enables responsive programming
* favors factory functions over constructors/classes
* promotes abstract data types
* introduces an alternative iteration protocol
* avoids external dependencies
* worships mathematics
* respects DRY and SRP

## Code Legend

### Identifiers

* x, y, z, w, v: type variables (of any type)
* xs, ys, zs, ws, vs: native `Array`s
* o, p, q, r, s: native `Object`s
* ident: fully curried version of a function - f => g => x => y => f(g(x) (y))
* _ident: uncurried input, curried output - (f, g) => (x, y) => f(g(x) (y))
* ident_: curried input, uncurried output - f => g => x => y => f(g(x, y))
* &lowbar;ident&lowbar;: fully uncurried version of a function - (f, g) => (x, y) => f(g(x, y))
* $ident: native `Symbol`

## Currying and Pure Functions

All functions are available in manually curried form. However, for performance reasons there are also functions with either uncurried input (arguments), output (returned functions) or both. I reccommend to use normal curried functions and only resort to "optimized" versions if when absolutely necessary. The "optimized" functions have hideous identifiers (e.g. "_ident" or "_ident_") so that their use has an aesthetic price.

## Algebraic Data Types

ftor will introduce a couple of algebraic data types along with a type system, which requires types to be passed around explicitly.

## `Promise`s

ftor will give a lazy, non-overloaded and unicast alternative to native `Promise`s.

## Reactive Paragidm

ftor will implement the `Observable` prototcol along with a couple of convenience functions.

## Iteration Protocols and Asynchronous Iterators

The iteration protocols in Javascript are a pile of crap. They introduce lazy side effects and a lot of shared state in your code. ftor propagates an alternative iteration protocol that avoid these drawbacks.

## Shared Scope and Cooperative Multi Tasking

ftor will explore the benefits of generator functions.

## Abstract Data Types

ftor will use `Map`/`Set` and their weak counterparts as often as possible in order to separate the programm (metadata) and the data level.

## Value vs. Reference Equality

ftor acknowledges that Javascript doesn't have value objects yet and strictly performs equality checking of composite types by reference.

## Genericity vs. Readability vs. Performance

ftor weighs these factors up - it's the holy grale of functional programming in a multi-paradigm language like Javascript.

## Modularization

ftor is going to switch to ES2015 modules as soon as possible.

## API

A good API is an API with the smallest possible surface.

## Dependencies

nay.

## Platform support

ftor assumes an ES2015 environment. Use transpilers.

## TODO

 - [ ] zippers
 - [ ] take/drop
 - [ ] foldMap
 - [ ] f-algebra catamorphism
 - [ ] co-recursion
 - [ ] anamorphism/unfold
 - [ ] hylomorphism
 - [ ] linked list/trees
 - [ ] enumerations
 - [ ] functional iteration protocols
 - [ ] monoidal transducer
 - [ ] functions always return frozen object types
 - [ ] functions that may fail return an option type
 - [ ] use pairs/records in functions preferably