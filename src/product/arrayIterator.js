"use strict";

const arrayIterator = xs => {
  const aux = i => {
    const curr = f => xs[i];

    const currKey = f => i;

    const currPair = f => [i, xs[i]];

    const look = n => xs[i + n];
    
    const next = () => aux(i + 1);
    
    const prev = f => xs[i - 1];

    const prevKey = f => i - 1;

    const prevPair = f => [i - 1, xs[i - 1]];

    const iterable = { 
      [Symbol.iterator]: (j = i) => ({
        next: () => j in xs 
         ? {value: ++j, done: false}
         : {value: undefined, done: true}
      })
    };

    return k => k(
      {curr, currKey, currPair, iterable, look, next, prev, prevKey, prevPair}
    );
  };

  return aux(0);
};

const curr = api => api.curr();

const currKey = api => api.currKey();

const currPair = api => api.currPair();

const iterable = api => api.iterable;

const look = n => api => api.look(n);

const next = api => api.next();

const prev = api => api.prev();

const prevKey = api => api.prevKey();

const prevPair = api => api.prevPair();

module.exports = {ArrayIterator, curr, currKey, currPair, iterable, look, next, prev, prevKey, prevPair};