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

Version 0.9.12 (under construction)

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

## Differences to _Flow_ and _TypeScript_

ftor...

* is a runtime type checker that cannot provide the same soundness as static type checkers can do
* focuses on parametric and row polymorphism<sup>1</sup> and consequently doesn't support subtyping
* relies on nominal typing<sup>2</sup> rather than structural
* is created to facilitate purely functional programming

<sub><sup>1</sup>also known as static duck typing</sub><br>
<sub><sup>2</sup>Nominal typing means that types are distinguished by name rather than by structure</sub>

## Upcoming Milestones

- [x] standalone unification algorithm (Hindley-Milner)
- [x] incorporate unification into the type checker
- [ ] revise homogeneous Array type
- [ ] revise homogeneous Map type
- [ ] revise Tuple type
- [ ] revise Record type
- [ ] revise Algebraic data types
- [ ] introduce row polymorphism
- [ ] incorporate Promise type
- [ ] incorporate Iterator/Generator types
- [ ] explore a special effect type / corresponding runtime
- [ ] add higher-rank types
- [ ] add kind system
- [ ] add higher kinded types

## Pluggable

ftor doesn't have a compiler that erases type information from your code base during compilation. Instead your code remains as-is and you can simply disable the type system when you don't need it anymore. To ensure good performance, the type checker is designed to have a small footprint as soon as it is not enabled.

You may be worried now that your packages become bloated with useless additional information. However, most of it consists of type annotations whose self-documenting character you will probably appriciate quickly.

Enabling the type checker is as easy as setting a flag:

```Javascript
import * as F from ".../ftor.js";

// untyped area

F.type(true);

// typed area;
```
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
Please note that the name portion in the signature is optional and used to name the corresponding anonymous function during debugging.

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

But wait, what about readability?

Often people have this specific syntax in mind, when they raise this objection:

```Javascript
const add = Fun(
  "(add :: Number -> Number -> Number)",
  n => m => n + m
);

add(2) (3); // 5
```
Syntax is just a matter of habit, though. It is much more important that currying entails great benefits like partial application and abstraction over arity. Beyond that it greatly simplyfies the design of the type checker.

And what about performance?

If you are really concerned about performance and micro optimizations rather than code reuse, productivity and more bug-free programs you should prefer imperative algorithms and mutations anyway. _Flow_ or _TypeScript_ are more suitable in this case.

One of the most annoying aspects of working with functions are anonymous functions during debugging. ftor automatically assigns the optional name portion of the type signature to each subsequent lambda:

```Javascript
const add = Fun(
  "(add :: Number -> Number -> Number)",
  n => m => n + m
);

add(2).name; // "add"
```
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
add(2); // 3
add(2, 3); // arity error
```
### Nullary Functions / Thunks

You can explicitly express lazyness with thunks:

```Javascript
const thunk = Fun("(() -> String)", () => "foo" + "bar");

thunk(); // "foobar"
thunk("foo"); // arity error
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
```
### Abstraction over Arity

When both a higher order function type signature and the signature of its function argument ends with a type variable the arity of the function argument doesn't matter anymore:

```Javascript
const ap = Fun(
  "(ap :: (a -> b) -> a -> b)", // function argument (a -> b) is unary
  f => x => f(x)
);

const add = Fun(
  "(add :: Number -> Number -> Number)", // binary function
  n => m => n + m
);

ap(add) (2) (3); // 5
ap(ap(add) (2)) (3); // 5
```
Now `ap` can be applied to curried functions of arbitrary arity. This property of functions in curried form is called abstraction over arity. It is most useful with function composition:

```Javascript
const comp = Fun(
  "(comp :: (b -> c) -> (a -> b) -> a -> c)",
  f => g => x => f(g(x))
);

const inc = F.Fun(
  "(inc :: Number -> Number)",
  n => n + 1
);

const add = Fun(
  "(add :: Number -> Number -> Number)", // binary function
  n => m => n + m
);

comp(add(2)) (inc) (3); // 6
comp(add) (inc) (2) (3); // 6
```
Abstraction over arity is not always possible, though:

```Javascript
comp(inc) (add) (2) (3); // throws
comp(inc) (add(2)) (3); // 6
```
But with functional combinators there is always a more or less obvious workaround:

```Javascript
...
```
### Bounded Polymorphic Functions

...