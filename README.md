# ftor

<img src="http://kongware.net/i/ftor.png" width="174" height="57" vspace="16" alt="ftor"><br>
An idiomatic, non-dogmatic lazy lib that facilitates the functional paradigm in Javascript.

## Status

This library is experimental and still a work in progress. Note the unstable API.

## Criteria

* pragmatic functional approach (genericity vs. performance)
* as much vanilla Javascript and as little magic as possible
* compose little, reusabe functions
* facilitate asynchronous control flows
* avoid meta programming like the plague
* encapsulate side effects
* strive for immutability
* favor factory functions
* avoid dependencies
* worship mathematics
* don't repeat yourself
* single responsibility principle

## Reactive Paragidm

The reactive programming is great to handle user events. ftor embraces the paradigm by implementing the observable protocol.

## Iteration Protocols and Generator Functions

ftor will focus on the iteration protocols and generator functions and thus benefit from data source abstraction, programmatic data sources and lazy evaluation. Generic functions to fold, trannsform or filter are capable to work with any "mappable" iterator.

## Mimicking Aynchronous Iterators

Iterators that return `Promise`s for `{value, done}` pairs. I don't know if this is actually possible though.

## `Object`s as Dictionaries are Dead

ftor favours `Map`s as abstract data type over dictionary-like `Object`s.

Plain old Javascript `Object`s arrange your program by providing a tree-like data structure and namespaces. They contain mainly behavior but also a couple of metadata (e.g. `Array.prototype.length`). Due to the lack of alternatives they were abused as data dictionaries until ES2015 introduced abstract data types (`Map`/`Set`).

## Gettin' Lazy

Javascript has a couple of lazy qualities:

* functions are lazy
* lazy expressions by thunks
* lazy iteration by iterators

ftor encourages the programmer to leverage this lazy properties for greater efficiency in certain scenarios.

## Value vs. Reference Equality

ftor acknowledges that Javascript doesn't have any value objects yet and performs equality checking of object types by reference.

## Genericity vs. Performance

Whenever I implement a function more generic in Javascript it also suffers a performance loss, because additional functions are passed around. In Haskell this relation isn't that obvious. In fact Haskell's performance behavior is hard to predict, because its compiler pursues some complex optimization strategies. However, Javascript is an interpreted language and thus cannot afford this kind of expensive optimizations.

Consequently almost every generalization in Javascript comes at the expense of speed and needs to be weighed up in each individual case.

## Currying

ftor heavily relies on manually curried functions in the strictly mathematical sense. Native methods are wrapped in pre-curried functions as well. A programmatic curry solution is only needed for third party code.

## New Types

ftor introduces some new types that implement the monoidal, functorial, applicative and monadic interfaces and are fantasy land compliant.

## Modularization

As a rule of thumb applies: One little, resuable function per module. I'll to switch to ES2015 modules as soon as native support is reached.

## API

A good API is a little API.

## Dependencies

nay.

## Platform support

ftor assumes an ES2015 environment. Use transpilers.

## Todo
	
- [x] just start
- [ ] add functions that depend on `Iterable`s
- [ ] add functions that depend on `Map`/`Set`
- [ ] add algebraic data types
- [ ] add functions that depend on algebraic data types
- [ ] add type signatures
- [ ] add inline examples
- [ ] define unit tests