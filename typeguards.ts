type Refinement<T, U extends T> = (candidate: T) => candidate is U;
//type guard is a function that takes a type and tell TS that that type can be narrowed down to something more specific
function isString(candidate: unknown): candidate is string {
  return typeof candidate === 'string';
}

interface Apple {
  species: 'Malus domestica';
}
interface Cucumber {
  species: 'C. sativus';
}

type Fruit = Apple | Cucumber;

declare const basket: Fruit[];
let apples: Apple[];

apples = basket.filter((fruit): boolean => fruit.species === 'Malus domestica');

apples = basket.filter(
  (fruit): fruit is Apple => fruit.species === 'Malus domestica'
);

//type guards themselves are not type checked. for eg
export function isNumber(candidate: unknown): candidate is number {
  return typeof candidate === 'string';
}

/*solution. Cách 1: dùng cái library
export declare function getRefinement<A, B extends A>(getOption: (a: A) => Option<B>): Refinement<A, B> 

import { some, none, getRefinement } from 'fp-ts/lib/Option'

const isString = getRefinement<unknown, string>((candidate) => typeof candidate === 'string' ? some(candidate) : none)
*/

//Cách 2: tự implement
//define our own 'Option'
class Some<T> {
  constructor(readonly value: T) {}
}

class None {}

//https://en.wikipedia.org/wiki/Polymorphism_(computer_science)
type Option<T> = Some<T> | None; //why does it has to be polymorphic?bc it enables TS to infer that type. If it isnt polymorphic theres nothing to infer

function getRefinement<T, U extends T>(
  getOption: (candidate: T) => Option<U>
): Refinement<T, U> {
  //return a function that accepts T and return an Option
  return (candidate: T): candidate is U => getOption(candidate) instanceof Some;
}
