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

Version 0.9.0 is coming...

**Please note:** This repo is experimental and still work in progress.
<br><br>

## What

ftor enables ML-like type-directed, functional programming in Javascript and offers useful debugging tools.

## Why

Functional programming in Javascript is frustrating as soon as you leave contrieved examples behind and try to solve real world problems, because...

* beyond first class functions Javascript doesn't offer much on a native level
* there is only a relatively small ecosystem and an insufficient tooling
* there is no type system preventing you from writing bad algorithms

# Type System

At its core ftor consists of a run-time type system with the following features:

* pluggable type system
* parametric polymorphism
* higher kinded types
* higher rank types (rank-2)
* recursive types
* homogeneous arrays, tuples, maps, records
* and real tagged unions

The type system can be switched on and off at run-time. Ideally, it is activated during the development stage and switched off on the production system.

Since we're still dealing with Javascript ftor pursues a <a href="https://eschew.wordpress.com/2009/08/31/sound-and-complete/">complete and hence unsound evaluation procedure</a>, which is mostly <a href="https://en.wikipedia.org/wiki/Nominal_type_system">nominal typed</a>. It incorporates Javascript's native types in order to allow the creation of idiomatic code. This is of course a tradeoff that is at the expense of type safety.

Unfortunately, there is no way to enable bounded polymorphism within a pluggable run-time type system without an additional compiling step. For the time being ftor will provide bounded polymorphism merely through explict type dictionary passing.

As opposed to _flow_ and _typescript_ ftor doesn't support subtype polymorphism, because it entails high complexity, such as different forms of type variance, e.g. <a href="https://flow.org/blog/2016/10/04/Property-Variance/">property variance</a> and it has irritating properties like <a href="https://brianmckenna.org/blog/row_polymorphism_isnt_subtyping">automatic upcasting</a>. Instead of subtyping ftor offers bounded structural typing, which has similar characteristics.

Let's get to the individual types without any further ado.

## Function Type

You can easily create typed functions with the `Fun` constructor both as a declaration statement or inline as a declaration expression. It takes a mandatory type signature and an arrow - that's all. While explicit type signatures might be laborious at first, you will appreciate their self-documenting character.

ftor's type signatures deviate from Haskell's, though. An important difference are the parentheses, which have to enclose every function signature:

```Javascript
// typed function declaration statement
const listenTo = Fun(
  "(listenTo :: String -> String)",
  s => s.split("").reverse().join("")
);

listenTo("emerpus evol a"); // "a love supreme"

// typed function declaration expression
Fun(
  "(String -> String)",
  s => s.split("").reverse().join("")
) ("emerpus evol a"); // "a love supreme"
```

### Multi-Argument Functions

As usual, you can define multi-argument functions. Please note that arguments are not enclosed by parentheses in type signatures:

```Javascript
const add = Fun(
  "(add :: (Number, Number -> Number)",
  (n, m) => n + m
);

add(2, 3); // 5
add(2, true); // throws
```
### Variadic Functions

You can define variadic functions using the rest parameter:

```Javascript
const sum = Fun(
  "(sum :: (...Number -> Number)",
  (...ns) => ns.reduce((acc, n) => acc + n, 0)
);

sum(); // 0
sum(1, 2, 3); // 6
sum(1, "2"); // throws
```
And variadic functions with mandatory arguments as well:

```Javascript
const sum = Fun(
  "(sum :: (Number, ...Number -> Number)",
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
  "(add :: (Number -> Number -> Number)",
  n => m => n + m
);

add(2) (3); // 5
add(2) (true); // throws
```
Please note that the optional names in function type signatures denoted by the `name ::` pattern are assigned to each lambda of the corresponding sequence. This is extremely helpful for debugging a code base with hundreds of such curried functions.

### Higher Order Functions

...

### Polymorphic HOFs

...

### Nullary Functions

...