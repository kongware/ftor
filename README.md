# ftor

<img src="http://kongware.net/i/ftor.png" width="174" height="57" vspace="16" alt="ftor"><br>
An idiomatic, non-dogmatic library facilitating functional programming in Javascript.

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

## Genericity-Performance-Correlation ##

I am not quite sure if this correlation is an immutable truth, but whenever I make a function more generic it also obtains a performance penalty, because additional functions are passed around. In Haskell this relation isn't that obvious. In fact Haskell's performance behavior is hard to predict, because its compiler pursues some really complex optimization strategies. However, Javascript is an interpreted language and thus cannot afford this kind of expensive optimizations.

Consequently almost every generalization in Javascript comes at the expense of speed and needs to be weighed up in each individual case.

## Currying

ftor heavily relies on manually curried functions in the strictly mathematical sense. Native methods are wrapped in pre-curried functions as well. A programmatic curry solution is only needed for third party code.

## New Types

ftor introduces some new types that implement the monoidal, functorial, applicative and monadic interfaces and are fantasy land compliant.

## Modularization

As a rule of thumb applies: One little, resuable function per module. I am going to switch to ES2015 modules as soon as native support is reached.

## API

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