import { expect, test } from 'vitest'
import { fileReader, nonBlankLines } from '../utils/fileReader'

type Operator = '+' | '*'

interface Problem {
  values: number[]
  operator: Operator
}

const ops: Record<Operator, (a: number, b: number) => number> = {
  '+': (a, b) => a + b,
  '*': (a, b) => a * b,
}

const solveProblem = (problem: Problem) =>
  problem.values.reduce(ops[problem.operator])

type Problems = Problem[]

const solveProblems = (problems: Problems) =>
  problems.reduce((acc, problem) => acc + solveProblem(problem), 0)

const extractNumbers = (line: string) =>
  line
    .split(/ +/g)
    .map(Number)
    .filter((n) => n > 0)

const extractOperators = (line: string) =>
  line.split(/ +/g).filter(Boolean) as Operator[]

const parseMathProblemsHorizontal = (s: string) => {
  const lines = nonBlankLines(s)
  const operatorsLine = lines.pop()
  const operators = extractOperators(operatorsLine)

  let problems = operators.map((operator) => ({
    operator,
    values: [],
  })) as Problems

  for (let line of lines) {
    const numbers = extractNumbers(line)
    numbers.forEach((value, i) => {
      problems[i].values.push(value)
    })
  }
  return problems
}

const readInputFilePart1 = fileReader(__dirname, parseMathProblemsHorizontal)

const rtlReader = (s: string) => {
  const lines = nonBlankLines(s)
  let charsPerLine = lines.map((l) => l.split(''))
  return {
    next: () => charsPerLine.map((l) => l.pop()),
    empty: () => charsPerLine[0].length === 0,
  }
}

const parseMathProblemsVertical = (s: string) => {
  const reader = rtlReader(s)

  const problems = [] as Problems
  let values = [] as number[]

  while (!reader.empty()) {
    const column = reader.next()
    const operator = column.pop().trim() as Operator | ''

    values.push(Number(column.join('')))

    if (operator) {
      problems.push({ values, operator })
      reader.next()
      values = []
    }
  }

  return problems
}

const readInputFilePart2 = fileReader(__dirname, parseMathProblemsVertical)

test('part1 parse example input', () => {
  expect(readInputFilePart1('exampleInput.txt')).toEqual([
    {
      operator: '*',
      values: [123, 45, 6],
    },
    {
      operator: '+',
      values: [328, 64, 98],
    },
    {
      operator: '*',
      values: [51, 387, 215],
    },
    {
      operator: '+',
      values: [64, 23, 314],
    },
  ])
})

test('part2 parse example input', () => {
  expect(readInputFilePart2('exampleInput.txt')).toEqual([
    {
      operator: '+',
      values: [4, 431, 623],
    },
    {
      operator: '*',
      values: [175, 581, 32],
    },
    {
      operator: '+',
      values: [8, 248, 369],
    },
    {
      operator: '*',
      values: [356, 24, 1],
    },
  ])
})

test('part1 example input', () => {
  const input = readInputFilePart1('exampleInput.txt')
  expect(solveProblems(input)).toEqual(4277556)
})

test('part2 example input', () => {
  const input = readInputFilePart2('exampleInput.txt')
  expect(solveProblems(input)).toEqual(3263827)
})

test('answers', () => {
  const input1 = readInputFilePart1('input.txt')
  console.log('06 pt1', solveProblems(input1))
  const input2 = readInputFilePart2('input.txt')
  console.log('06 pt2', solveProblems(input2))
})
