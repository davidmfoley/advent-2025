import { expect, test } from 'vitest'
import { fileReader, nonBlankLines } from '../utils/fileReader'

type Location = [number, number, number]

const parseJunctionBoxLocations = (s: string) =>
  nonBlankLines(s).map((l) => l.split(',').map(Number) as Location)

const readInput = fileReader(__dirname, parseJunctionBoxLocations)

// don't care about the actual distance, just relative, so skip the sqrt step
const calculateDistance = ([ax, ay, az]: Location, [bx, by, bz]: Location) =>
  (bx - ax) ** 2 + (by - ay) ** 2 + (bz - az) ** 2

const allConnectionsSortedByLength = (locations: Location[]) => {
  const connections = [] as [number, number, number][]

  for (let leftIndex = 0; leftIndex < locations.length; leftIndex++) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < locations.length;
      rightIndex++
    ) {
      const distance = calculateDistance(
        locations[leftIndex],
        locations[rightIndex]
      )
      connections.push([distance, leftIndex, rightIndex])
    }
  }

  connections.sort((a, b) => a[0] - b[0])

  return connections.map(([, left, right]) => [left, right])
}

const findShortestConnections = (
  locations: Location[],
  connectionCount: number
) => allConnectionsSortedByLength(locations).slice(0, connectionCount)

class Circuits {
  boxToCircuit = new Map<number, number>()
  circuitToBoxes = new Map<number, Set<number>>()
  nextCircuitIndex = 1

  connect(left: number, right: number) {
    const leftCircuit = this.boxToCircuit.get(left)
    const rightCircuit = this.boxToCircuit.get(right)

    if (leftCircuit) {
      if (rightCircuit) {
        if (rightCircuit !== leftCircuit) {
          for (let box of this.circuitToBoxes.get(rightCircuit)) {
            this.assignBoxToCircuit(box, leftCircuit)
          }
          this.circuitToBoxes.delete(rightCircuit)
        }
      } else {
        this.assignBoxToCircuit(right, leftCircuit)
      }
    } else if (rightCircuit) {
      this.assignBoxToCircuit(left, rightCircuit)
    } else {
      this.circuitToBoxes.set(this.nextCircuitIndex, new Set())
      this.assignBoxToCircuit(left, this.nextCircuitIndex)
      this.assignBoxToCircuit(right, this.nextCircuitIndex)
      this.nextCircuitIndex++
    }
  }

  private assignBoxToCircuit(box: number, circuit: number) {
    this.boxToCircuit.set(box, circuit)
    this.circuitToBoxes.get(circuit).add(box)
  }

  get circuitCount() {
    return this.circuitToBoxes.size
  }

  get topCircuits() {
    return [...this.circuitToBoxes.values()].sort((a, b) => b.size - a.size)
  }
}

const makeCircuitsFromShortestNConnections = (
  locations: Location[],
  connectionCount: number
) => {
  const shortestConnections = findShortestConnections(
    locations,
    connectionCount
  )

  const circuits = new Circuits()

  for (let [left, right] of shortestConnections) {
    circuits.connect(left, right)
  }

  return circuits.topCircuits
}

const part1 = (
  input: Location[],
  connectionCount: number,
  circuitCount: number
) => {
  const circuits = makeCircuitsFromShortestNConnections(input, connectionCount)

  return circuits.slice(0, circuitCount).reduce((acc, c) => c.size * acc, 1)
}

const part2 = (input: Location[]) => {
  const connections = allConnectionsSortedByLength(input)

  const circuits = new Circuits()

  for (let [left, right] of connections) {
    circuits.connect(left, right)

    if (
      circuits.circuitCount === 1 &&
      circuits.topCircuits[0].size === input.length
    ) {
      return input[left][0] * input[right][0]
    }
  }
}

test('parse input', () => {
  const exampleInput = readInput('exampleInput.txt')
  expect(exampleInput.length).toEqual(20)
  expect(exampleInput[0]).toEqual([162, 817, 812])
  expect(exampleInput[19]).toEqual([425, 690, 689])
})

test('find shortest connection', () => {
  const exampleInput = readInput('exampleInput.txt')
  const connections = findShortestConnections(exampleInput, 5)
  expect(connections[0]).toEqual([0, 19])
})

test('part 1 circuits', () => {
  const exampleInput = readInput('exampleInput.txt')
  const circuits = makeCircuitsFromShortestNConnections(exampleInput, 10)
  expect(circuits[0].size).toEqual(5)
})

test('part 1 example answer', () => {
  const exampleInput = readInput('exampleInput.txt')
  const solution = part1(exampleInput, 10, 3)
  expect(solution).toEqual(40)
})

test('part 2 example answer', () => {
  const exampleInput = readInput('exampleInput.txt')
  const solution = part2(exampleInput)
  expect(solution).toEqual(25272)
})

test('answers', () => {
  const input = readInput('input.txt')
  console.log('08 pt 1', part1(input, 1000, 3))
  console.log('08 pt 2', part2(input))
})
