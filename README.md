ftor
====

<img src="https://i.stack.imgur.com/UqCPm.png?s=328&g=1" width="164" height="164" alt="ftor">

# Status

This library is experimental and still work in progress.

## What

ftor is a library enabling type-directed, functional programming in Javascript.

## Why

ftor teaches you type-directed, functional programming, which includes extremely generalized and language agnostic concepts. That means you can use this knowledge with different languages in various scenarios.

With ftor you develop a good feeling for

* types
* purity
* effects
* currying
* composition
* combinators
* polymorphism
* immutability
* co-/recursion
* lazy evaluation

Additionally you can explore how monodial, functorial, applicative, monadic and other common structures can be useful in a strictly evaluated, impure language like Javascript.

# 1. Type systems

ftor ships with an extended run-time type system that guides your developing and leads to improved productivity and more robust programms. Let's make a short detour to static type systems to get an idea why such a system is useful in the context of untyped languages.

Please note that strictly speaking, from a type theoretical perspective, there is no such thing as a run-time type system. In this sense ftor is a sort of debugging tool.

## 1.1. Static type system

What role does a static type system play?

* it offers a proof at compile time that a large class of errors cannot occur during run time
* it comes along with certain optimization techniques, which lead to less boilerplate code and improved performance*
* it provides an abstract and hence succinct way to express your intentions for both, other developers and the machines
* it constraints the structure of your program to meaningful data structures and efficient algorithms working with them
* it offers means to mitigate these constraints without losing the type guarantee (polymorphism)

\*  e.g. automatic deriving, type erasure, optimized implementations per type

## 1.2. Dynamic type system

With Javascript's trivial dynamic type system we lose all these qualities listed above. We can work with any data structure we want and algorithms are inherently "generic", but in an often undesired way. Although this may be a blessing for trivial programs, it is a curse for more complex ones.

Usually one maintains countless unit tests to get a sort of guarantee that a program will run as intended. ftor doesn't intend to replace unit tests, but complement them to achieve a better coding experience.

## 1.3. Extended run-time type system

I believe that a strong type system makes it a lot easier to write complex programs. Software designs are very clearly expressed using types, because they provide a high level of abstraction. When a lot of distracting and confusing details are omitted, the mental burden is lowered to comprehend the intention of the author. For example, when you encounter a function, it is pretty easy to cut down the space of possible code you could write to a very small number of candidates just by looking at its type signature. This is a big win.

Instead of a static type checker ftor offers a plugable, run-time type system for the development stage, which extends Javascript's dynamic type system with non-trivial features. Since ftor is a development tool, it only maintains a minimal footprint on production systems. It relies heavily on proxy virtualization, that is to say functions and composite data types are replaced by their corresponding proxy objects, which handle the additional behavior.

### 1.3.1. Unplugging

To unplug the extended type system in production just set the `TYPE_CHECK` constant to `false`. Beyond that it is important to avoid creating unintended dependencies to ftor. I will add a section on this topic soon, which describes common pitalls.

### 1.3.2. Identity of reference types

As ftor virtualizes functions and object types with proxies, identities change. If your code depends on identity, because you use a `Map` abstract data type with objects as keys for instance, you must take care of not mixing virtualized entities with their normal counterparts.

### 1.3.3. Functional types

Functions are virtualized by the `Fun` function:

```js
const sqr = Fun("sqr :: Number -> Number", n => n * n);

sqr(5); // 25
sqr("5"); // TypeError
sqr(new Number(5)); // TypeError
sqr(5, 6); // ArityError
sqr(); // ArityError
```

If the implementation of a virtualized function doesn't produce the specified return value, a respecitve error is thrown:

```js
const sqr = Fun("sqr :: Number -> Number", n => n * n + "");
sqr(5); // ReturnTypeError
```

#### 1.3.3.1. Curried functions

```JS
const add = Fun("add :: Number -> Number -> Number", n => m => n + m);

add(2) (3); // 5
add(2) ("3"); // TypeError
add(2, 3); // ArityError
add() (3); // ArityError
```

#### 1.3.3.2. Multi-argument functions

```JS
const add = Fun("add :: (Number, Number) -> Number", (n, m) => n + m);

add(2, 3); // 5
add(2, "3"); // TypeError
add(2, 3, 4); // ArityError
add(2); // ArityError
```

#### 1.3.3.3. Variadic functions

Since Ecmascript 2015 variadic functions are defined with rest parameters in Javascript:

```JS
const sum = Fun("sum :: ...Number -> Number", (...ns) => ns.reduce((acc, n) => acc + n, 0));

sum(); // 0
sum(1, 2, 3, 4, 5); // 15
sum(1, 2, "3", 4, 5); // TypeError
```

ftor can handle variadic functions with mandatory parameters as well:

```JS
const sum = Fun("sum :: (Number, ...Number) -> Number", (n, ...ns) => ns.reduce((acc, m) => acc + m, n));

sum(); // ArityError
sum(1); // 1
sum(1, 2, 3, 4, 5); // 15
```

#### 1.3.3.4. Parametric polymorphic functions

Please note the section about polymorphism to learn more about this concept.

ftor can handle polymorphic first order functions:

```JS
const id = Fun("id :: a -> a", x => x);

id(5); // 5
id("foo"); // "foo"
id(new Map()); // Map
```

Type variables are bound to concrete types, consequenlty invalid implementations of polymorphic types doesn't work:

```JS
const id = Fun("id :: a -> a", x => x + "");
id(5); // ReturnTypeError
```

