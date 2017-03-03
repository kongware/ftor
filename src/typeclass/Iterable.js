// The Iterbale type class provides an interface to lazily iterate a composite type. The following code merely desicribes the type class and solely serves for documentary purpose.

const Iterable = {
  /**
   * Index of the composite type that points to its current element.
   */
  i: undefined,

  /**
   * Composite type (data source).
   */
  x: undefined,

  /**
   * Syntactic sugar for look(0).
   * @sign () -> a
   */
  curr: () => undefined,

  /**
   * Look up either the current element, any preceding or any subsequent element of the Iterable without altering any state.
   * @sign () -> a
   */
  look: n => undefined,

  /**
   * Creates a new iterator that points to the next element of the Iterable and returns either the iterator or a pair containing the iterator and the next element. The return value depends on the passed function.
   * @sign (a -> b) -> b
   */
  next: f => undefined,

  /**
   * Syntactic sugar for look(-1).
   * @sign () -> a
   */
  prev: () => undefined
};