# <img src="http://kongware.net/ftor.png" width="174" height="50" align="right" alt="ftor">

An idiomatic, non-dogmatic library facilitating functional programming in Javascript.

## Status

This library is experimental and still a work in progress. Note the unstable API.

## Criteria

* pragmatic functional approach (readability vs. purity vs. performance)
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

## Currying

ftor heavily relies on manually curried functions in the strictly mathematical sense. Native methods are wrapped in pre-curried functions as well. A programmatic curry solution is only needed for third party code.

## New Types

ftor introduces some new types that implement the monoidal, functorial, applicative and monadic interfaces and are fantasy land compliant.

## Modularization

As a rule of thumb applies: One little, resuable function per module. I am going to switch to ES2015 modules as soon as native support is reached.

## Scope

The API gets as large as necessary and as small as possible.

## Dependencies

nay.

## Platform support

ftor assumes an ES2015 environment. Use transpilers.

## Todo
	
- [x] just start
- [ ] add basic types
- [ ] add basic functions
- [ ] add type signatures
- [ ] add inline examples
- [ ] write documentation
- [ ] define unit tests