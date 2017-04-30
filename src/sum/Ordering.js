"use strict";


/**
 * @name Ordering
 * @note tagged union
 * @type type representative
 * @kind *
 * @status stable
 */


const Ordering = {};


// constructors


const LT = ({type: Ordering, tag: "LT"});
Ordering.LT = LT;

const EQ = ({type: Ordering, tag: "EQ"});
Ordering.EQ = EQ;

const GT = ({type: Ordering, tag: "GT"});
Ordering.GT = GT;


// catamorphism


/**
 * @name ordering
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   Ordering.ordering = pattern => ({tag}) => pattern[tag]();

   const LT = ({type: Ordering, tag: "LT"});

   Ordering.ordering({LT: () => "lower than", EQ: () => "equal", GT: () => "greater than"}) (LT); // "lower than"

 */


// Object -> Ordering -> a
Ordering.ordering = pattern => ({tag}) => pattern[tag]();


// Bounded


/**
 * @name minimum bound
 * @type constant
 * @status stable
 */


// Ordering
Ordering.minBound = LT;


/**
 * @name maximum bound
 * @type constant
 * @status stable
 */


// Ordering
Ordering.maxBound = GT;


// Enum


/**
 * @name successor
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};

   Ordering.succ = ({tag}) => ({
     LT: EQ,
     EQ: GT,
     GT: null
   })[tag];

   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   Ordering.succ(EQ); // GT
   Ordering.succ(GT); // null

 */


// Ordering -> Ordering
Ordering.succ = ({tag}) => ({
  LT: EQ,
  EQ: GT,
  GT: null
})[tag];


/**
 * @name predessor
 * @type first order function
 * @status stable
 * @example

   @see succ

 */


// Ordering -> Ordering
Ordering.pred = ({tag}) => ({
  LT: null,
  EQ: LT,
  GT: EQ
})[tag];


/**
 * @name to enumeration
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   Ordering.toEnum = n => [LT, EQ, GT][n];

   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   Ordering.toEnum(0); // LT
   Ordering.toEnum(1); // EQ
   Ordering.toEnum(2); // GT

 */


// Number -> Ordering
Ordering.toEnum = n => [LT, EQ, GT][n];


/**
 * @name from enumeration
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   Ordering.fromEnum = ({tag}) => ({LT: 0, EQ: 1, GT: 2})[tag];

   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   Ordering.fromEnum(LT); // 0
   Ordering.fromEnum(EQ); // 1
   Ordering.fromEnum(GT); // 2

 */


// Ordering -> Number
Ordering.fromEnum = ({tag}) => ({LT: 0, EQ: 1, GT: 2})[tag];


/**
 * @name enumeration from
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};

   Ordering.succ = ({tag}) => ({
     LT: EQ,
     EQ: GT,
     GT: null
   })[tag];

   Ordering.enumFrom = t => {
     const aux = (x, acc) => x === null
      ? acc
      : aux(Ordering.succ(x), acc.concat(x));

     return aux(t, []);
   };

   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   Ordering.enumFrom(LT); // [LT, EQ, GT]
   Ordering.enumFrom(EQ); // [EQ, GT]

 */


// Number -> Ordering
Ordering.enumFrom = t => {
  const aux = (x, acc) => x === null
   ? acc
   : aux(Ordering.succ(x), acc.concat(x));

  return aux(t, []);
};


// Ord


/**
 * @name compare
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   Ordering.fromEnum = ({tag}) => ({LT: 0, EQ: 1, GT: 2})[tag];
   
   Ordering.compare = t1 => t2 => {
     const x = Ordering.fromEnum(t1),
      y  = Ordering.fromEnum(t2);

     return x < y ? LT
      : x > y ? GT
      : EQ;
   };

   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   Ordering.compare(EQ) (GT); // LT
   Ordering.compare(GT) (GT); // EQ
   Ordering.compare(GT) (LT); // GT

 */


// Ordering -> Ordering -> Ordering
Ordering.compare = t1 => t2 => {
  const x = Ordering.fromEnum(t1),
   y  = Ordering.fromEnum(t2);

  return x < y ? LT
   : x > y ? GT
   : EQ;
};


// Ordering -> Ordering -> Ordering
Ordering.compare_ = t2 => t1 => {
  const x = Ordering.fromEnum(t1),
   y  = Ordering.fromEnum(t2);

  return x < y ? LT
   : x > y ? GT
   : EQ;
};


