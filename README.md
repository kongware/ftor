ftor
====

<img src="https://i.stack.imgur.com/UqCPm.png?s=328&g=1" width="164" height="164" alt="ftor">

An idiomatic, non-dogmatic lazy lib that facilitates the functional paradigm in Javascript.

## Status

This library is experimental and still work in progress.

## Mission

Functions.

More precisely pure,

first class functions in curried form

that close over their environments.

Such function are used to define higher order functions and primitive combinators,

which are derived to combined combinators and funtion compositions of arbitrary complexity.

Ultimately, this is all you need to create domain specific languages of any expressive power.

Many people claim that this were not idiomatic Javascript. Don't believe them, because Javascript has...

* closurses
* first class functions
* higher order functions
* generator functions
* arrow functions to facillitate currying

Regain hope all ye who enter here.

## Criteria

* love functions
* enjoy purity
* avoid magic and false simplicity
* think algebraic
* follow parametricity
* hate async functions
* encode declaratively
* evaluate lazy
* reify effects
* embrace immutability
* do it recursively
* respect DRY, SRP
* and the principle of least astonishment

## Currying

All functions are manually curried in ftor. However, operator functions, i.e. all first order functions are also provided in uncurried or composable form. Such functions are marked with a trailing underscore in their name.

Composable functions are curried only in their last argument to make them partially applicable (e.g. for function composition):

```Javascript
const comp = f => g => x => f(g(x)); // curried function
const comp_ = (f, g) => x => f(g(x)); // composable function
```

Usually higher order functions expect curried functions as arguments. To improve performance, iterative higher order functions exceptionally expect uncurried operator functions.

ftor has broad support of the tuple type and thus can handle multi-argument functions pretty well.

## Type classes and extended built-ins

[unstable]

ftor originally approach was to augment built-ins by utilizing `WeakMap`s. The problem is, that especially primitive built-ins can have several instances of specific type classes:

```Javascript
const All = {
  concat: y => x => x && y
}

const Any = {
  concat: y => x => x || y
}
```

When constructors (e.g. `Boolean`) are used as keys of a `WeakMap`, there is no way to define multiple instances for a specific constructor. Hence ftor uses type dictionaries, which have to be passed around explicitly. While this is somewhat verbose, it also improves the readability of your code, since you always see the type in place. Beyond that, such type dicts allow ftor to extend built-in types without touching them at all.

The following type classes are provided:

* Applicative
* Bounded
* Enum
* Eq (Semigroup)
* Functor
* Monad
* Monoid
* Ord
* Traversable

## New types

[unstable]

ftor introduces the following types:

* Char
* Iterator
* Ordering
* Tuple

New types don't use Javascript's prototype system. They are either Church encoded (e.g. `Tuple`) or use explicit type dicts.

## Custom tagged unions (sum types)

[unstable]

ftor's sum types must use explicit type dicts instead of prototypes. Each choice of a sum must implement its own value constructor that enriches values with the following meta information:

* type property holding a reference to the corresponding type dict
* tag property to allow pattern matching

Here is an simplyfied sketch of the `Option` type:

```Javascript
// type defintion

const Option = {};

Option.cata = pattern => ({tag, x}) => pattern[tag](x);
Option.fold = f => g => Option.cata({some: f, none: g});

Option.concat = type => ({tag: tagy, x: y}) => ({tag: tagx, x: x}) => tagx === "none"
 ? tagy === "none"
  ? None()
  : Some(y)
 : tagy === "none"
  ? Some(x)
  : Some(type.concat(y) (x));

// constructors

const Some = x => ({type: Option, tag: "some", x: x});
const None = () => ({type: Option, tag: "none"});

// auxiliary functions

const cata = type => type.cata;
const concat = type => type.concat;
const fold = type => type.fold;
const K = x => _ => x;

// mock types/functions/data

const All = {
  concat: y => x => x && y
}

const Any = {
  concat: y => x => x || y
}

const sqr = x => x * x;

const v = Some(5);
const w = None();

const x = Some(true);
const y = Some(false);


// application

fold(Option) (sqr) (K(0)) (v); // 25
fold(Option) (sqr) (K(0)) (w); // 0

concat(Option) (All) (x) (y); // {..., x: false}
concat(Option) (Any) (x) (y); // {..., x: true}
```

## `Iterators` without observable mutations

