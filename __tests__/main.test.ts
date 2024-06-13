/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Other utilities
const timeRegex = /^\d{2}:\d{2}:\d{2}/

// Mock the GitHub Actions core library
let debugMock: jest.SpiedFunction<typeof core.debug>
let errorMock: jest.SpiedFunction<typeof core.error>
let getInputMock: jest.SpiedFunction<typeof core.getInput>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>

describe('action', () => {
  it('converts inputs to modules', async () => {
    const modules = main.convertInputToModules([
      "github.com/stretchr/testify=>v1.9.0",
      "github.com/ethereum/go-ethereum => v1.11.5",
      "google.golang.org/protobuf => v1.34.1",
      "google.golang.org/anotherpackage      =>  v1.34.1",
      "google.golang.org/anotherpackage       => v1.34.1        ",
    ])

    expect(modules).toHaveLength(4);

  })
})