/**
 * @name lower than
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   Ordering.fromEnum = ({tag}) => ({LT: 0, EQ: 1, GT: 2})[tag];
   Ordering.lt = t1 => t2 => Ordering.fromEnum(t1) < Ordering.fromEnum(t2);

   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   Ordering.lt(EQ) (GT); // true

 */


// Ordering -> Ordering -> Boolean
Ordering.lt = t1 => t2 => Ordering.fromEnum(t1) < Ordering.fromEnum(t2);


// Ordering -> Ordering -> Boolean
Ordering.lt_ = t2 => t1 => Ordering.fromEnum(t1) < Ordering.fromEnum(t2);


/**
 * @name lower than or equal
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   Ordering.fromEnum = ({tag}) => ({LT: 0, EQ: 1, GT: 2})[tag];
   Ordering.lte = t1 => t2 => Ordering.fromEnum(t1) <= Ordering.fromEnum(t2);

   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   Ordering.lte(EQ) (GT); // true
   Ordering.lte(GT) (GT); // true

 */


// Ordering -> Ordering -> Boolean
Ordering.lte = t1 => t2 => Ordering.fromEnum(t1) <= Ordering.fromEnum(t2);


// Ordering -> Ordering -> Boolean
Ordering.lte_ = t2 => t1 => Ordering.fromEnum(t1) <= Ordering.fromEnum(t2);


/**
 * @name greater than
 * @type first order function
 * @status stable
 * @example

   @see Ordering.gt

 */


// Ordering -> Ordering -> Boolean
Ordering.gt = t1 => t2 => Ordering.fromEnum(t1) > Ordering.fromEnum(t2);


// Ordering -> Ordering -> Boolean
Ordering.gt_ = t2 => t1 => Ordering.fromEnum(t1) > Ordering.fromEnum(t2);


/**
 * @name greater than or equal
 * @type first order function
 * @status stable
 * @example

   @see Ordering.lte

 */


// Ordering -> Ordering -> Boolean
Ordering.gte = t1 => t2 => Ordering.fromEnum(t1) >= Ordering.fromEnum(t2);


// Ordering -> Ordering -> Boolean
Ordering.gte_ = t2 => t1 => Ordering.fromEnum(t1) >= Ordering.fromEnum(t2);


/**
 * @name minimum
 * @note commutative
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   Ordering.fromEnum = ({tag}) => ({LT: 0, EQ: 1, GT: 2})[tag];
   Ordering.min = t1 => t2 => Ordering.fromEnum(t1) <= Ordering.fromEnum(t2) ? t1 : t2;

   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   Ordering.min(GT) (LT); // LT
   Ordering.min(EQ) (GT); // EQ

 */


// Ordering -> Ordering -> Ordering
Ordering.min = t1 => t2 => Ordering.fromEnum(t1) <= Ordering.fromEnum(t2) ? t1 : t2;


/**
 * @name maximum
 * @note commutative
 * @type first order function
 * @status stable
 * @example

   @see Ordering.min

 */


// Ordering -> Ordering -> Ordering
Ordering.max = t1 => t2 => Ordering.fromEnum(t1) >= Ordering.fromEnum(t2) ? t1 : t2;


// Setoid


/**
 * @name equal
 * @note commutative
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   Ordering.eq = ({tag: x}) => ({tag: y}) => x === y;

   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   Ordering.eq(LT) (LT); // true
   Ordering.eq(EQ) (LT); // false

 */


// Ordering -> Ordering -> Boolean
Ordering.eq = ({tag: x}) => ({tag: y}) => x === y;


/**
 * @name not equal
 * @note commutative
 * @type first order function
 * @status stable
 * @example

   @see eq

 */


// Ordering -> Ordering -> Boolean
Ordering.neq = ({tag: x}) => ({tag: y}) => x !== y;


// Semigroup


/**
 * @name concatenate
 * @note associative
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   Ordering.concat = ({tag: x}) => t => ({LT, EQ: t, GT})[x];

   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   Ordering.concat(LT) (LT); // LT
   Ordering.concat(LT) (EQ); // LT
   Ordering.concat(GT) (LT); // GT
   Ordering.concat(EQ) (LT); // LT

 */


// Ordering -> Ordering -> Ordering
Ordering.concat = ({tag}) => t => ({LT, EQ: t, GT})[tag];


// Ordering -> Ordering -> Ordering
Ordering.concat_ = t => ({tag}) => ({LT, EQ: t, GT})[tag];


// Monoid


/**
 * @name empty
 * @type identity element
 * @status stable
 */


// Ordering
Ordering.empty = EQ;


// API


module.exports = Ordering;