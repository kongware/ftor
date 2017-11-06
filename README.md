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

Version 0.9.0 is coming...

**Please note:** This repo is experimental and still work in progress.
<br><br>

## What

ftor enables ML-like type-directed, functional programming in Javascript and offers useful debugging tools.

## Why

Functional programming in Javascript is frustrating as soon as you leave contrieved examples behind and try to solve real world problems, because...

* beyond first class functions Javascript doesn't offer much on a native level
* there is only a relatively small ecosystem and an insufficient tooling
* there is no type system preventing you from writing bad algorithms

# Type System

At its core ftor consists of a run-time type system with the following features:

* pluggable type system
* parametric polymorphism
* higher kinded types
* higher rank types (rank-2)
* homogeneous arrays, tuples, maps, records
* and real tagged unions

The type system can be switched on and off at run-time. Ideally, it is activated during the development stage and switched off on the production system.

Unfortunately, there is no way to enable bounded polymorphism within a pluggable run-time type system without an additional compiling step. For the time being ftor will provide bounded polymorphism merely through explict type dictionary passing.

Since we're still dealing with Javascript ftor pursues a <a href="https://eschew.wordpress.com/2009/08/31/sound-and-complete/">complete and hence unsound evaluation procedure</a>, which is mostly <a href="https://en.wikipedia.org/wiki/Nominal_type_system">nominal typed</a>.

ftor incorporates Javascript's native types in order to allow the creation of idiomatic code. This is of course a tradeoff that is at the expense of type safety.

As opposed to _flow_ and _typescript_ ftor doesn't support subtype polymorphism, because it entails high complexity, such as different forms of type variance, e.g. <a href="https://flow.org/blog/2016/10/04/Property-Variance/">property variance</a> and it has irritating properties like <a href="https://brianmckenna.org/blog/row_polymorphism_isnt_subtyping">automatic upcasting</a>. Instead of subtyping ftor offers bounded structural typing, which has similar characteristics.

Let's get to the individual types without any further ado.

## Function Type

...