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

Version 0.9.13 (under construction)

**Please note:** This repo is experimental and still work in progress.
<br><br>

## What

ftor enables ML-like type-directed, functional programming with Javascript including reasonable debugging. In essence, it consists of a runtime type system and a functional programming library building upon it.

## Why

Functional programming in Javascript is frustrating as soon as you face real world problems, because...

* there is no type system preventing you from writing poor programs
* there is no type evaluation, which can tell you your data types at any point of your program
* there is no mechanism to impose purity but side effects can be performed everywhere
* there is no effect type to represent effects as first class values
* there is no runtime that executes effects and does the plumbing with the real world
* there are no decent debugging tools for programs written in the sense of the functional paradigm
* there are no union types to model the world with alternatives instead of hierarchies

## Differences to Flow and TypeScript

* ftor is a runtime type checker that cannot provide the same soundness as static type checkers can do
* it focuses on parametric and row polymorphism<sup>1</sup> and consequently doesn't support subtyping
* it relies on nominal typing<sup>2</sup> rather than structural
* it is created to facilitate purely functional programming

<sub><sup>1</sup>also known as static duck typing</sub><br>
<sub><sup>2</sup>Nominal typing means that types are distinguished by name rather than by structure</sub>

## Pluggable

ftor doesn't have a compiler that erases type information from your code base during compilation. Instead your code remains as-is and you can simply disable the type system when you don't need it anymore. To ensure good performance, the type checker is designed to have a small footprint as soon as it is not enabled.

You may be worried now that your packages become bloated with useless additional information. However, most of this extra bytes consists of type annotations whose self-documenting character you will probably appriciate quickly.

Enabling the type checker is as easy as setting a flag:

```Javascript
import * as F from ".../ftor.js";

// untyped area

F.type(true);

// typed area;
```
## Upcoming Milestones

- [x] standalone unification algorithm (Hindley-Milner)
- [x] incorporate unification into the type checker
- [x] add homogeneous Array type
- [ ] add homogeneous Map type
- [ ] add Tuple type
- [ ] add Record type
- [ ] add Algebraic data types
- [ ] incorporate row polymorphism
- [ ] add Promise type
- [ ] add Iterator/Generator types
- [ ] add higher-rank types
- [ ] incorporate kind system
- [ ] add higher kinded types
- [ ] incorporate a special effect type / corresponding runtime
- [ ] add persistant data structures
- [ ] provide common combinators and functional patterns

# Types

Let's get to the extended types without any further ado.

## Function Type

You can easily create typed functions with the `Fun` constructor. It takes a mandatory type signature and an arrow function - that's all:

```Javascript
const inc = Fun(
  "(inc :: Number -> Number)",
  n => n + 1
);

inc(2); // 3
```
Please note that the name portion (`inc :: `) in the signature is optional and used to name the corresponding anonymous function during debugging.

### Meaningful Error Messages

Verbose error messages provide a better debugging experience:

```Javascript
const inc = Fun(
  "(inc :: Number -> Number)",
  n => n + 1
);

inc(true); // throws the following type error

Uncaught TypeError: inc expects

(inc :: Number -> Number)
        ^^^^^^

Boolean received


    at _throw (<anonymous>:3541:9)
    at verifyArgT (<anonymous>:1884:34)
    at Object.apply (<anonymous>:1680:22)
    at <anonymous>:1:1
```
### Curried Functions

ftor doesn't support multi-argument functions but only functions in curried form, that is sequences with exactly one argument per call.

Currying leads to lots of partially applied anonymous functions throughout the code. One of the most annoying aspects of working with such anonymous functions in Javascript consists in debugging them. ftor automatically assigns the name portion of type signatures to each subsequent lambda:

```Javascript
const add = Fun(
  "(add :: Number -> Number -> Number)",
  n => m => n + m
);

add(2).name; // "add"
```
#### Readability

