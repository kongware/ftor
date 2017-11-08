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

Version 0.9.0 (unstable)

**Please note:** This repo is experimental and still work in progress.
<br><br>

## What

ftor enables ML-like type-directed, functional programming in Javascript including useful debugging features.

## Why

Functional programming in Javascript is frustrating as soon as you leave contrieved examples behind and try to solve real world problems, because...

* beyond first class functions Javascript doesn't offer much on a native level
* there is only a relatively small ecosystem and an insufficient tooling
* there is no type system preventing you from writing bad algorithms

# Type System

At its core ftor consists of a run-time type system with the following features:

* pluggable type checker
* parametric polymorphism
* bounded (aka ad-hoc) polymorphism
* higher kinded types
* higher rank types (rank-2)
* recursive types
* homogeneous arrays, tuples, maps, records
* and real tagged unions

The type system can be de-/activated at run-time. Ideally, it is activated during the development stage and disabled on the production system.

Since we're still dealing with Javascript ftor pursues a <a href="https://eschew.wordpress.com/2009/08/31/sound-and-complete/">complete and hence unsound evaluation procedure</a>, which is mostly <a href="https://en.wikipedia.org/wiki/Nominal_type_system">nominal typed</a>. It incorporates Javascript's native types in order to allow the development of idiomatic code. This is of course a tradeoff between coding habits and type safety.

An import principle of dynamic type systems is to detect type errors as early as possible. While this can be done to a certain degree, dynamic type systems never can give a guarantee that a program is free of type errors like static systems can do. They are a supplement to unit tests, not a substitute.

You may wonder why ftor doesn't ship with type classes. Unfortunately, there is no way to enable bounded polymorphism along with a pluggable run-time type system without using a pre-compiler. As soon as we disable the type system the capability to retrieve the right type class for a given type is also lost. For this reason ftor will provide bounded polymorphism merely through explict type dictionary passing and includes a mechanism to enforce overloaded functions at the type level.

As opposed to _Flow_ and _TypeScript_ ftor doesn't support subtype polymorphism, because it entails high complexity, such as different forms of type variance, e.g. <a href="https://flow.org/blog/2016/10/04/Property-Variance/">property variance</a> and it has irritating properties like <a href="https://brianmckenna.org/blog/row_polymorphism_isnt_subtyping">automatic upcasting</a>. Instead of subtyping ftor offers bounded structural typing, which has similar characteristics but without the drawbacks.

Let's get to the individual types without any further ado.

## Function Type

You can easily create typed functions with the `Fun` constructor both as a declaration or inline as an expression. It takes a mandatory type signature and an arrow - that's all. While explicit type signatures might be laborious at first, you will appreciate their self-documenting character.

ftor's type signatures deviate from Haskell's, though. An important difference are the parentheses, which have to enclose every function signature:

```Javascript
// typed function declaration
const listenTo = Fun(
  "(listenTo :: String -> String)",
  s => s.split("").reverse().join("")
);

listenTo("emerpus evol a"); // "a love supreme"

// typed function expression
Fun("(String -> String)", s => s.split("").reverse().join(""))
  ("emerpus evol a"); // "a love supreme"
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

As functional programmers we often prefer defining curried function sequences:

```Javascript
const add = Fun(
  "(add :: Number -> Number -> Number)",
  n => m => n + m
);

add(2) (3); // 5
add(2) (true); // throws
```
Please note that the optional names in function type signatures denoted by the `name ::` pattern are assigned to each lambda of the corresponding sequence. This is extremely helpful for debugging a code base with hundreds of such functions.

### Strict Function Call Arity

Except for variadic functions ftor is strict in the evaluation of function's arities:

```Javascript
const add = Fun(
  "(add :: Number, Number -> Number)",
  (n, m) => n + m
);

add(2); // throws
add(2, 3, 4); // throws
```
### Higher Order Functions

Functions are just data that can be passed around:

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
ftor always attempts to eagerly throw type errors. Instead of waiting which type `toStr` and `add` will eventually return, ftor statically checks the function arguments and may terminate the program prematurely:

```Javascript
ap(toStr); // throws
ap(add); // throws
```
### Polymorphic HOFs

...

### Abstraction over Arity

...

### Nullary Functions / Thunks

...

### Overloaded functions

...