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

Version 0.9.20 (under construction)

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
* it focuses on parametric and row polymorphism<sup>1</sup> and doesn't support subtyping
* it mainly relies on nominal instead of structural typing<sup>2</sup>
* it is designed to facilitate purely functional programming

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

I am currently working on adding unit tests.

- [x] incorporate parametric polymorphism
- [x] add homogeneous Array type
- [x] add homogeneous Map type
- [x] add Tuple type
- [x] add Record type
- [x] add Algebraic data types
- [x] incorporate row polymorphism
- [x] add rank-2 types
- [ ] add unit tests
- [ ] add Promise type
- [ ] add Iterator/Generator types
- [ ] add homogeneous Set type
- [ ] incorporate kind system/higher kinded types?
- [ ] incorporate a special effect type / corresponding runtime
- [ ] add persistant data structures
- [ ] provide common functional combinators/patterns

# Types

Let's get to the extended types without any further ado.

## Function Type

You can easily create typed functions with the `Fun` constructor. It takes a mandatory type signature and an arrow function - that's all:

```Javascript
const add = Fun(
  "(add :: Number -> Number -> Number)",
  m => n => m + n
);

add(2) (3); // 5
```
Please note that the name portion (`add :: `) in the signature is optional and used to give the corresponding anonymous function sequence a name.

### Pure Functions

ftor relies on functions being pure<sup>1</sup> but cannot enfoce this characteristic in Javascript. There will be a special data type in the near future, with which effects can be expressed in such a pure environment.

<sub><sup>1</sup>a function is pure if it is referential transparent</sub>

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

Otherwise, ftor handles function arities strictly:

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

You can explicitly express non-strict evaluation with thunks:

```Javascript
const thunk = Fun("(() -> String)", () => "foo" + "bar");

thunk(); // "foobar"
thunk("baz"); // arity error
```
### Parametric Polymorphic functions

ftor supports parametric polymorphism:

```Javascript
const k = Fun("
  "(k :: a -> b -> a)",
  x => y => x
");

const snd = Fun("
  "(fst :: a -> a -> a)",
  x => y => y
");

k(true) (false); // true
k("foo") ("bar"); // "foo"
k("foo") (123); // "foo"

snd(true) (false); // false
snd("foo") ("bar"); // "bar"
snd("foo") (123); // type error
```
`a` and `b` are type variables, that is they can be substituted with any type. They can, but do not have to be of different type:

### Higher Order Functions

Let's treat functions the same way as data. The following applicator helps to illustrate the underlying principle:

```Javascript
const ap = Fun(
  "(ap :: (a -> b) -> a -> b)",
  f => x => f(x)
);

const inc = Fun(
  "(inc :: Number -> Number)",
  n => n + 1
);

const toStr = Fun(
  "(toStr :: Number -> String)",
  n => String(n)
);

ap(inc) (2); // 3
ap(inc) ("2"); // type error

ap(toStr) (2); // "3"
ap(toStr) (true); // type error
```
The passed function argument itself can be polymorphic:

```Javascript
const ap = Fun(
  "(ap :: (a -> b) -> a -> b)",
  f => x => f(x)
);

const id = Fun(
  "(id :: a -> a)",
  x => x
);

const toArr = Fun(
  "(toArr :: a -> [a])",
  x => Arr([x]) // typed array
);

ap(id) ("foo"); // "foo"
ap(id) ([1, 2, 3]); // [1, 2, 3]

ap(toArr) (123); // [123]
ap(toArr) (true); // [true]
```
### Strict Evaluation

The type checker immediately evaluates partially applied functions and is therefore able to throw type errors eagerly:

```Javascript
const ap_ = Fun(
  "(ap_ :: (a -> a) -> a -> a)",
  f => x => f(x)
);

const inc = Fun(
  "(inc :: Number -> Number)",
  n => n + 1
);

const add = Fun(
  "(add :: Number -> Number -> Number)",
  m => n => m + n
);

const toArr = Fun(
  "(toArr :: a -> [a])",
  x => Arr([x]) // typed array
);

ap_(inc); // passes
ap_(add); // type error
ap_(toArr); // type error
```
### Abstraction over Arity

If the type signature of an higher order function returns a type variable, this means it can return any type thus also another function. As a result such higher order function types can abstract over the passed function argument's arity:

