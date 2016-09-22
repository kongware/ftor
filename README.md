ftor
====

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

## New Types

ftor introduces a couple of new types. Since Javascript is a dynamically typed language with a prototype system, types are formed by methods attached to prototypes.

In order to avoid name conflicts new types in ftor are merely static methods encapsulated in namespaces. Here is a new `List` type, which is compliant with the monad interface:


```js
class List extends Array {}

const array = {
  of: x => List.of(x),

  empty: () => List.of();

  map: map,

  ap: ftor => gtor => array.flatten(
    array.map(f => array.map(f) (gtor)) (ftor)
  ),

  flatten: flatten,

  chain: mf => ftor => array.flatten(array.map(mf) (ftor))
};
```

Please note that the `List` class is for debugging purposes only.

## Reactive Paragidm

ftor combines functional programming with the reactive paradigm. Implementing the `Observable` prototcol is the first step in this direction - more will follow.

## Iteration Protocols and Generator Functions

ftor will focus on the iteration protocols and generator functions and thus benefit from data source abstraction, programmatic data sources and lazy evaluation. Generic functions for folding/transforming/filtering that are based on iterators are capable to work with any "mappable" iterable.

To be able to handle lazy computations more comfortable, ftor provides suitable auxiliary functions.

## Mimicking Asynchronous Iterators

Asynchronous iterators return `Promise`s for `{value, done}` pairs and implement an asynchrnonous queue. This is experimental and tentatively an attempt to proof the concept.

## `Object`s as Dictionaries are Dead

Plain old Javascript `Object`s can contain both user data and programm behavior/meta-data. There is always the latent risk that both levels are mixed togehter. Abstract data types (e.g. `Map`/`Set`) are abstracted behind their APIs and thus can be resricted to represent pure data stores.

ftor favours `Map`s as abstract data type over dictionary-like `Object`s and propagate its use.

## Value vs. Reference Equality

ftor acknowledges that Javascript doesn't have value objects yet and strictly performs equality checking of object types by reference.

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
- [ ] add type signatures
- [ ] add inline examples
- [ ] define unit tests