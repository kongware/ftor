ftor
====

<img src="https://i.stack.imgur.com/UqCPm.png?s=328&g=1" width="164" height="164" alt="ftor">

# Status

This library is experimental and still work in progress.

## What

ftor is a functional programming library that adapts the functional paradigm meaningfully for untyped environments.

## Why

ftor teaches you type-directed programming and fundamental functional idioms, which are extremely generalized concepts and language agnostic. That means you can use this knowledge in various scenarios, regardless of the programming language you're working with. In doing so ftor neither introduces a new language (and treats Javascript merely as a compile target) nor relies on new syntax (by macros), but simply sticks to vanilla Javascript.

With ftor you develop a feel for

* types
* effects
* purity
* compositon
* polymorphism
* immutability
* currying
* co-/recursion
* lazy evaluation

## Design Principles

* abstraction/generalization vs. comprehensibility
* advanced techniques vs. low barrier to entry
* functional purity vs. performance
* idiomatic code vs. thinking outside the box

## Programming Guidelines

* first get the types right before you start implementing
* whenever you can do it with a pure function, just do it with a pure function
* reify effects to first class values
* defer the execution of effects as long as possible
* avoid visible mutations but learn to appreciate private ones
* model your domain with alternatives instead of hierarchies
* prefer tail recursive algorithms over loops
* transform statements into first class expressions


All of these guidelines have the same purpose, which is somehow the fetish of functional programming:

**Everything must be composable!**

## Terminology

* composable function: A pure function that is partially applicable in its last argument
* first order function: A function that neither accepts function types as arguments nor returns them
* higher order function: A function that accepts function types as arguments and/or returns them
* action: An impure and regularly nullary function that performs side effects
* Church encoding: Data types that are encoded by higher order functions
* Arrows: The type class that abstracts over function types (not ES2015 arrow functions)

## Naming conventions

The following conventions for name bindings are used:

* `name_` indicates a slightly modified variant of an existing function `name`
* `_name` just avoids name conflicts with reserved keywords or native functions
* `nameBy` or `nameWith` indicates a more general version of an existing function `name`
* `$name` regularly represents a `Symbol`

Otherwise I tend to use the first letter of a type for name bindings, e.g. `f` for functions. When I need to name several functions, I fall back to alphabetically following letters, e.g. `g`, `h` etc. for functions.

For more specific functions I also use descriptive names sometimes. Since ftor is a generic library it doesn't happen often, though.

## Type signature extension

The following type signature extension is neccesary given the fact that Javascript is dynamically typed. Please note that `?` represents the lack of a type.

Functions:

* `Function` represents an untyped function with unknown arity
* `? -> ?` represents an untyped unary function
* `? -> ? -> ?` represents an untyped binary function

Multi-argument functions variadic functions and tuples:

* `(a, b) -> a` represents either a multi-argument function or a tuple (pair) of type `a` and `b`
* `(...a) -> a` represents a variadic function (rest syntax)
* `(...?) -> ?` represents an untyped variadic function (rest syntax)
* `() -> a` represents a nullary function

Arrays and collections:

* `Array` represents an untyped `Array` collection
* `[a, b]` represents an heterogeneous `Array` that acts like a pair tuple
* `[a, b, c]` represents an heterogeneous `Array` that acts like a triple tuple

Objects, dictionaries and records:

* `Object` represents an untyped `Object` with key/value-pairs of type `String`/untyped
* `{x: a}` represents a heterogeneous `Object` that includes at least a key/value-pair of type `String`/`a` accessible via the key `x`
* `{a}` represents a homogenous dictionary with key/value-pairs of type `String`/`a`
* `{a b}` represents a homogenous dictionary with key/value-pairs of type `a`/`b`
* `{a, b}` represents a record with two fields and keys of type `String`

Input/Output and side effects:

* `IO` represents an interaction with the real world (side effect)

Sum Types:

Please note that sum types are internally encoded by `Object`s. In order to avoid verbose type signatures their types are similar to Haskell's notation.

* `Sum` represents a monomorphic sum type
* `Sum (a)` represents a polymorphic sum type with an unary type constructor
* `Sum (a b)` represents a polymorphic sum type with a curried binary type constructor
* `Sum (a, b)` represents a polymorphic sum type with a (uncurried) binary type constructor

As you can see parenthesis are always set, also unnecessarily.

## ES2015 modules

I'll switch to ES2015 modules as soon as there is native support by browser vendors.

# 1. Type systems

ftor ships with an augmented runtime type system that guides your developing and leads to more robust programms and higher productivity. Let's make a short detour to static type systems to better comprehend the need of such a runtime type system in connection with untyped languages.

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

Parametric polymorphism

...

Ad-hoc polymorphism

...

### 1.3.2. Primitive types

...

### 1.3.3. Product types

...

#### 1.3.3.1. Tuple

...

#### 1.3.3.2. Record

...

#### 1.3.3.3. Array

...

#### 1.3.3.4. Dictionary

...

### 1.3.4. Sum types

...

### 1.3.5. Prototypes

...