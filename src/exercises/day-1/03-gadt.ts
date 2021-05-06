/**
 * Theory:
 *
 * Intro to generalized algebraic data types and their place in functional programming in general.
 *
 * In this module we introduce a generalization to algebraic data types required to deal with generic patameters.
 */

import { identity, pipe } from "@effect-ts/system/Function"

/**
 * Segment:
 *
 * GADTs
 */

/**
 * Exercise:
 *
 * We would like to port over the previous module Expr<number> to a more general Expr<A> having the Math functions
 * restricted to Expr<number>
 */
export type Expr<A> =
  | NumericValue<A>
  | StringValue<A>
  | Add<A>
  | Sub<A>
  | Concat<A>
  | Stringify<A>

export class NumericValue<A> {
  readonly _tag = "NumericValue"
  constructor(readonly value: number, readonly _A: (_: number) => A) {}
}

export class StringValue<A> {
  readonly _tag = "StringValue"
  constructor(readonly value: string, readonly _A: (_: string) => A) {}
}

export class Add<A> {
  readonly _tag = "Add"
  constructor(
    readonly x: Expr<number>,
    readonly y: Expr<number>,
    readonly _A: (_: number) => A
  ) {}
}

export class Sub<A> {
  readonly _tag = "Sub"
  constructor(
    readonly x: Expr<number>,
    readonly y: Expr<number>,
    readonly _A: (_: number) => A
  ) {}
}

export class Concat<A> {
  readonly _tag = "Concat"
  constructor(
    readonly x: Expr<string>,
    readonly y: Expr<string>,
    readonly _A: (_: string) => A
  ) {}
}

export class Stringify<A> {
  readonly _tag = "Stringify"
  constructor(readonly op: Expr<number>, readonly _A: (a: string) => A) {}
}

export function number(value: number): Expr<number> {
  return new NumericValue(value, identity)
}

export function string(value: string): Expr<String> {
  return new StringValue(value, identity)
}

export function add(x: Expr<number>): (x: Expr<number>) => Expr<number> {
  return (y: Expr<number>) => new Add(x, y, identity)
}

export function sub(x: Expr<number>): (x: Expr<number>) => Expr<number> {
  return (y: Expr<number>) => new Sub(x, y, identity)
}

export function concat(x: Expr<string>): (x: Expr<string>) => Expr<string> {
  return (y: Expr<string>) => new Concat(x, y, identity)
}

export function stringify(op: Expr<number>): Expr<string> {
  return new Stringify(op, identity)
}

/**
 * Exercise:
 *
 * Implement the evaluate function
 */
export function evaluate<A>(params: Expr<A>): A {
  switch (params._tag) {
    case "Add":
      return params._A(evaluate(params.x) + evaluate(params.y))
    case "Sub":
      return params._A(evaluate(params.y) - evaluate(params.x))
    case "Concat":
      return params._A(`${evaluate(params.x)}${evaluate(params.y)}`)
    case "Stringify":
      return params._A(`${evaluate(params.op)}`)
    case "NumericValue":
      return params._A(params.value)
    case "StringValue":
      return params._A(params.value)
  }
}

export const program = pipe(
  20,
  number,
  add(pipe(10, number)),
  sub(pipe(5, number)),
  stringify
)

/**
 * Exercise:
 *
 * Extend the Expr GADT to support:
 * 1) StringValue (Expr<string>)
 * 2) Concat (that concatenates 2 Expr<string>)
 * 3) Stringify (that converts Expr<number> into Expr<string>)
 *
 * Updating the interpreter as you go through.
 */

/**
 * Exercise:
 *
 * Write a program that uses the new primitives and test its behaviour
 */
