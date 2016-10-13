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
* builds on parametric polymorphism an generic programming
* enables lazy evaluation and return type polymorphism
* encapsulates effects and makes them explicit
* strives for immutability and persistent data structures
* makes asynchronous control flows easer
* facilitates responsive programming
* favors factory functions over constructors/classes
* gives preference to abstract data types over POJOs
* explores the chances of the iteration protocols
* avoids external dependencies
* worships mathematics
* respects DRY and SRP

## Code Legend

### Identifiers

* x, y, z, w, v: type variables (of any type)
* xs, ys, zs, ws, vs: native `Array`s
* o, p, q, r, s: native `Object`s
* ident_: lazy version of a function
* _ident: flipped argument version of a binary function
* $ident: native `Symbol`

## Currying and Pure Functions

Almost all functions in ftor are curried and pure. <a href="http://kongware.net/currying-partial-application-javascript">Read more about currying in my background article</a>.

## Algebraic Data Types

ftor will introduce a couple of algebraic data types along with a type system, which requires types to be passed around explicitly.

## `Promise`s

ftor will give a lazy, non-overloaded and unicast alternative to native `Promise`s.

## Reactive Paragidm

ftor will implement the `Observable` prototcol along with a couple of convenience functions.

## Iteration Protocols and Asynchronous Iterators

ftor will explore the benefits of the iteration protocols and attempt to enable asynchronous iterators.

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

 - [] zippers
 - [] foldMap
 - [] take/drop
 - [] paramorphism?
 - [] unfold
 - [] linked list
 - [] trees