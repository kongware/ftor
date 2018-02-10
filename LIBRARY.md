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

This is the additional documentation for the typed functional library that builds upon ftor's pluggable runtime type checker. This library includes common functional combinators, constructs and patterns, all declared with explicit type annotations.

# API

## Generic Combinators

```
flip arguments
(_ :: (a -> b -> c) -> b -> a -> c)

applicator
($ :: (a -> b) -> a -> b)


infix applicator
($$ :: a -> (a -> b -> c) -> b -> c)


applicative
(ap :: (r -> a -> b) -> (r -> a) -> r -> b)


monadic chain
(chain :: (a -> r -> b) -> (r -> a) -> r -> b)


constant function
(co :: a -> b -> a)


constant function in the 2nd argument
(co2 :: a -> b -> b)


function composition
(comp :: (b -> c) -> (a -> b) -> a -> c)


composition with three functions
(comp3 :: (c -> d) -> (b -> c) -> (a -> b) -> a -> d)


composition with four functions
(comp4 :: (d -> e) -> (c -> d) -> (b -> c) -> (a -> b) -> a -> e)


composition with five functions
(comp5 :: (e -> f) -> (d -> e) -> (c -> d) -> (b -> c) -> (a -> b) -> a -> f)


composition with six functions
(comp6 :: (f -> g) -> (e -> f) -> (d -> e) -> (c -> d) -> (b -> c) -> (a -> b) -> a -> f)


composition with inner binary function
(compgBin :: (c -> d) -> (a -> b -> c) -> a -> b -> d)


composition in the 2nd argument of a binary function
(compSnd :: (a -> c -> d) -> (b -> c) -> a -> b -> d)


first class conditional operator
(cond :: a -> a -> Boolean -> a)


continuation
(cont :: a -> (a -> b) -> b)


fix combinator
(fix :: ((a -> b) -> a -> b) -> a -> b)


function guard
(guard :: (a -> a) -> (a -> Boolean) -> a -> a)


function guard with default value
(guardOr :: (a -> b) -> (a -> Boolean) -> b -> a -> b)


identity function
(id :: a -> a)


monadic join
(join :: (r -> r -> a) -> r -> a)


applicative lift
(liftA2 :: (b -> c -> d) -> (a -> b) -> (a -> c) -> a -> d)


on combinator
(on :: (b -> b -> c) -> (a -> b) -> a -> a -> c)


rotate arguments left
(rotateL :: (a -> b -> c -> d) -> b -> c -> a -> d)


rotate arguments right
(rotateR :: (a -> b -> c -> d) -> c -> a -> b -> d)


tap function
(tap :: (a -> b) -> a -> b)
```

## Predefined Types

### Reader

```
Reader
(Reader :: (e -> a) -> Reader<e, a>)


perform effect and extract value
(runReader :: Reader<e, a> -> e -> a)


functorial map
(map :: (e -> a) -> Reader<e, a> -> Reader<e, b>)


applicative/monadic of
(of :: a -> Reader<e, a>)


applicative apply
(ap :: Reader<e, (a -> b)> -> Reader<e, a> -> Reader<e, b>)


monadic join
(join :: Reader<e, Reader<e, a>> -> Reader<e, a>)


monadic chain
(chain :: (a -> Reader<e, b>) -> Reader<e, a> -> Reader<e, b>)


identity
(ask :: () -> Reader<e, e>)


asks?
(asks :: (e -> a) -> Reader<e, a>)


contramap
(local :: (e -> e) -> Reader<e, a> -> Reader<e, a>)
```

# TODO

* tail recursion
* fixed point combinators (anonymous recursion)
* monoidal transducer
* functional lenses
* zipper
* kleisli
* coyoneda
* purely functional iterator
* fold with short circuit
* list comprehension
* pattern matching
* guards
* recursion helper
* let expressions
* indexed subranges

* Reader/ReaderT
* Writer/WriterT
* State/StateT
* Cont/ContT (continuation)
* Future/FutureT ?
* Defer/DeferT (by-name evaluation)
* Comonads

* Arr
* Tup
* Rec
* Map
* Set
* Queue
* Stack
* Heap
* Ident
* Const
* Either
* Option
* Free
* Arrow
* Validation
* Behavior
* Event
* List
* Rose Tree
* Binary Sarch Tree
* Finger Tree
* Red-Black Tree
* Trie
* Vector
* Graph