import * as core from '@actions/core'
import * as fs from 'fs'

interface GoModule {
  module: string
  version: string
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const expectedModulesAndVersion = convertInputToModules(
      core.getMultilineInput('modules')
    )

    let modFile = 'go.mod'

    const providedModFile = core.getInput('modfile')
    if (providedModFile !== '') {
      modFile = providedModFile
    }

    const currentModulesAndVersion = getAllModulesAndVersions(modFile)

    verifyModule(currentModulesAndVersion, expectedModulesAndVersion)
    core.setOutput('status', 'Verified')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

export function verifyModule(
  currentModulesAndVersion: GoModule[],
  expectedModulesAndVersion: GoModule[]
): boolean {
  currentModulesAndVersion.map(module => {
    expectedModulesAndVersion.map(expected => {
      if (expected.module !== module.module) {
        return
      }

      if (expected.version !== module.version) {
        throw new Error(`Module version does not match.. Expected ${expected.module} to have
version ${expected.version} instead go.mod has it at version ${module.version}`)
      }
    })
  })

  return true
}

// Multi line input like
// github.com/adelowo/gulter => 0.1.0
// github.com/adelowo/oops => 1.22.3
export function convertInputToModules(lines: string[]): GoModule[] {
  const m: GoModule[] = []
  const uniqueModules = new Set<string>()

  for (const line of lines) {
    const splittedLines = line.split('=>')

    if (splittedLines.length !== 2) {
      continue
    }

    const key = splittedLines[0].trim()

    if (!uniqueModules.has(key)) {
      uniqueModules.add(key)
      m.push({
        module: splittedLines[0].trim(),
        version: splittedLines[1].trim()
      })
    }
  }

  return m
}

// poor man's go.mod parser
export function getAllModulesAndVersions(modFile: string): GoModule[] {
  const content = fs.readFileSync(modFile, 'utf-8')
  const modules: GoModule[] = []

  const lines = content.split('\n')

  let insideRequireBlock = false

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine === 'require (') {
      insideRequireBlock = true
      continue // Skip the opening bracket
    } else if (trimmedLine === ')') {
      insideRequireBlock = false
      continue // Skip the closing bracket
    }

    if (insideRequireBlock) {
      const moduleMatch = trimmedLine.match(/^\s*(\S+)\s+(\S+)/)
      if (moduleMatch) {
        const module = moduleMatch[1]
        const version = moduleMatch[2]
        modules.push({ module, version })
      }
    } else {
      const replaceMatch = trimmedLine.match(
        /^replace\s+(\S+)\s+=>\s+(\S+)\s+(\S+)/
      )
      if (replaceMatch) {
        const originalModule = replaceMatch[1]
        const newModule = replaceMatch[2]
        const version = replaceMatch[3]

        const existingModuleIndex = modules.findIndex(
          m => m.module === originalModule
        )
        if (existingModuleIndex !== -1) {
          modules[existingModuleIndex] = { module: newModule, version }
        } else {
          modules.push({ module: originalModule, version })
        }
      }
    }
  }

  return modules
}
