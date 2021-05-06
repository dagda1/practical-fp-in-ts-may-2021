import { evaluate, program } from "./04-existential"

describe("Math", () => {
  it("should work", () => {
    expect(evaluate(program)).toBe("12pizza")
  })
})
