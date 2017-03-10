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
* encode declarative
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

## Augmented Built-ins

ftor augments built-ins by utilizing `WeakMap`s. To use these augmented builtins on the calling side, each function must perform an additional lookup to retrieve the desired method.

The following type classes (interfaces) are provided:

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

ftor introduces the following types:

* Char
* Iterator
* Tagged unions
* Ordering
* Tuple

New types in ftor are usually Church encoded, i.e. they are expressed as a function and are applied in continuation passing style (CPS).

## Tagged unions

ftor doesn't use the prototype system, but expresses tagged unions (aka sum types) by functions. By avoiding prototypes ftor loses the ability to share methods on common instances, but also gets rid of all this prototype boilerplate and the additional layer of indirection prototypes entail. ftor's constructors are kept simple. However, the application of such instances requires CPS. Here is a simplified version of the `Option` tagged union:

```javascript
// "prototype"

const $Option = Symbol("kongware/ftor/Option");

// constructors

const Some = x => {
  const api = {};
  api.proto = $Option;
  api.tag = "some";
  api.cata = pattern => pattern[api.tag](x);
  api.fold = f => g => api.cata({some: f, none: g});
  return k => k(api);
};

const None = () => {
  const api = {};
  api.proto = $Option;
  api.tag = "none";
  api.cata = pattern => pattern[api.tag]();
  api.fold = f => g => api.cata({some: f, none: g});
  return k => k(api);
};

// API

const get = prop => api => api[prop];
const fold = api => api.fold;

// application

const sqr = x => x * x;
const K = x => _ => x;

const optx = Some(5),
 opty = None();

optx(get("proto")); // Symbol("kongware/ftor/Option")
optx(get("tag")); // some

opty(get("proto")); // Symbol("kongware/ftor/Option")
opty(get("tag")); // none

optx(fold) (sqr) (K(0)); // 25
opty(fold) (sqr) (K(0)); // 0

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
* [name_] indicates first order functions (operator functions) in either uncurried or composable form
* [_name] distinguishes either a slightly different variant of an existing function or allows names with leading numbers (e.g. $3rd)
* [$name] may represent a native Symbol
* [$name] may be used to avoid conflicts with reserved identifiers

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