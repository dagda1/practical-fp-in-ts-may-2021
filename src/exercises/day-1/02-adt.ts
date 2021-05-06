/**
 * Theory:
 *
 * Intro to algebraic data types & domain specific languages and their place in functional programming in general.
 *
 * In this module we introduce the basic concepts of domain specific languages and we look into practical ways of building DSLs for
 * your day-to-day problems.
 */

import { pipe } from "@effect-ts/core"

/**
 * Segment:
 *
 * ADTs
 */

/**
 * Exercise:
 *
 * Costruct the Boolean ADT and 3 functions: equals, invert, render
 */
export class True {
  readonly _tag = "True"
}

export class False {
  readonly _tag = "False"
}

export type BooleanADT = True | False

export declare const trueValue: BooleanADT

export declare const falseValue: BooleanADT

class Value {
  readonly _tag = "Value"
  constructor(readonly value: number) {}
}

class Add {
  readonly _tag = "Add"
  constructor(readonly op1: MathExpr, readonly op2: MathExpr) {}
}

class Sub {
  readonly _tag = "Sub"
  constructor(readonly op1: MathExpr, readonly op2: MathExpr) {}
}

/**
 * Exercise:
 *
 * Build an adt MathExpr with members:
 * - Value (contains a numeric value)
 * - Add (describe a sum operation of 2 expressions)
 * - Sub (describe a subtraction operation of 2 expressions)
 * - Mul (describe a multiplication operation of 2 expressions)
 * - Div (describe a division operation of 2 expressions)
 */
export type MathExpr = Value | Add | Sub

export function value(value: number): MathExpr {
  return new Value(value)
}

export function add(x: MathExpr): (x: MathExpr) => MathExpr {
  return (y: MathExpr) => new Add(x, y)
}

export function sub(x: MathExpr): (x: MathExpr) => MathExpr {
  return (y: MathExpr) => new Sub(x, y)
}

/**
 * Exercise:
 *
 * Create constructors for all the members in MathExpr (pipeable)
 */

/**
 * Exercise:
 *
 * Create a small program using the MathExpr constructors
 */
export const program = pipe(value(0), add(value(4)), sub(value(3)))

/**
 * Exercise:
 *
 * Implement the function evaluate
 */
export function evaluate(expr: MathExpr): number {
  switch (expr._tag) {
    case "Value":
      return expr.value
    case "Add":
      return evaluate(expr.op1) + evaluate(expr.op2)
    case "Sub":
      return evaluate(expr.op2) - evaluate(expr.op1)
  }
}

/**
 * Exercise:
 *
 * Write tests that assert correct behaviour of the evaluate function
 */