ftor contains its own `Iterator` implementations that avoid observable mutations and offer some nice extras like look ahead/behind. Though it differs from the ES2015 Iterable Protocols, its API provides a function to transform ftor `Iterator`s into ES2015 `Iterable`s in place. Here is a simplified version of the `ArrayIterator`:

```Javascript
// constructor

const ArrayIterator = xs => {
  const aux = i => {
    const api = {};
    api.curr = f => xs[i];
    api.look = n => xs[i + n];
    api.next = () => aux(i + 1);
    api.prev = f => xs[i - 1];

    api.iterable = { 
      [Symbol.iterator]: (j = i) => ({
        next: () => j in xs 
         ? {value: ++j, done: false}
         : {value: undefined, done: true}
      })
    };

    return k => k(api);
  };

  return aux(0);
};

// API

const curr = api => api.curr();
const iterable = api => api.iterable;
const look = n => api => api.look(n);
const next = api => api.next();
const prev = api => api.prev();

// mock data/function

const xs = [1,2,3,4,5];
let itor = ArrayIterator(xs);

const foo = itor => itor(next) (curr);

// application

// current state
itor(curr); // 1

// look ahead
itor(look(1)); // 2

// iterable without observable state mutation
Array.from(itor(iterable)); // [1,2,3,4,5]
itor(curr); // 1

// sharing without observable mutations
foo(itor); // 2
itor(curr); // 1

// state change only via re-/assignment
itor = itor(next);
itor(curr); // 2

// look behind
itor(prev); // 1
```

## Debugging

Besides common helpers like `tap` or `trace` ftor offers a functional type checker that checks both, expected types of arguments and return values as well as the arity of procedurally applied curried functions. In order to use the type checker, just apply it to functions of imported modules. As long as your code doesn't depend on the `name` or ` length` property  of the function prototype, the type checker doesn't alter the behavior of your program. Hence you can easily remove it as soon as you finish the development stage.

## Naming Convention

* use [v, w, x, y, z] for generic variables of any type
* use [vs, ws, xs, ys, zs] for generic collections
* use [o, p, q, r, s] for generic object types
* use [f, g, h, i, j] for generic functions
* use [fx, fy, fz] values wrapped in a context
* [name_] indicates first order functions (operator functions) in either uncurried or composable form
* [_name] distinguishes either a slightly different variant of an existing function or avoids naming conflicts with reserved keywords or allows names with leading numbers
* [$name] may represent a native Symbol

Functional programming doesn't mean to always use generalized names like `x` or `f`. Use speaking names for specific functions/variables and generic names for generic ones. The specificity of names is a good indicator of how generalized your functions are.

Please note that ftor doesn't take care of naming conflicts within the library. You have to handle that yourself.

## Documentation

The typical ftor function is so atomic that its purpose is easly comprehensible. However, often its application isn't intuitive for programmer, who are accustomed to the imperative style. Hence I will provide inline application examples for each function asap.

## Todos

- [ ] fold Objects without intermediate (generator i/o Object.keys(Object.values)
- [ ] replace uncurried versions with (...args)
- [ ] introduce continuation functor as compk
- [ ] check out CPS aux functions
- [ ] introduce on as wrapper of addEventListener
- [ ] check out event stream aux functions
- [ ] introduce new typeclasses
- [ ] introduce enum type
- [ ] introduce sum types
- [ ] examine monadic traverse
- [ ] examine kleisli composition
- [ ] introduce Haskell's scan
- [ ] examine co-recursion/unfold
- [ ] examine tree un-/serilization
- [ ] introduce common transducers
- [ ] introduce group/groupBy
- [ ] review functional comparators/comparator modifier
- [ ] look into functional lenses
- [ ] introduce ap/chain for arrays
- [ ] look into both/eitherOr/guarded functions
- [ ] are clojure's multimethods terrible?
- [ ] examine monotonic array
- [ ] add object comparison
- [ ] traverse unknown object (tree)
- [ ] object left/right difference + intersection
- [ ] examine bimap
- [ ] examine functional value object
- [ ] introduce unzip
- [ ] introduce Enum type
- [ ] introduce Char type
- [ ] explore finger trees/sequences
- [x] examine functional sum types
- [x] delete observable type (javascript frp nonsense)
- [x] derive compn from foldr and merge it with comp