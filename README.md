<pre>
   ad88                                   
  d8"      ,d                             
  88       88                             
MM88MMM  MM88MMM  ,adPPYba,   8b,dPPYba,  
  88       88    a8"     "8a  88P'   "Y8  
  88       88    8b       d8  88          
  88       88,   "8a,   ,a8"  88          
  88       "Y888  `"YbbdP"'   88          
</pre>

# Status

<img src="https://i.stack.imgur.com/UqCPm.png?s=328&g=1" height="110" alt="ftor" align="left">

<br>

Version 0.9.9 (unstable)

**Please note:** This repo is experimental and still work in progress.
<br><br>

## What

ftor enables ML-like type-directed, functional programming with Javascript including reasonable debugging.

## Why

Functional programming in Javascript is frustrating as soon as you leave contrieved examples behind and try to solve real world problems, because...

* beyond first class functions Javascript doesn't offer much on a native level
* there is only a relatively small ecosystem and an insufficient tooling
* there is no type system preventing you from writing bad algorithms

# Type System

At its core ftor consists of a pluggable run-time type system with the following features:

* parametric polymorphism
* higher rank types (rank-2)
* recursive types
* arrays, lists, tuples, maps, records
* and real tagged unions

While ftor attempts to catch type errors as early as possible - ideally at definition time, a run-time type checker is of course not equivalent to a static type system, that is to say it doesn't guarantee a type error free application. Consider ftor rahter as a useful supplement to unit tests and a suitable debugging tool for functional programmers.

ftor respects common coding habits in the Javascript community and simultaneously tries to sensitize developers for type-directed, functional programming. This process is a delicate balancing act sometimes...

## Pluggable

When you import ftor the type checker is disabled by default. You have to enable it in the source code before the first type check. Ideally it should be enabled during the development stage and disabled on the live system.

```Javascript
import * as F from ".../ftor.js";

// untyped area

F.setDevMode(true);

// typed area;
```
## Nominal/Structural Typing

ftor pursues a nominal typing strategy, because this kind of typing is more sound than structural typing. Nominal means that types are distinguished by name rather than by structure.

## Polymorphism

### Parametric Polymorphism

ftor fully supports parametric polymirphism.

### Bounded Polymorphism

Bounded polymorphism is the ability of a type system to define constraints on polymorphic types without having to pass the corresponding type classes explicitly around throughout the codebase. Most statically typed languages like Haskell or Scala resolve type class dependencies at compilte time. ftor doesn't have a compilation step, though. Since it is a pluggable run-time type system the entire type information is erased as soon as it is disabled. Hence we are not allowed to create dependencies on the type system.

It has turned out that the only way to implement bounded polymorphism with ftor is to pass type dictionaries explicitly around. This is cumbersome but necessary, unless you are willing to keep the type checker enabled on the live system, which is generally not a good idea.

### Subtype Polymorphism

As opposed to _TypeScript_ and _Flow_ ftor doesn't support subtyping, because it entails a high degree of complexity in the implementation. There are some experimental subtype relations within primitive types like `Number` and `Integer`, though, which may become obsolete in future versions.

### Higher-Kinded Types

Types are an abstraction over sets of values. Higher-kinded types are an abstraction over types by allowing higher order type constructors. While you can define elegant types with them their implementation isn't trivial and neither is their application. ftor is prepared for higher-kinded types and will eventually support them, but not for the time being.

### Higher-Rank Types

ftor has basic support for rank-2 types but the feature is still experimental.

## Function Type

You can easily create typed functions with the `Fun` constructor wherever an expression is allowed. It takes a mandatory type signature and an arrow - that's all. While explicit type signatures might be laborious at first, you will appreciate their self-documenting character.

ftor's type signatures deviate from Haskell's, though. An important difference are the parentheses, which have to enclose every function signature:

```Javascript
// typed function declaration
const listenTo = Fun(
  "(listenTo :: String -> String)",
  s => s.split("").reverse().join("")
);

listenTo("emerpus evol a"); // "a love supreme"
```
### Multi-Argument Functions

As usual, you can define multi-argument functions. Please note that arguments are not enclosed by parentheses in type signatures:

```Javascript
const add = Fun(
  "(add :: Number, Number -> Number)",
  (n, m) => n + m
);

add(2, 3); // 5
add(2, true); // throws
```
### Variadic Functions

You can define variadic functions using the rest parameter:

