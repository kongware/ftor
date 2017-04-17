"use strict";


// dependencies


const LT = require("../../sum/ordering/LT");
const EQ = require("../../sum/ordering/EQ");
const GT = require("../../sum/ordering/GT");
const Single = require("./Single");


/**
 * @name Ord type class
 * @type type representative
 * @kind * -> *
 */


const Ord = {};


/**
 * @name compare
 * @type higher order function
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const Pair = (x, y) => f => f(x, y);

   const Ord = {};

   Ord.compare2 = (Rep1, Rep2) => t2 => t1 => t1((w, x) => t2((y, z) => {
     switch (Rep1.compare(y) (w).tag) {
       case "LT": return LT;
       case "GT": return GT;
       case "EQ": {
         switch (Rep2.compare(z) (x).tag) {
           case "LT": return LT;
           case "GT": return GT;
           case "EQ": return EQ;
         }
       }
     }
   }));

   const pair1 = Pair(2, "a");
   const pair2 = Pair(2, "b");
   const pair3 = Pair(1, "b");

   const Num = {compare: y => x => x < y ? LT : y < x ? GT : EQ}
   const Str = {compare: y => x => x < y ? LT : y < x ? GT : EQ}

   Ord.compare2(Num, Str) (pair2) (pair1); // LT
   Ord.compare2(Num, Str) (pair3) (pair1); // GT

 */


// Ord a => Object -> (a -> b) -> (a -> b) -> Ordering
Ord.compare = Rep => t2 => t1 => t1(x => t2(y => Rep.compare(y) (x)));


// (Ord a, Ord b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> Ordering
Ord.compare2 = (Rep1, Rep2) => t2 => t1 => t1((w, x) => t2((y, z) => {
  switch (Rep1.compare(y) (w).tag) {
    case "LT": return LT;
    case "GT": return GT;
    case "EQ": {
      switch (Rep2.compare(z) (x).tag) {
        case "LT": return LT;
        case "GT": return GT;
        case "EQ": return EQ;
      }
    }
  }
}));


// (Ord a, Ord b, Ord c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> Ordering
Ord.compare3 = (Rep1, Rep2, Rep3) => t2 => t1 => t1((u, v, w) => t2((x, y, z) => {
  switch (Rep1.compare(x) (u).tag) {
    case "LT": return LT;
    case "GT": return GT;
    case "EQ": {
      switch (Rep2.compare(y) (v).tag) {
        case "LT": return LT;
        case "GT": return GT;
        case "EQ": {
          switch (Rep3.compare(z) (w).tag) {
            case "LT": return LT;
            case "GT": return GT;
            case "EQ": return EQ;
          }
        }
      }
    }
  }
}));


// (Ord a, Ord b, Ord c, Ord d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> Ordering
Ord.compare4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => t1((s, t, u, v) => t2((w, x, y, z) => {
  switch (Rep1.compare(w) (s).tag) {
    case "LT": return LT;
    case "GT": return GT;
    case "EQ": {
      switch (Rep2.compare(x) (t).tag) {
        case "LT": return LT;
        case "GT": return GT;
        case "EQ": {
          switch (Rep3.compare(y) (u).tag) {
            case "LT": return LT;
            case "GT": return GT;
            case "EQ": {
              switch (Rep4.compare(z) (v).tag) {
                case "LT": return LT;
                case "GT": return GT;
                case "EQ": return EQ;
              }
            }
          }
        }
      }
    }
  }
}));


