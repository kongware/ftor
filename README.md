ftor
====

<img src="https://i.stack.imgur.com/UqCPm.png?s=328&g=1" width="164" height="164" alt="ftor">

# Status

This library is experimental and still work in progress.

## What

ftor is a library enabling type-directed, functional programming in Javascript.

## Why

ftor teaches you type-directed, functional programming, which includes extremely generalized and language agnostic concepts. That means you can use this knowledge with different languages in various scenarios.

With ftor you develop a good feel for

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

## Type signature extension

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

* `[a,b]` represents a pair Tuple
* `[a,b,c]` represents a triple Tuple

Dictionaries and Records:

* `Object` represents an untyped `Object` of any shape
* `{a}` represents an unordered, homogenous dictionary with key/value-pairs of type `String`/`a`
* `{prop1:a,prop2:b}` represents an unordered, heterogeneous with two properties `prop1` and `prop2` of type `String`/`a` and `String`/`b`

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

## ES2015 modules

I'll switch to ES2015 modules as soon as there is native support by browser vendors.

# 1. Type systems

ftor ships with an augmented runtime type system that guides your developing and leads to more robust programms and higher productivity. Let's make a short detour to static type systems to better comprehend the need of such a runtime type system in connection with untyped languages.

Please note that from a type theoretical point of view a runtime type system isn't a real type system but rather a meta-programming tool for the purpose of debugging.

## 1.1. Static type system

What role does a static type system play?

* it offers a guarantee at compile time that a large class of errors cannot occur at run time
* it comes along with certain optimization techniques, which lead to less boilerplate code and improved performance (e.g. automatic deriving, type erasure, optimized implementations per type)
* it provides an abstract and hence succinct way to express your intentions for both, other developers and the machine
* it restricts the structure of your program (to meaningful data structures and algorithms on them)
* it offers means to mitigate these constraints without losing the type guarantee (polymorphism)

## 1.2. Dynamic type system

With Javascript's trivial dynamic type system we lose all the characteristics listed above. We can work with any data structure we want and algorithms are inherently "generic", but in an often undesired manner. Although this may be a blessing for trivial programs, it is a curse for more complex software.

Usually one maintains countless unit tests to get a sort of guarantee that a program will run as intended. In the following paragraphs I am going to demonstrate an additional technique that doesn't replace unit tests, but complement them in order to improve coding productivity and code robustness.

## 1.3. Augmented runtime type system

ftor encourages you to pursue type-directed programming, because I believe that a type system makes it easier to write complex programs. Software designs are very clearly expressed using types, because the latter provide a high level of abstraction, i.e. a lot of distracting details are omitted. Usually, when you encounter a specific function type, it is pretty easy to cut down the space of possible code you could write to a very small number of candidates. Type annotations are usually much smaller then the corresponding code and that is a big win.

Instead of a static type checker ftor offers a plugable, runtime type system for the development stage, which augments Javascript's dynamic type system with non-trivial features. In order to achieve a minimal footprint on the production system, where this type system is "unplugged", it relies heavily on proxy virtualization, that is to say functions and composite data types are replaced by their corresponding proxy objects, which handle the additional behavior.

The next sections are going to cover the different type families like primitves, exponential (functional) types, product types and sum types.

Domain specific issues:

* there is a primitive type gap due to Javascript's insufficient type system
* ftor uses bounded polymorphism without prototypes but explicit dictionery passing
* rest parameters are type safe but optional ones are not
* there is no single tuple/record
* there are no tuples/records where all elemments are of the same type

### 1.3.1. Functional types

...

#### 1.3.1.1. Curried functions

...

#### 1.3.1.2. Multi-argument functions

...

#### 1.3.1.3. Variadic functions

...

#### 1.3.1.4. Polymorphic functions

...

First order functions

...

Higher order functions

...

Parametric polymorphism

...

Bounded polymorphism

...

Return type polymorphism

...

#### 1.3.1.4. Generator functions

...

### 1.3.2. Primitive types

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

Sum types

...

Abstract data types

...

### 1.3.5. Prototypes

...

### 1.3.6. Promises

...

### 1.3.7. Iterators

...