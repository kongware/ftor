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

Version 0.9.7 (unstable)

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

At its core ftor consists of a run-time type system with the following features:

* pluggable type checker
* parametric polymorphism
* bounded polymorphism (without type classes)
* higher kinded types
* higher rank types (rank-2)
* recursive types
* homogeneous arrays, tuples, maps, records
* and real tagged unions

The type system can be de-/activated at run-time. Ideally, it is activated during the development stage and disabled on the production system.

Since we're still dealing with Javascript ftor pursues a <a href="https://eschew.wordpress.com/2009/08/31/sound-and-complete/">complete and hence unsound evaluation procedure</a>, which is mostly <a href="https://en.wikipedia.org/wiki/Nominal_type_system">nominal typed</a>. It incorporates Javascript's native types in order to allow developers to express idiomatic code. This is of course a tradeoff between coding habits and type safety.

An import principle of dynamic type systems is to detect type errors as early as possible. While this can be done to a certain degree, dynamic type systems never can give a guarantee that a program is free of type errors like static systems can do. They are a supplement to unit tests, not a substitute.

Although ftor leans towards the ML-family it doesn't support bounded polymorphism through type classes. This is for a good reason. As soon as the type system is disabled, all the type information is erased and thus also the association between types and their corresponding type classes. The only way to bypass this would be to introduce a compiling step to replaced type class annotations with real type dictionaries. That wouldn't make much sense in context of a dynamic type system though. Instead, ftor supports bounded polymorphism through explicit type dictionaries and overloaed function names, which are enforced at the type level.

As opposed to _Flow_ and _TypeScript_ ftor doesn't support subtype polymorphism, because it entails high complexity, such as different forms of type variance, e.g. <a href="https://flow.org/blog/2016/10/04/Property-Variance/">property variance</a> and it has irritating properties like <a href="https://brianmckenna.org/blog/row_polymorphism_isnt_subtyping">automatic upcasting</a>. As a result ftor only sticks to a single subsumption rule resulting from the subtype relation between `a -> b` and `a -> a`.

As already mentioned ftor imposes mostly nominal types. In connection with records structural typing takes place as well. A record type acts like a bounded polymorphic type, where the constraint consists of the properties listed in the type. That means a structural bounded record shares common properties instead of overloaed functions.

Let's get to the individual types without any further ado.

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
ftor always attempts to eagerly throw type errors. Instead of waiting which type `toStr` and `add` will eventually return, ftor statically checks the function argument's parameters and may terminate the program prematurely:

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

Parametric polymorphic functions accept values of any type, as they only work with non-polymorphic properties:

```Javascript
const id = Fun("(id :: a -> a)", x => x);

id(2); // 2
id("foo"); // "foo"
id(true); // true

const toArray = Fun(
  "(toArray :: a -> [a])",
  x => [x]
);

toArray(2); // [2]
toArray("foo"); // ["foo"]
toArray(true); // [true]
```
#### Parametricity

Parametric polymorphism includes a property called <a href="https://en.wikipedia.org/wiki/Parametricity">parametricity</a>, which states that a function must not know anything about the types of its arguments or return value. Here is a function that violates parametricity:

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
At this point ftor's little secret is revealed, which it has been able to hide from us so far. Since the type checker doesn't statically check our code, it isn't capable of preventing us from writing such functions. Even though `append`'s type signature pretends to be a perfect, parametric polymorphic function, it isn't. Unfortunately, there is nothing I can do about it and maybe this behavior is even helpful to write idiomatic Javascript code in a safe manner. This calls for further experience.

As far as I know Javascript isn't particularly suitable for static type checking anyway. You can tell by the great difficulties _Flow_ has with type inference and refinements.

#### Higher Order

Polymorphic function types are most useful when they are part of a higher order function annotation:

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
A function passed to `ap` can be either mono- or polymorphic. If it is a monomorphic function the type variable `a` is bound to the domain of the function argument (`id` in the example above). If it is a polymorphic function the type of the second argument determines the type of `a` of the function argument (`id`). This means that `ap` as the caller chooses the ground type of `id` and when `id` is actually invoked inside the body of `ap`, it is already a monomorphic function.

### Abstraction over Arity

...

### Overloaded Functions

...