export type DecoratedConstructor<T> = new (...args: any[]) => T;
export type DecoratedAdder<T> = T & {
  add: (path: string, content: string) => void;
};
