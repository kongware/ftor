ftor
====

<img src="https://i.stack.imgur.com/UqCPm.png?s=328&g=1" width="164" height="164" alt="ftor">

# Status

This library is experimental and still work in progress.

## What

ftor is a library enabling ML-like type-directed, functional programming in Javascript.

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

## Terminology

### Pure functions

When I talk about function I usually mean pure functions. A pure function can be replaced by its return value without modifing the behavior of the program.

### Action

An action is an impure function that may or may not return a value and performs side effects, i.e. mainly IO.

### Polymorphism

When I talk about polymorpism I usually mean parametric or bounded polymorphism and not subtyping. A parametric polymorphic function or data type can handle various values identically without depending on their type. Since ftor doesn't support bounded polymorphism, I rarely refer to this concept.

# 1. Type systems

ftor ships with an extended run-time type system that guides your developing and leads to improved productivity and more robust programms. Please note that strictly speaking, from a type theoretical perspective, there is no such thing as a run-time type system. In this sense ftor is rather a debugging tool.

## 1.1. Extended run-time type system

I believe that a strong type system makes it a lot easier to write complex programs. Software designs are very clearly expressed using types, because they provide a high level of abstraction. When a lot of distracting and confusing details are omitted, the mental burden is lowered to comprehend the underlying intention of the author. This is a big win.

Instead of a static type checker ftor offers a plugable, run-time type system intended for the development stage, which extends Javascript's dynamic and weak type system with non-trivial features. Since ftor is intended for the development stage, it only maintains a minimal footprint on production systems. It relies heavily on proxy virtualization, that is to say functions and reference types are replaced by proxy objects, which provide the additional behavior.

ftor orients itself torwads the ML language family. That is it prefers structural over nominal typing and has a strong focus on parametric polymorphism and parametricity.

## 1.2. Unplugging

To unplug the extended type system in production just set the `TYPE_CHECK` constant to `false`. Beyond that it is important to avoid establishing unintended dependencies to ftor. I will add a corresponding section soon that describes common pitalls.

## 1.3. Identity of reference types

As ftor virtualizes functions and object types with proxies, identities change. If your code depends on identity, because you use a `Map` abstract data type with objects as keys for instance, you must take care of not mixing virtualized entities with their normal counterparts.

## 1.4. No typing of primitive literal values

ftor cannot type `const`/`let` bindings of promitive literal values, since Javascript's `Proxy` type only can virtualize reference types. Since such bindings are only occasionally used when you program in a function style, this should only lead to a negligible reduction of type safety. In fact, typed functions and data types are enforced in most cases.

## 1.5. Subtype polymorphism

ftor supports subtyping only superficially. For instance, there is no support of subtype variants for function types like co-, contra- or invariants.

## 1.6. Explicit type directories

As far as I know, Javascript prototype system isn't particularly suitable for bounded polymorphism. As a matter of fact ftor doesn't rely on it at all. However, to not make things worse, I refrain from introducing an alternative mechanism like Haskell's type classes. Consequently, you have to pass type dictionaries explicitly around. This is the drawback of not having a suitable mechanism on the language level.

## 1.7. Built-in operators are not type safe

As ftor isn't a static type checker, Javascript's built-in operators are not type safe. Use ftor's function counterparts instead.

## 1.8. Pending design decicions

### 1.8.1. Subclassing for primitive types

It may increase the expressiveness of ftor's type system when subtypes for primitives are introduced, e.g. an `Integer` subtype of `Number`. This wouldn't work 

### 1.8.2. Restrict side effects

It is questionable if ftor should introduce a special `IO` type that wraps side effect by interacting with the real world into a type, since there are no means to restrict the use of IO within this type. Quite the reverse, people can perform implicit side effects literally everywhere, even within an argument list!

### 1.8.3. Refinement types

Since ftor is a run-time type checker, it is much easier to implement refinement types. I still cannot assess their impact on the type system, though.

### 1.8.4. Intersection types

Have seen them at Facebook's flow manpage. Maybe interesting...

### 1.8.5. Recursive types

ftor will support the definition of recursive sum types. Maybe this is also possible for existing literal (product) types like `[]` and `{}`.

## 1.9. Functional types

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

### 1.9.1. Curried functions

```JS
const add = Fun("add :: Number -> Number -> Number", n => m => n + m);

add(2) (3); // 5
add(2) ("3"); // TypeError
add(2, 3); // ArityError
add() (3); // ArityError
```

### 1.9.2. Multi-argument functions

```JS
const add = Fun("add :: (Number, Number) -> Number", (n, m) => n + m);

add(2, 3); // 5
add(2, "3"); // TypeError
add(2, 3, 4); // ArityError
add(2); // ArityError
```

### 1.9.3. Variadic functions

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
Please note that ftor doesn't support optional arguments and default parameters. Use currying and partial application instead.

### 1.9.4. Polymorphic functions

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

Again, invalid implementations of polymorphic types throw corresponding errors at run-time:

```JS
const map = Fun("map :: (a -> b) -> [a] -> [b]", f => xs => xs.map(x => f(x) + ""));
const sqr = Fun("sqr :: Number -> Number", n => n * n);
const id = Fun("id :: a -> a", x => x + "");

map(sqr) ([1, 2, 3]); // TypeError
map(id) ([1, 2, 3]); // TypeError
```

ftor uses an unification algorithm that is based on simple substitution to achieve this.

### 1.9.5. Generator functions

Work in progress...

## 1.10. Primitive types

Work in progress...

## 1.11. Undefined

Work in progress...

## 1.12. Product types

Work in progress...

### 1.12.1. Array

Work in progress...

### 1.12.2. Dict

Work in progress...

### 1.12.3. Tuple

Work in progress...

Tuples must have at least to elements of different types.

### 1.12.4. Record

Work in progress...

Records must have at least to elements of different types.

## 1.13. Sum types

Work in progress...

Example:

```JS
Sum = tag => x => cases => cases(tag) (x);

const Option = (some, none) => tag => x => {
  switch (tag) {
    case "Some": return some(x);
    case "None": return none;
    default: throw new TypeError("invalid case");
  }
}

const Some = Sum("Some");
const None = Sum("None") ();

const inc = tn => tn(Option(x => x + 1, 0));
const map = f => tx => tx(Option(x => Some(f(x)), None));
const sqr = x => x * x;

inc(map(sqr) (Some(5))); // 26
inc(map(sqr) (None)) // 0
```

## 1.14. Constructor types

Work in progress...

### 1.14.1. Abstract data types

Work in progress...

### 1.14.2. Promises

Work in progress...

## 1.15. Prototypes

Work in progress...

## 1.16. Iterators/Generators

Work in progress...

# 2. Misc

## 2.1. Type signature extension

Work in progress...

Array [a]
Tuple [a, b]
Dict {a}
Record {prop: a}
Constructor Cons(), Cons(a), Cons(a, b), Cons(a)(b)
Sum List(a) = Cons :: a -> List(a) -> List(a) | Nil :: List(a)

## 2.2. ES2015 modules

I'll switch to ES2015 modules as soon as there is native support by browser vendors.