```Javascript
const ap = Fun(
  "(ap :: (a -> b) -> a -> b)",
  f => x => f(x)
);

const add = Fun(
  "(add :: Number -> Number -> Number)",
  n => m => n + m
);

const k = Fun(
  "(k :: a -> b -> a)",
  x => y => x
);

ap(add) (2) (3); // 5
ap(k) ("foo") ("bar"); // "foo"
```
Even though `ap` merely accepts unary functions it can handle function arguments of arbitrary arity.

### Type Hints

As soon as you combine monomorphic and polymorphic curried functions in various ways, you quickly lose track of the partial applied function's intermediate types:

```Javascript
const comp = Fun(
  "(comp :: (b -> c) -> (a -> b) -> a -> c)",
  f => g => x => f(g(x))
);

const inc = Fun(
  "(inc :: Number -> Number)",
  n => n + 1
);

comp(inc); // ?
```
This is still a trivial case but it may not be so easy to solve for someone unfamiliar with the functional paradigm. Let's ask ftor for help:

```Javascript
comp(inc) [TS]; // "(comp :: (a -> Number) -> a -> Number)"
```
Just use the `TS` Symbol to access the current type signature of a typed function. Let's look at a more complex example:

```Javascript
const comp = Fun(
  "(comp :: (b -> c) -> (a -> b) -> a -> c)",
  f => g => x => f(g(x))
);

const compx = comp(comp),
  compy = comp(comp) (comp);

compx[TS]; // "(comp :: (a -> b0 -> c0) -> a -> (a0 -> b0) -> a0 -> c0)"
compy[TS]; // "(comp :: (b1 -> c1) -> (a0 -> a1 -> b1) -> a0 -> a1 -> c1)"
```
You can derive from the type signatures that `compx` takes a binary function, a value, an unary function and another value, whereas `compy` takes an unary and then a binary function and two values. As a matter of fact `compy` is a pretty useful function, since it allows us to use a binary function as the inner one of the composition.

Instead of examining implementations we can stick with type signatures to comprehend complex function expressions. By leaving implementation details behind, we've reached another level of abstraction and ftor helps us to keep track of the right types.

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
Ultimately, it is your responsibility to avoid such functions.

## Array Type

### Construction

You can create typed arrays with the `Arr` constructor. Unlike `Fun` you don't have to provide an explicit type signature but let the type checker introspect the type for you:

```Javascript
const append = Fun(
  "([a] -> [a] -> [a])",
  xs => ys => Arr(xs.concat(ys))
);

const xs = Arr([1, 2]),
  ys = Arr([3, 4]);

xs[TS]; // "[Number]"

append(xs) (ys); // [1, 2, 3, 4]
```
Please note that the type of an empty typed array is polymorphic: `[a]`.

### Homogeneity

Typed arrays must be homogeneous, that is all element values must be of the same type.

```Javascript
const append = Fun(
  "([a] -> [a] -> [a])",
  xs => ys => Arr(xs.concat(ys))
);

const xs = Arr([1, 2]),
  ys = Arr([3, 4]),
  zs = Arr([true, false]);

xs[TS]; // "[Number]"
zs[TS]; // "[Boolean]"

append(xs) (ys); // [1, 2, 3, 4]
append(xs) (zs); // type error

xs[0] = true; // type error
zs[0] = "foo"; // type error
```
### Index Gaps

ftor prevents gaps within the indices of typed arrays:

```Javascript
const xs = Arr([1, 2, 3]),
  ys = Array(3);

delete xs[1]; // type error

ys[0] = 1, ys[1] = 2;
Arr(ys); // type error
```
### Void Elements

Typed arrays must not contain element values of type void (`undefined`/`NaN`):

```Javascript
const xs = Arr([undefined]), // type error
  ys = Arr([1, NaN, 3]); // type error
```
### Duck Typing / Meta Programming

You must not perform duck typing or meta programming on typed arrays, because in a typed language you should know your types at any point in your code:

```Javascript
const xs = Arr([1, 2, 3, 4]),
  x = xs[10]; // type error (illegal duck typing)
  
Object.keys(xs); // type error (illegal meta programming)
```
More generally, you shouldn't use typed arrays as plain old Javascript Objects, but solely as arrays with numerical indices.

### Type Coercion

ftor prevents implicit type conversions wherever possible:

```Javascript
const xs = Arr([1, 2, 3, 4]),
  s = xs + "!"; // type error
```
Use explicit type casts instead.

### Immutability

Even though mutations are restricted, typed arrays are not fully immutable. There will be immutable data types in ftor as soon as I am able to incorporate reliable and fast persistant data structures into Javascript and the type checker. I highly recommend to avoid globally visible mutations whenever possible, though.