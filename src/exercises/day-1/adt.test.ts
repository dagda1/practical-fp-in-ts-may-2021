import { evaluate, program } from "./02-adt"

describe("Math", () => {
  it("should work", () => {
    expect(evaluate(program)).toBe(1)
  })
})