// (Ord a, Ord b, Ord c, Ord d, Ord e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> Ordering
Ord.compare5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => t1((q, r, s, t, u) => t2((v, w, x, y, z) => {
  switch (Rep1.compare(v) (q).tag) {
    case "LT": return LT;
    case "GT": return GT;
    case "EQ": {
      switch (Rep2.compare(w) (r).tag) {
        case "LT": return LT;
        case "GT": return GT;
        case "EQ": {
          switch (Rep3.compare(x) (s).tag) {
            case "LT": return LT;
            case "GT": return GT;
            case "EQ": {
              switch (Rep4.compare(y) (t).tag) {
                case "LT": return LT;
                case "GT": return GT;
                case "EQ": {
                  switch (Rep5.compare(z) (u).tag) {
                    case "LT": return LT;
                    case "GT": return GT;
                    case "EQ": return EQ;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}));


/**
 * @name lower than
 * @type higher order function
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const Pair = (x, y) => f => f(x, y);

   const Ord = {};

   Ord.compare2 = (Rep1, Rep2) => t2 => t1 => t1((w, x) => t2((y, z) => {
     switch (Rep1.compare(y) (w).tag) {
       case "LT": return LT;
       case "GT": return GT;
       case "EQ": {
         switch (Rep2.compare(z) (x).tag) {
           case "LT": return LT;
           case "GT": return GT;
           case "EQ": return EQ;
         }
       }
     }
   }));

   Ord.lt2 = (Rep1, Rep2) => t2 => t1 => Ord.compare2(Rep1, Rep2) (t2) (t1).tag === "LT";

   const Num = {compare: y => x => x < y ? LT : y < x ? GT : EQ}
   const Str = {compare: y => x => x < y ? LT : y < x ? GT : EQ}

   const pair1 = Pair(2, "a");
   const pair2 = Pair(2, "b");
   const pair3 = Pair(1, "b");

   Ord.lt2(Num, Str) (pair2) (pair1); // true
   Ord.lt2(Num, Str) (pair3) (pair1); // false

 */


// Ord a => Object -> (a -> b) -> (a -> b) -> Boolean
Ord.lt = Rep => t2 => t1 => t1(x => t2(y => Rep.lt(y) (x)));


// (Ord a, Ord b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> Boolean
Ord.lt2 = (Rep1, Rep2) => t2 => t1 => compare2(Rep1, Rep2) (t2) (t1).tag === "LT";


// (Ord a, Ord b, Ord c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> Boolean
Ord.lt3 = (Rep1, Rep2, Rep3) => t2 => t1 => compare3(Rep1, Rep2, Rep3) (t2) (t1).tag === "LT";


// (Ord a, Ord b, Ord c, Ord d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> Boolean
Ord.lt4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => compare4(Rep1, Rep2, Rep3, Rep4) (t2) (t1).tag === "LT";


// (Ord a, Ord b, Ord c, Ord d, Ord e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> Boolean
Ord.lt5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => compare5(Rep1, Rep2, Rep3, Rep4, Rep5) (t2) (t1).tag === "LT";


/**
 * @name lower than or equal
 * @type higher order function
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const Pair = (x, y) => f => f(x, y);

   const Ord = {};

   Ord.compare2 = (Rep1, Rep2) => t2 => t1 => t1((w, x) => t2((y, z) => {
     switch (Rep1.compare(y) (w).tag) {
       case "LT": return LT;
       case "GT": return GT;
       case "EQ": {
         switch (Rep2.compare(z) (x).tag) {
           case "LT": return LT;
           case "GT": return GT;
           case "EQ": return EQ;
         }
       }
     }
   }));

   Ord.lte2 = (Rep1, Rep2) => t2 => t1 => {
     switch (Ord.compare2(Rep1, Rep2) (t2) (t1).tag) {
       case "LT":
       case "EQ": return true;
       default: return false;
     }
   };

   const Num = { compare: y => x => x < y ? LT : y < x ? GT : EQ }
   const Str = { compare: y => x => x < y ? LT : y < x ? GT : EQ }

   const pair1 = Pair(2, "a");
   const pair2 = Pair(2, "b");
   const pair3 = Pair(2, "a");
   const pair4 = Pair(1, "b");

   Ord.lte2(Num, Str) (pair2) (pair1); // true
   Ord.lte2(Num, Str) (pair3) (pair1); // true
   Ord.lte2(Num, Str) (pair4) (pair1); // false

 */


// Ord a => Object -> (a -> b) -> (a -> b) -> Boolean
Ord.lte = Rep => t2 => t1 => t1(x => t2(y => Rep.lte(y) (x)));


// (Ord a, Ord b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> Boolean
Ord.lte2 = (Rep1, Rep2) => t2 => t1 => {
  switch (compare2(Rep1, Rep2) (t2) (t1).tag) {
    case "LT":
    case "EQ": return true;
    default: return false;
  }
};


// (Ord a, Ord b, Ord c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> Boolean
Ord.lte3 = (Rep1, Rep2, Rep3) => t2 => t1 => {
  switch (compare3(Rep1, Rep2, Rep3) (t2) (t1).tag) {
    case "LT":
    case "EQ": return true;
    default: return false;
  }
};


// (Ord a, Ord b, Ord c, Ord d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> Boolean
Ord.lte4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => {
  switch (compare4(Rep1, Rep2, Rep3, Rep4) (t2) (t1).tag) {
    case "LT":
    case "EQ": return true;
    default: return false;
  }
};


// (Ord a, Ord b, Ord c, Ord d, Ord e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> Boolean
Ord.lte5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => {
  switch (compare5(Rep1, Rep2, Rep3, Rep4, Rep5) (t2) (t1).tag) {
    case "LT":
    case "EQ": return true;
    default: return false;
  }
};


/**
 * @name greater than
 * @type higher order function
 * @example

   @see lt

 */


// Ord a => Object -> (a -> b) -> (a -> b) -> Boolean
Ord.gt = Rep => t2 => t1 => t1(x => t2(y => Rep.gt(y) (x)));


// (Ord a, Ord b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> Boolean
Ord.gt2 = (Rep1, Rep2) => t2 => t1 => Ord.compare2(Rep1, Rep2) (t2) (t1).tag === "GT";


// (Ord a, Ord b, Ord c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> Boolean
Ord.gt3 = (Rep1, Rep2, Rep3) => t2 => t1 => Ord.compare3(Rep1, Rep2, Rep3) (t2) (t1).tag === "GT";


// (Ord a, Ord b, Ord c, Ord d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> Boolean
Ord.gt4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => Ord.compare4(Rep1, Rep2, Rep3, Rep4) (t2) (t1).tag === "GT";


// (Ord a, Ord b, Ord c, Ord d, Ord e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> Boolean
Ord.gt5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => Ord.compare5(Rep1, Rep2, Rep3, Rep4, Rep5) (t2) (t1).tag === "GT";


/**
 * @name greater than or equal
 * @type higher order function
 * @example

   @see lte

 */


// Ord a => Object -> (a -> b) -> (a -> b) -> Boolean
Ord.gte = Rep => t2 => t1 => t1(x => t2(y => Rep.gte(y) (x)));


// (Ord a, Ord b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> Boolean
Ord.gte2 = (Rep1, Rep2) => t2 => t1 => {
  switch (compare2(Rep1, Rep2) (t2) (t1).tag) {
    case "EQ":
    case "GT": return true;
    default: return false;
  }
};


// (Ord a, Ord b, Ord c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> Boolean
Ord.gte3 = (Rep1, Rep2, Rep3) => t2 => t1 => {
  switch (compare3(Rep1, Rep2, Rep3) (t2) (t1).tag) {
    case "EQ":
    case "GT": return true;
    default: return false;
  }
};


// (Ord a, Ord b, Ord c, Ord d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> Boolean
Ord.gte4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => {
  switch (compare4(Rep1, Rep2, Rep3, Rep4) (t2) (t1).tag) {
    case "EQ":
    case "GT": return true;
    default: return false;
  }
};


// (Ord a, Ord b, Ord c, Ord d, Ord e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> Boolean
Ord.gte5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => {
  switch (compare5(Rep1, Rep2, Rep3, Rep4, Rep5) (t2) (t1).tag) {
    case "EQ":
    case "GT": return true;
    default: return false;
  }
};


/**
 * @name minimal
 * @type higher order function
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const Pair = (x, y) => f => f(x, y);
   const toArray = (...args) => args;

   const Ord = {};

   Ord.compare2 = (Rep1, Rep2) => t2 => t1 => t1((w, x) => t2((y, z) => {
     switch (Rep1.compare(y) (w).tag) {
       case "LT": return LT;
       case "GT": return GT;
       case "EQ": {
         switch (Rep2.compare(z) (x).tag) {
           case "LT": return LT;
           case "GT": return GT;
           case "EQ": return EQ;
         }
       }
     }
   }));

   Ord.min2 = (Rep1, Rep2) => t2 => t1 => {
     switch (Ord.compare2(Rep1, Rep2) (t2) (t1).tag) {
       case "GT": return t2;
       default: return t1;
     }
   };

   const Num = {compare: y => x => x < y ? LT : y < x ? GT : EQ}
   const Str = {compare: y => x => x < y ? LT : y < x ? GT : EQ}

   const pair1 = Pair(2, "a");
   const pair2 = Pair(2, "b");
   const pair3 = Pair(1, "b");

   Ord.min2(Num, Str) (pair2) (pair1) (toArray); // [2, "a"]
   Ord.min2(Num, Str) (pair3) (pair1) (toArray); // [1, "b"]

 */


// Ord a => Object -> (a -> b) -> (a -> b) -> (a -> b)
Ord.min = Rep => t2 => t1 => t1(x => t2(y => Single(Rep.min(y) (x))));


// (Ord a, Ord b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> ((a, b) -> c)
Ord.min2 = (Rep1, Rep2) => t2 => t1 => {
  switch (compare2(Rep1, Rep2) (t2) (t1).tag) {
    case "GT": return t2;
    default: return t1;
  }
};


// (Ord a, Ord b, Ord c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> ((a, b, c) -> d)
Ord.min3 = (Rep1, Rep2, Rep3) => t2 => t1 => {
  switch (compare3(Rep1, Rep2, Rep3) (t2) (t1).tag) {
    case "GT": return t2;
    default: return t1;
  }
};


// (Ord a, Ord b, Ord c, Ord d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e)
Ord.min4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => {
  switch (compare4(Rep1, Rep2, Rep3, Rep4) (t2) (t1).tag) {
    case "GT": return t2;
    default: return t1;
  }
};


// (Ord a, Ord b, Ord c, Ord d, Ord e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f)
Ord.min5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => {
  switch (compare5(Rep1, Rep2, Rep3, Rep4, Rep5) (t2) (t1).tag) {
    case "GT": return t2;
    default: return t1;
  }
};


/**
 * @name maximal
 * @type higher order function
 * @example

   @see min

 */


// Ord a => Object -> (a -> b) -> (a -> b) -> (a -> b)
Ord.max = Rep => t2 => t1 => t1(x => t2(y => Single(Rep.max(y) (x))));


// (Ord a, Ord b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> ((a, b) -> c)
Ord.max2 = (Rep1, Rep2) => t2 => t1 => {
  switch (compare2(Rep1, Rep2) (t2) (t1).tag) {
    case "LT": return t2;
    default: return t1;
  }
};


// (Ord a, Ord b, Ord c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> ((a, b, c) -> d)
Ord.max3 = (Rep1, Rep2, Rep3) => t2 => t1 => {
  switch (compare3(Rep1, Rep2, Rep3) (t2) (t1).tag) {
    case "LT": return t2;
    default: return t1;
  }
};


// (Ord a, Ord b, Ord c, Ord d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e)
Ord.max4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => {
  switch (compare4(Rep1, Rep2, Rep3, Rep4) (t2) (t1).tag) {
    case "LT": return t2;
    default: return t1;
  }
};


// (Ord a, Ord b, Ord c, Ord d, Ord e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f)
Ord.max5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => {
  switch (compare5(Rep1, Rep2, Rep3, Rep4, Rep5) (t2) (t1).tag) {
    case "LT": return t2;
    default: return t1;
  }
};


// API


module.exports = Ord;