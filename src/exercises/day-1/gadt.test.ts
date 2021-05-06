import { evaluate, program } from "./03-gadt"

describe("Math", () => {
  it("should work", () => {
    expect(evaluate(program)).toBe("25")
  })
})