```Javascript
const sum = Fun(
  "(sum :: ...Number -> Number)",
  (...ns) => ns.reduce((acc, n) => acc + n, 0)
);

sum(); // 0
sum(1, 2, 3); // 6
sum(1, "2"); // throws
```
And variadic functions with mandatory arguments as well:

```Javascript
const sum = Fun(
  "(sum :: Number, ...Number -> Number)",
  (n, ...ns) => ns.reduce((acc, m) => acc + m, n)
);

sum(); // throws
sum(1); // 1
sum(1, 2, 3); // 6
```
### Curried Functions

In functional programmering the definition of curried function sequences is frequently desired:

```Javascript
const add = Fun(
  "(add :: Number -> Number -> Number)",
  n => m => n + m
);

add(2) (3); // 5
add(2) (true); // throws
```
Please note that the optional names in function type signatures denoted by the `name ::` pattern are assigned to each lambda of the corresponding sequence. This is extremely helpful for debugging a codebase with hundreds of otherwise anonymous functions.

### Strict Function Call Arity

Except for variadic functions ftor is strict in the evaluation of function arities:

```Javascript
const add = Fun(
  "(add :: Number, Number -> Number)",
  (n, m) => n + m
);

add(2); // throws
add(2, 3, 4); // throws
```
### Higher Order Functions

In functional programming we want to pass functions around as first class citizens and treat them the same way as data:

```Javascript
const ap = Fun(
  "(ap :: (Number -> Number) -> Number -> Number)",
  f => n => f(n)
);

const inc = Fun(
  "(inc :: Number -> Number)",
  n => n + 1
);

const toStr = Fun(
  "(toStr :: Number -> String)",
  n => n + ""
);

const add = Fun(
  "(add :: Number -> Number -> Number)",
  n => m => n + m
);

ap(inc) (2); // 3
ap(toStr) (2); // throws
ap(add) (2); // throws
```
ftor always attempts to eagerly catch type errors and consequently checks the type of function arguments at the time of passing them to higher order functions, instead of waiting until they are finally called:

```Javascript
ap(toStr); // throws
ap(add); // throws
```
### Nullary Functions / Thunks

Sometimes thunks are needed to evaluate an expression lazily:

```Javascript
const thunk = Fun("(() -> String)", () => "foo" + "bar");

thunk(); // "foobar"
thunk("foo"); // throws
```
### Parametric Polymorphic Functions

So far we've merely addressed somehow boring, monomorphic functions. Let's get to polymorphic ones.

#### First Order

Parametric polymorphic functions accept values of any type:

```Javascript
const id = Fun("(id :: a -> a)", x => x);

id(2); // 2
id("foo"); // "foo"
id(true); // true

const first = Fun(
  "(first :: a -> a -> a)",
  x => y => x
);

first(2) (3); // 2
first("foo") ("bar"; // "foo"
first(true) (false); // true
```
#### Parametricity

Parametric polymorphism has a nice property called <a href="https://en.wikipedia.org/wiki/Parametricity">parametricity</a>, which imposes that a function must not know anything about the types of its arguments or return value. Here is a function that violates this principle:

```Javascript
const append = Fun(
  "(append :: a -> a -> a)",
  x => y => {
    switch (typeof x) {
      case "string":
      case "number": return x + y;
      case "boolean": return x && y;
      default: return null;
    }
  }
);

append(2) (3); // 5
append("2") ("3"); // "23"
append(2) ("3"); // throws
append({}) ({}); // throws
```
Without parametricity we lose the ability to deduce or at least narrow down a function's behavior just from its type signature. Since ftor isn't a static type checker it cannot preclude such implementations.

#### Higher Order

Parametric polymorphic higher order functions are applicable to many types and thus quite flexible. Here is a generic applicator:

```Javascript
const ap = Fun(
  "(ap :: (a -> b) -> a -> b)",
  f => x => f(x)
);

const ap_ = Fun(
  "(ap :: (a -> a) -> a -> a)",
  f => x => f(x)
);

const id = F.Fun("(id :: a -> a)", n => n);

const inc = F.Fun(
  "(inc :: Number -> Number)",
  n => n + 1
);

const toStr = F.Fun(
  "(toStr :: Number -> String)",
  n => n + ""
);

ap(inc) (2); // 3
ap(toStr) (2); // "2"

ap_(inc) (2); // 3
ap_(toStr) (2); // throws

ap(id) (2); // 2
ap(id) ("foo"); // "foo"
```
### Abstraction over Arity

...

### Overloaded Functions

...