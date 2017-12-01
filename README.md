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

Version 0.9.11 (unstable)

**Please note:** This repo is broken and currently under construction.
<br><br>

## What

ftor enables ML-like type-directed, functional programming with Javascript including reasonable debugging. In essence it includes a type system and a functional programming library building upon it.

## Why

Functional programming in Javascript is cumbersome as soon as you leave contrieved examples behind and try to solve real world problems, because...

* there is no type system preventing us from writing poor code and algorithms
* there is no built-in mechanism to separate evaluation from execution and thus to impose purity
* there are no decent debugging tools for programs with a great deal of lambdas
* there is no union type to model the world with alternatives instead of hierarchies

## Milestones

[x] standalone unification algorithm (Hindley-Milner)
[ ] incorporate unification into the type checker
[ ] revise homogeneous Array type
[ ] revise homogeneous Map type
[ ] revise Tuple type
[ ] revise Record type
[ ] revise Algebraic data types
[ ] introduce row polymorphism
[ ] incorporate Promise type
[ ] incorporate Iterator/Generator types
[ ] explore a special effect data type
[ ] add higher-rank types
[ ] add kind system
[ ] add higher kinded types

## Differences to _Flow_/_TypeScrip_

ftor...

* is a run-time type checker that cannot provide the same soundness as static type systems can do
* focuses on parametric and row polymorphism<sup>1</sup> and thus doesn't support subtyping
* pursues a nominal typing strategy, because this kind of typing is more sound than structural typing<sup>2</sup>
* strongly relies on the functional paradigm

<sup>1</sup><sub>also known as static duck typing</sub>
<sup>2</sup><sub>Nominal typing means that types are distinguished by name rather than by structure</sub>

## Pluggable

ftor doesn't ship with a compiler that removes the typing information from your code base. Instead your code remains as-is and the type system is merely disabled as soon as you're done with the development stage. To ensure good performance, ftor is designed to have the smallest possible footprint when it is not active.

You may now be worried that your packages are bloated with useless type logic. However, most of the additional logic consists of type annotations, which have a self-documenting character. So the extra bytes are worth it.

While ftor's API supports you in not creating dependencies to the type system, it cannot prevent you from doing so. So please keep an eye on that.

You can incorporate the type checker infinitely variable into your program. It goes without saying that the more portions of your program are typed, the more type safety you can get.

When you import ftor the type checker is disabled by default and you have to enable it explicitly:

```Javascript
import * as F from ".../ftor.js";

// untyped area

F.typify(true);

// typed area;
```
## Bounded Polymorphism and Type Classes

Bounded polymorphism is the ability of a type system to define constraints on polymorphic types without having to pass the corresponding type classes explicitly around throughout the codebase. Most statically typed languages like Haskell or Scala resolve type class dependencies at compilte time. ftor doesn't have compile-time but erases all type information as soon as it is disabled. Hence there is no way to handle type classes without creating dependencies to the extended type system.

As a matter of fact the only option left is to conduct explicit dictionary passing - and that's how we do it.

# Types

Let's get to the types without any further ado.

## Function Type

You can easily create typed functions with the `Fun` constructor wherever an expression is allowed. It takes a mandatory type signature and an arrow - that's all. While explicit type signatures might be laborious at first, you will appreciate their self-documenting character.

ftor's type signatures deviate from Haskell's, though. An important difference are the parentheses, which have to enclose every function signature:

```Javascript
const inc = Fun(
  "(inc :: Number -> Number)",
  n => n + 1
);

inc(2); // 3
```
In contrast to Haskell the name portion in the type signature doesn't declare the name of the variable but is optional and provides a useful name for debugging purposes:

```Javascript
const inc = Fun(
  "(Number -> Number)",
  n => n + 1
);

inc(2); // 3
```
### Meaningful Error Messages

Extensive error messages provide a better debugging experience:

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

### Nullary Functions / Thunks

Sometimes thunks are needed to evaluate an expression lazily:

```Javascript
const thunk = Fun("(() -> String)", () => "foo" + "bar");

thunk(); // "foobar"
thunk("foo"); // throws
```
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