Here is a parametric polymorphic function with a composite type:

```JS
const append = Fun("append :: [a] -> [a] -> [a]", xs => ys => xs.concat(ys));

append([1, 2]) ([3, 4]); // [1, 2, 3, 4]
append(["a", "b"]) (["c", "d"]); // ["a", "b", "c", "d"]
append([1, 2]) (["c", "d"]); // TypeError
append([1, 2]) ([3, "d"]); // TypeError
append([1, 2]) (3); // TypeError
```

ftor can handle polymorphic higher order functions as well, where function arguments are monomorphic or polymorphic themselves:

```JS
const map = Fun("map :: (a -> b) -> [a] -> [b]", f => xs => xs.map(x => f(x)));
const sqr = Fun("sqr :: Number -> Number", n => n * n);
const id = Fun("id :: a -> a", x => x + "");

map(sqr) ([1, 2, 3]); // [1, 4, 9]
map(sqr) (5); // TypeError
map(sqr) ([1, 2, "3"]); // TypeError

map(id) ([1, 2, 3]); // [1, 2, 3]
map(id) (["a", "b", "c"]); // ["a", "b", "c"]
```

Invalid implementations of polymorphic types throw corresponding errors at run-time:

```JS
const map = Fun("map :: (a -> b) -> [a] -> [b]", f => xs => xs.map(x => f(x) + ""));
const sqr = Fun("sqr :: Number -> Number", n => n * n);
const id = Fun("id :: a -> a", x => x + "");

map(sqr) ([1, 2, 3]); // TypeError
map(id) ([1, 2, 3]); // TypeError
```

ftor uses an unification algorithm that is based on simple substitution to achieve this.

#### 1.3.3.5. Generator functions

...

### 1.3.2. Primitive types

...

#### 1.3.2.1. Number

...

#### 1.3.2.2. String

...

#### 1.3.2.3. Boolean

...

#### 1.3.2.4. Symbol

...

#### 1.3.2.5. Null

...

#### 1.3.2.6. Undefined

...

### 1.3.3. Product types

...

#### 1.3.3.1. Array

...

#### 1.3.3.2. Dict

...

#### 1.3.3.3. Tuple

...

#### 1.3.3.4. Record

...

### 1.3.4. Constructor types

...

#### 1.3.4.1. Sum types

...

#### 1.3.4.2. Abstract data types

...

### 1.3.5. Prototypes

...

### 1.3.6. Promises

...

### 1.3.7. Iterators

...

### 1.3.8. Subtypes

...

#### 1.3.8.1. Char

...

#### 1.3.8.2. Integer

...

#### 1.3.8.3. Float

...

#### 1.3.9. Domain specific issues

* lazy type checking leads to deferred throwing
* limited primitive types jeopardize type safety
* ftor uses bounded polymorphism without prototypes but explicit dictionery passing
* ftor relies on tail recursion, which is pretty slow without TCO
* rest parameters are type safe but optional ones are not
* there is no single tuple/record
* there are no tuples/records where all elemments are of the same type

# 2. Misc

## 2.1. Type signature extension

The following type signature extensions are neccesary considering Javascript's dynamic type system. Please note that `?` denotes the lack of a type.

Functions:

* `Function` represents an untyped function with unknown arity
* `() -> ...` represents a nullary function


Curried functions:

* `? -> ?` represents an unary function whose argument/return value are of unknown type
* `? -> ? -> ?` represents a binary function whose arguments/return value are of unknown type

Multi-argument functions:

* `(a, b) -> ...` represents a multi-argument function comprising two arguments of type `a`/`b`
* `(?, ?) -> ...` represents a multi-argument function comprising two arguments of unknown type

Variadic functions:

* `(a, ...bs) -> ...` represents a variadic function including one mandatory and one rest parameter of type `a`/`bs`
* `(?, ...?) -> ...` represents a variadic function including one mandatory and one rest parameter of unknown type

Arrays:

* `Array` represents an untyped `Array` that may be homogeneous or heterogeneous

Tuples:

* `[a, b]` represents a pair Tuple of type `a`/`b`
* `[?, ?]` represents a pair Tuple of unknown type
* `[a, b, c]` represents a triple Tuple of type `a`/`b`/`c`

Dictionaries and Records:

* `Object` represents an untyped `Object` of any shape
* `{a}` represents an unordered, homogenous dictionary with key/value-pairs of type `String`/`a`
* `{prop1: a, prop2: b}` represents an unordered, heterogeneous with two properties `prop1` and `prop2` of type `String`/`a` and `String`/`b`
* `{prop1: ?, prop2: ?}` represents an unordered, heterogeneous with two properties `prop1` and `prop2` of type `String`/unknown and `String`/unknown

Input/Output and side effects:

* `IO` represents an interaction with the real world (side effects)

Constructor Types:

Constructor types can be either sum types, product types or abstract data types. The final signatures are not defined yet. Here are some examples:

* `Cons` represents a monomorphic constructor type with a nullary type constructor
* `Cons(a)` represents a polymorphic constructor type with an unary type constructor
* `Cons(a b)` represents a polymorphic constructor type with a curried binary type constructor
* `Cons(a,b)` represents a polymorphic constructor type with a (uncurried) binary type constructor
* `Map(k, v)` represents an ordered Map type with key/value-pairs of type `k`/`v`
* `Map(?, ?)` represents an ordered Map type with key/value-pairs of unknown type

## 2.2. ES2015 modules

I'll switch to ES2015 modules as soon as there is native support by browser vendors.
