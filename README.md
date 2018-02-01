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

Version 0.9.20 (unstable)

**Please note:** This repo is experimental and still work in progress.
<br><br>

## What

ftor enables ML-like type-directed, functional programming with Javascript including reasonable debugging. In essence, it consists of a runtime type system and a functional programming library building upon it.

Due to it size there is a separated API [documentation](https://github.com/kongware/ftor/blob/master/LIBRARY.md) for the typed functional library.

## Unstable

ftor's type checker has great impact on the way you encode Javascript. It is in continuous flux in order to eventually achieve an optimal setting. Unfortunatelly, there are no benchmarks that I can follow, because this is somehow unexplored territory in Javascript.

## Why

Functional programming in Javascript is frustrating as soon as you face real world problems, because...

* there is no type system preventing you from writing poor programs
* there is no type evaluation, which can tell you your data types at any point of your program
* there is no mechanism to impose purity but side effects can be performed everywhere
* there is no effect type to represent effects as first class values
* there is no runtime that executes effects and does the plumbing with the real world
* there are no decent debugging tools for programs written in the sense of the functional paradigm
* there are no union types to model the world with alternatives instead of hierarchies

## Limitations of a Runtime Type Checker

As a runtime type checker ftor isn't able to analyze your code and infere the type of every single expression and statement automatically. Doing this for each and every request would certainly cause serious performance problems. Besides it is really hard if not impossible to reliably perform type inference for Javascript code.

A reasonable compromise is to focus on functions and their arguments and use Javascript's introspection capabilities. Apart from functions themselves, promises and iterators, argument values passed to functions usually can be easily introspected. For the rest we need explicit type annotations, though.

With the proposed approach we have to make sure that type signatures match their corresponding functions. For this reason ftor will provide a comprehensive library of typed functional combinators and patterns, which are guaranteed to match their signatures. Consumers of this library can focus on composing and combining these basic building blocks and ftor ensures that they keep track of their partially applied funcions' intermediate types. I think this is a sensible and practical approach.

## Differences to _Flow_ and _TypeScript_

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

// typed area;

F.type(false);

// untyped area
```
## Ad-hoc Polymorphism and Type Classes

Why isn't ftor shiped with type classes? Well, they are essentially a mechanism to allow type-safe function overloading. They make ad-hoc polymorphism less ad-hoc so to speak. Type classes are an extension of a type system and consequently depend on this system to work properly. Of course, this doesn't go well with a pluggable runtime type checker. I don't claim that it is impossible to build a sufficient mechanism, but it would probably be too much of a trade-off.

## Interoperability

Fantasy Land is based on type classes implemented through the prototype system. ftor neither supports methods that depend on `this` nor has it a type class mechanism. For that reason it cannot be compliant to the Fantasy Land spec.

## Native Type Support

Currently ftor neither supports iterators, generators nor promises. The former two are inherently stateful and hence not that functional, so I'll try to avoid them for the time being. If necessary, it should not be too difficult to type them, though. Promises on the other hand are very hard to type, because they are optimized for an untyped environment and contain a lof of magic to allow a convinient usage. Moreover, they conflate different tasks like asynchronous control flow and error handling. It is very likely that ftor won't support them ever, but will provide a wrapper to adapt promises to a purely functional Future type.

## Immutability

ftor restricts the ability of mutating data types rather than enforcing strict immutability. There will be proper immutable data types in ftor as soon as I am able to incorporate reliable and fast persistant data structures into Javascript and the type checker, though.

## Upcoming Milestones

For the time being there will be no type system extensions like higher kinded types or annotations for partially applied type constructors. First of all, the existing system has to mature. The current focus is on the construction of a type-safe set of pure functions and combinators, which rely on the existing type system.

- [x] incorporate parametric polymorphism
- [x] add homogeneous Array type
- [x] add homogeneous Map type
- [x] add Tuple type
- [x] add Record type
- [x] add Algebraic data types
- [x] incorporate row polymorphism
- [x] add rank-2 types
- [x] add unit tests
- [x] add separate documentation for the functional lib
- [ ] provide common functional combinators/patterns
- [ ] revise error messages and pretty printing
- [ ] incorporate kind system/higher kinded types
- [ ] extend type annotation by partially applied type constructors
- [ ] replace monolithic parser with functional parser combinators
- [ ] add homogeneous Set type
- [ ] incorporate a special effect type / corresponding runtime
- [ ] add persistant data structures

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
add(2) ("3"); // type error
```
Please note that the name portion (`add :: `) in the signature is optional and used to give the corresponding anonymous function sequence a name.

### Pure Functions

ftor relies on functions being pure<sup>1</sup> but cannot enfoce this characteristic in Javascript. There will be a special data type in the near future, with which effects can be expressed in such a pure environment.

<sub><sup>1</sup>a function is pure if it is referential transparent</sub>

### Curried Functions

ftor doesn't support multi-argument functions but only functions in curried form, that is sequences with exactly one argument per call.

Currying leads to lots of partially applied anonymous functions throughout the code. One of the most annoying aspects of working with such anonymous functions in Javascript consists in debugging them. For that reason ftor automatically assigns the name portion of type signatures to each subsequent lambda:

```Javascript
const add = Fun(
  "(add :: Number -> Number -> Number)",
  n => m => n + m
);

add(2).name; // "add"
```
#### Readability

A lot of people are concerned about the readability of the typical curry function call pattern (`fun(x) (y) (z)`). It is considered as less readable than calling multi-argument functions (`fun(x, y, z)`) and non-idiomatic in general.

I find the criticism exaggerated and above all emotionally motivated. It is much more important that currying entails great benefits like partial application and abstraction over arity. Moreover it greatly simplyfies the design of the type checker.

#### Performance

If you are concerned about performance and micro optimizations rather than code reuse, productivity and more robust programs you should prefer imperative algorithms and mutations anyway. _Flow_ or _TypeScript_ are more suitable in this case.

#### Pseudo Multi-Argument Functions

You can, however, utilize variadic functions using the rest parameter and destructuring assignment to mimic multi-argument functions:

```Javascript
const repeatStr = Fun(
  "(repeatStr :: ...[String, Number] -> String)",
  (...[s, n]) => Array(n + 1).join(s)
);

repeatStr("x", 3); // "xxx"
```
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
### Strict Function Call Arity

ftor handles function call arities strictly:

```Javascript
const inc = Fun(
  "(inc :: Number -> Number)",
  n => n + 1
);

inc(); // arity error
inc(2); // 3
inc(2, 3); // arity error
```
### Variadic Functions

You can define variadic functions using the rest parameter:

```Javascript
const sum = Fun(
  "(sum :: ...[Number] -> Number)",
  (...ns) => ns.reduce((acc, n) => acc + n, 0)
);

sum(); // 0
sum(1, 2, 3); // 6
sum(1, "2"); // type error
```
Usually the rest parameter constructs an homogeneous array. As mentioned in the curried function section you can also let it construct a tuple if you want to mimic multi-argument functions.

### Nullary Functions / Thunks

You can explicitly express non-strict evaluation with thunks:

```Javascript
const thunk = Fun("(() -> String)", () => "foo" + "bar");

thunk(); // "foobar"
thunk("baz"); // arity error
```
### Parametric Polymorphic Functions

ftor supports parametric polymorphism:

```Javascript
const k = Fun(
  "(k :: a -> b -> a)",
  x => y => x
);

const snd = Fun(
  "(snd :: a -> a -> a)",
  x => y => y
);

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

### Parametricity

<a href="https://en.wikipedia.org/wiki/Parametricity">Parametricity</a> is a property of parametric polymorphism that prevents polymorphic functions from knowing anything about the types of their arguments or return values. In return you get the ability to deduce or at least narrow down a function's behavior just from its type signature. To enforce parametricity a type checker must analyze your entire code at compile time. Since ftor isn't a static type checker it can't preclude polymorphic functions that violate this property:

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
append({}) ({}); // type error (returns null instead of {})
```
As with purity it is ultimately your responsibility to maintain this property.

### Expressiveness

I think that fixed-point combinators and anonymous recursion are good candidates for testing the expressiveness of a type system. I chose the simplified version of the `Y` combinator for this practice and since Javascript is a strictly evaluated language, I have to implement the eta-expanded version:

```Javascript
const fix = Fun(
  "(fix :: ((a -> b) -> a -> b) -> a -> b)",
  f => x => f(fix(f)) (x)
);

const fact = fix(Fun(
  "(fact :: (Number -> Number -> Number) -> Number -> Number -> Number)",
  rec => acc => n => n === 0 ? acc : rec(n * acc) (n - 1)
)) (1); // acc's initial value

fact(5); // 120

```
It took me a while to comprehend the type machinery in this case, so don't be discouraged.

## Typed Arrays

### Construction

You can create typed arrays with the `Arr` constructor. Unlike `Fun` you don't have to provide an explicit type signature but let the type checker introspect the type for you:

```Javascript
const xs = Arr([1, 2, 3]);
const ys = Arr(["foo", "bar", "baz"]);

xs[TS]; // "[Number]"
ys[TS]; // "[String]"
```
Please note that an empty typed array has the polymorphic type `[a]`.

### Homogeneity

Typed arrays must be homogeneous, that is all element values must be of the same type:

```Javascript
Arr([1, "foo", true]); // type error
```
### Index Gaps

They must have a continuous index without gaps:

```Javascript
const xs = [1, 2, 3];
xs[10] = 4;

Arr(xs); // type error
```
### Property Access

You must not access unknown properties:

```Javascript
const xs = Arr([1, 2, 3]);

xs[0]; // 1
xs[10]; // type error

ys.concat; // function
ys.foo; // type error
```
### Duck Typing

Duck typing for properties with numeric keys works as usual:

```Javascript
const xs = Arr([1, 2, 3]),
  x = 0 in xs ? xs[0] : 0, // 1
  y = 10 in xs ? xs[10] : 0; // 0
```
However, you must not duck type with non-numeric keys:

```Javascript
const xs = Arr([1, 2, 3]),
  foo = "foo" in xs ? xs.foo : false;
```
Other forms of meta-programming are restricted as well:

```Javascript
const xs = Arr([1, 2, 3]);
Object.keys(xs); // type error
```
As a general advice typed arrays should be used as arrays rather than plain old Javascript objects.

### Mutations

Typed arrays are immutable for properties with non-numeric keys:

```Javascript
const xs = Arr([1, 2, 3]);
xs.foo = "bar"; // type error
```

Indexed properties can be added or removed as long as there are no index gaps:

```Javascript
const xs = Arr([1, 2, 3]),
  ys = Arr([1, 2, 3]);

xs.push(4); // passes
xs[10] = 5; // type error

delete ys[2]; // passes
delete ys[1]; // type error
```
Mutations must not alter the typed array's type:

```Javascript
const xs = Arr([1, 2, 3]);

xs[1] = 20; // 20
xs[1] = "2"; // type error
```
### Type Coercion

ftor prevents implicit type conversions whenever possible:

```Javascript
const xs = Arr([1, 2, 3]),
  s = xs + "!"; // type error
```
Since there is no way to distinguish implicit from explicit conversions you unfortunatelly have to convert types manually.

### Function Passing

You can pass typed arrays to typed functions as usual:

```Javascript
const append = Fun(
  "(append :: [a] -> [a] -> [a])",
  xs => ys => xs.concat(ys)
);

const xs = Arr([1, 2]),
  ys = Arr([3, 4]),
  zs = Arr["foo", "bar"]);
  
append(xs) (ys); // [1, 2, 3, 4]
append(xs) (zs); // type error
```
### Delete Operator

Please don't use the `delete` operator or the corresponding `Reflect.deleteProperty` function, because they silently produce index gaps. Since `Array.prototype.pop` and `Array.prototype.unshift` internally also use `delete` I cannot disable it by default.

```Javascript
const xs = Arr([1, 2, 3]);
delete xs[2]; // passes, but evil
```
## Typed Maps

Since typed maps share a lot of properties with typed arrays, I am going to focus on the differences.

### Construction

You can create a typed maps by passing an ES2015 map to the `_Map` constructor:

```Javascript
const m = _Map(new Map([["Kalib", 42], ["Liz", 38], ["Dev", 35]]));

m.get("Liz"); // 42
m.get("Byron"); // type error
m.has("Byron"); // false
m.set("Byron", 30); // passes
m.set("Zara", "50"); // type error

m[TS]; // "{String::Number}"
```
The type signature of typed maps differs from that of typed records in that the key value pair is seperated by two consecutive colons without spaces.

Please note that the type of the empty typed map is `{k::v}`.

### Function Passing

You can pass typed maps to typed functions as usual:

```Javascript
const getOr = Fun(
  "(getOr :: Number -> String -> {String::Number} -> Number)",
  n => k => m => m.has(k) ? m.get(k) : n
);

const m = _Map(new Map([["Kalib", 42], ["Liz", 38], ["Dev", 35]]));

getOr(0) ("Dev") (m); // 35
getOr(0) ("Byron") (m); // 0
```
## Typed Records

Since typed records share a lot of properties with typed arrays, I am going to focus on the differences.

### Construction

Use the `Rec` constructor and pass it a plain old Javascript object as argument to cronstruct a typed record:

```Javascript
const r = Rec("{foo: "abc", bar: 123}");

r.foo; // "bar"
r.baz; // 123

r[TS]; // "{foo: String, bar: Number}"
```
Please note that empty records are not allowed.

### Mutations

Typed records are mutable but sealed, that is all properties are determined at declaration time:

```Javascript
const r = Rec("{foo: "abc", bar: 123}");

r.foo = "FOO"; // "FOO"
r.baz = true; // type error
```
As with typed arrays record fields must not change their type during mutation:

```Javascript
const r = Rec("{foo: "abc", bar: 123}");
r.foo = true; // type error
```
### Duck Typing

Since record types are sealed and you should know your types in the typed environemnt provided by ftor, there is no need for duck typing in conjunction with typed records. In fact, ftor raises an type error for any corresponding attempt:

```Javascript
const r = Rec("{foo: "abc", bar: 123}");
"foo" in r; // type error
```
### Function Passing

You can pass typed records to typed functions as usual:

```Javascript
const showName = Fun(
  "(showName :: {first: String, last: String} -> String)",
  person => `${person.first} ${person.last}`
);

const o = Rec({first: "John", last: "Doe"}),
  p = Rec({first: "John", last: null}),
  q = Rec({first: "John"}),

showName(o); // "John Doe"
showName(p); // type error
showName(q); // type error
```
So far all records have a static type, which makes their handling quite awkward:

```Javascript
const showName = Fun(
  "(showName :: {first: String, last: String} -> String)",
  person => `${person.first} ${person.last}`
);

const o = Rec({first: "John", last: "Doe", age: 30});
showName(o); // type error
```
As you can see typed records require exact type matches. That is, of course, intolerable.

### Row Polymorphism

Forunately, with row polymorphism there is a property that offers more flexibility:

```Javascript
const showName = Fun(
  "(showName :: {first: String, last: String, ..r} -> String)",
  o => `${o.first} ${o.last}`
);

const o = Rec({first: "John", last: "Doe", age: 30}),
  p = Rec({first: "Jane", last: "Doe", gender: "f"});

showName(o); // "John Doe"
showName(p); // "Jane Doe"
```
`r` is a so-called row variable, which includes the types of all unnecessary properties. Apart form that row variables act like any other type variable in a parametric polymorphic function type:

```Javascript
const showName = Fun(
  "(showName :: {first: String, last: String, ..r} -> {first: String, last: String, ..r} -> String)",
  o => p => `${o.first} ${p.last}`
);

const showName_ = Fun(
  "(showName_ :: {first: String, last: String, ..r} -> {first: String, last: String, ..s} -> String)",
  o => p => `${o.first} ${p.last}`
);

const o = Rec({first: "Sean", last: "Penn", age: 60}),
  p = Rec({first: "Juliette", last: "Binoche", age: 45}),
  q = Rec({first: "Stan", last: "Kubrick", gender: "m"});

showName(o) (p); // "Sean Binoche"
showName(o) (q); // type error

showName_(o) (p); // "Sean Binoche"
showName_(o) (q); // "Sean Kubrick"
```
Row polymorphism is also known as static duck typing, that is to say duck typing with static type guarantees.

## Typed Tuples

Since typed tuples share a lot of properties with typed records, I am going to focus on the differences.

### Construction

You can create a typed tuple by passing an array to the `Tup` constructor:

```Javascript
const t = Tup([123, "foo", true]);

t[0]; // 123
t[1]; // "foo"

t[TS]; // "[Number, String, Boolean]"
```
The type signature of typed tuples differs from that of typed arrays in that there are several fields. 

Please note that typed tuples must not be empty but have to contain at least 2 fields.

### Function Passing

You can pass typed tuples to typed functions as usual:

```Javascript
const fst = Fun(
  "(fst :: [a] -> a)",
  t => t[0]
);

const snd = Fun(
  "(snd :: [a] -> a)",
  t => t[1]
);

const t = Tup([123, "foo", true]);

fst(t); // 123
snd(t); // "foo"
```
## Algebraic Data Types

ADTs allow you to declare sums of products, that is you can declare sum types (aka tagged unions), product types and any combination of them. ftor uses Scott encoding to express ADTs in Javascript. Along with record types we can take advantage of functional pattern matching and have the guarantee that always all cases are supplied.

With ftor all multi-constructor ADTs are created with the `Adt` and single-constructor ADTs with `Type` constructor. Please note that Scott encoding entails somewhat scary type signatures. You can construct them in a rather mechanical way though, because their types are similar across different ADTs. As every proper functional data type ADTs are immutable at the value level.

### Product Types

There are three distinct ways to construct product types. With a normal curried function:

```Javascript
const Foo = Type(
  function Foo() {},
  "(Foo :: ((String -> Number -> Boolean -> r) -> r) -> Foo<>)"
) (Foo => s => n => b => Foo(k => k(s) (n) (b)));

const runFoo = Fun(
  "(runFoo :: (String -> Number -> Boolean -> r) -> Foo<> -> r)",
  f => tx => tx.run(f)
);

const foo = Foo("foo") (123) (true);

runFoo(Fun(
  "(run :: String -> Number -> Boolean -> r)",
  s => n => b => s.toUpperCase() + "!"
)) (foo); // "FOO!"
```
With tuples:

```Javascript
const Bar = Type(
  function Bar() {},
  "(Bar :: (([String, Number, Boolean] -> r) -> r) -> Bar<>)"
) (Bar => xs => Bar(k => k(xs)));

const runBar = Fun(
  "(runBar :: ([String, Number, Boolean] -> r) -> Bar<> -> r)",
  f => tx => tx.run(f)
);

const bar = Bar(Tup(["bar", 123, true]));

runBar(Fun(
  "(run :: [String, Number, Boolean] -> r)",
  ([s, n, b]) => s.toUpperCase() + "!"
)) (bar); // "BAR!"
```
Or with records:

```Javascript
const Baz = Type(
  function Baz() {},
  "(Baz :: (({foo: String, bar: Number, baz: Boolean} -> r) -> r) -> Baz<>)"
) (Baz => o => Baz(k => k(o)));

const runBaz = Fun(
  "(runBaz :: ({foo: String, bar: Number, baz: Boolean} -> r) -> Baz<> -> r)",
  f => tx => tx.run(f)
);

const baz = Baz(F.Rec({foo: "baz", bar: 123, baz: true}));

runBaz(Fun(
  "(run :: {foo: String, bar: Number, baz: Boolean} -> r)",
  ({foo: s, bar: n, baz: b}) => s.toUpperCase() + "!")
) (baz); // "BAZ!"
```
### Sum Types

The `Option` type is well-suited for learning polymorphic sums:

```Javascript
const Option = F.Adt(
  function Option() {},
  "(List :: ({Some: (a -> r), None: r} -> r) -> Option<a>)"
);

const Some = x => Option(cases => cases.Some(x));
const None = Option(cases => cases.None);

const runOption = Fun(
  "(runOption :: {Some: (a -> r), None: r} -> Option<a> -> r)",
  cases => tx => tx.run(cases)
);

const x = Some(5),
  y = None;

runOption(Rec({
  Some: F.Fun("(Number -> Number)", n => n + 1),
  None: 0
})); // 6

runOption(Rec({
  Some: F.Fun("(Number -> Number)", n => n + 1),
  None: 0
})); // 0
```
### Sums of Products

`List` is both a sum (`Cons`/`Nil`) and a product `(Cons :: a -> List<a> -> r)` and a good example for a recursive ADT:

```Javascript
const List = Adt(
  function List() {},
  "(List :: ({Cons: (a -> List<a> -> r), Nil: r} -> r) -> List<a>)"
);

const Nil = List(cases => cases.Nil);
const Cons = x => tx => List(cases => cases.Cons(x) (tx));

const uncons = Fun(
  "(uncons :: {Cons: (a -> List<a> -> r), Nil: r} -> List<a> -> r)",
  cases => tx => tx.run(cases)
);

const empty = uncons(
  Rec({
    Nil: true, Cons: F.Fun("(a -> List<a> -> Boolean)",
    x => tx => false)
  })
);

const brokenEmpty = uncons(
  Rec({
    Foo: true, Cons: F.Fun("(a -> List<a> -> Boolean)",
    x => tx => false)
  })
);

const xs = Cons("foo") (Nil),
  ys = Nil;

empty(xs); // false
empty(ys); // true
brokenEmpty(xs); // type error (Nil case missing)
```
# Missing Topics

- [ ] Explore issues caused by ftor's use of proxies with regard to object identity
- [ ] Note that creating dependencies to ftor's pluggable type system is bad
- [ ] Explain the lack of bounded polymorphism (type classes)