A lot of people are concerned about the readability of the typical call pattern (`fun(x) (y) (z)`) that arises from curried functions. It is considered less readable than calling multi argument functions (`fun(x, y, z)`).

Syntax is just a matter of habit, though. It is much more important that currying entails great benefits like partial application and abstraction over arity. Moreover it greatly simplyfies the design of the type checker.

#### Performance

If you are concerned about performance and micro optimizations rather than code reuse, productivity and more robust programs you should prefer imperative algorithms and mutations anyway. _Flow_ or _TypeScript_ are more suitable in this case.

### Variadic Functions

You can define variadic functions by using the rest parameter:

```Javascript
const sum = Fun(
  "(sum :: ...Number -> Number)",
  (...ns) => ns.reduce((acc, n) => acc + n, 0)
);

sum(); // 0
sum(1, 2, 3); // 6
sum(1, "2"); // type error
```
### Strict Function Call Arity

ftor handles function arities strictly:

```Javascript
const inc = Fun(
  "(inc :: Number -> Number)",
  n => n + 1
);

inc(); // arity error
inc(2); // 3
inc(2, 3); // arity error
```
### Nullary Functions / Thunks

You can explicitly express lazyness with thunks:

```Javascript
const thunk = Fun("(() -> String)", () => "foo" + "bar");

thunk(); // "foobar"
thunk("baz"); // arity error
```
### Higher Order Functions

Let's treat functions the same way as data.

#### Monomorphic

Here is a somewhat silly monomorphic applicator just to illustrate the principle:

```Javascript
const ap = Fun(
  "(ap :: (Number -> Number) -> Number -> Number)",
  f => n => f(n)
);

const inc = Fun(
  "(inc :: Number -> Number)",
  n => n + 1
);

ap(inc) (2); // 3
ap(inc) ("2"); // type error
```
The type checker immediately evaluates partially applied functions and is therefore able to throw type errors eagerly:

```Javascript
const ap = Fun(
  "(ap :: (Number -> Number) -> Number -> Number)",
  f => n => f(n)
);

const toUC = Fun(
  "(toUC :: String -> String)",
  s => s.toUpperCase()
);

ap(toUC); // type error
```
#### Polymorphic

Here is the applicator as a parametric polymorphic higher order function:

```Javascript
const ap = Fun(
  "(ap :: (a -> b) -> a -> b)",
  f => x => f(x)
);

const inc = Fun(
  "(inc :: Number -> Number)",
  n => n + 1
);

const toUC = Fun(
  "(toUC :: String -> String)",
  s => s.toUpperCase()
);

const show = Fun(
  "(show :: a -> String)",
  x => String(x)
);

ap(inc) (2); // 3
ap(inc) ("2"); // type error
ap(toUC) ("foo"); // "FOO"
ap(show) (true); // "true"
```
`a` and `b` are type variables, that is they can be substituted with any type. They can, but do not have to be of different type.

### Abstraction over Arity

If the return type of an higher order function is a type variable, it can abstract over the arity of the passed function argument:

```Javascript
const ap = Fun(
  "(ap :: (a -> b) -> a -> b)",
  f => x => f(x)
);

const add = Fun(
  "(add :: Number -> Number -> Number)",
  n => m => n + m
);

ap(add) (2) (3); // 5
ap(ap(add) (2)) (3); // 5
```
Even though the applicator `ap` merely accepts unary functions it can handle functions argument of arbitrary arity. This property is called abstraction over arity and is one of the nice qualities of curried functions.

### Type Hints

...

### Parametricity

<a href="https://en.wikipedia.org/wiki/Parametricity">Parametricity</a> is a property of parametric polymorphism that prevents polymorphic functions from knowing anything about the types of their arguments or return values. In return you get the ability to deduce or at least narrow down a function's behavior just from its type signature. To enfoce parametricity a type checker must analyze your entire code at compile time. Since ftor isn't a static type checker it can't preclude polymorphic functions that violate the parametricity property:

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
append(true) (false); // false
append({}) ({}); // type error
```