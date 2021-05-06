/**
 * Theory:
 *
 * Intro to existential types and their place in functional programming in general.
 *
 * In this module we introduce existential types as types that exists within a bounded context.
 */

import { identity, pipe } from "@effect-ts/core/Function"

/**
 * Segment:
 *
 * GADTs
 */

/**
 * Exercise:
 *
 * Let's try to implement a Chain primitive that given Expr<A> and a function f : <A, B>(a: A) => Expr<B> returns
 * an Expr<B> that describe the idea of taking the result of an expression and dynamically transform it to another expression.
 */
export type Expr<A> =
  | NumericValue<A>
  | StringValue<A>
  | Add<A>
  | Sub<A>
  | Concat<A>
  | Stringify<A>
  | Chain<A>

export class ChainOps<A, B> {
  constructor(readonly self: Expr<A>, readonly f: (a: A) => Expr<B>) {}
}

export class Chain<A> {
  readonly _tag = "Chain"
  constructor(readonly use: <X>(f: <T>(_: ChainOps<T, A>) => X) => X) {}
}

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

export function chain<A, B>(f: (a: A) => Expr<B>): (self: Expr<A>) => Expr<B> {
  return (self) => new Chain((g) => g(new ChainOps(self, f)))
}

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
    case "Chain":
      return params.use((a) => evaluate(a.f(evaluate(a.self))))
    case "NumericValue":
      return params._A(params.value)
    case "StringValue":
      return params._A(params.value)
  }
}

export const program = pipe(
  number(3),
  add(number(9)),
  chain((n) => string(`${n}`)),
  chain((s) => string(`${s}pizza`))
)
