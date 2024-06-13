import * as main from '../src/main'

describe('action', () => {
  it('converts inputs to modules', async () => {
    const modules = main.convertInputToModules([
      'github.com/stretchr/testify=>v1.9.0',
      'github.com/ethereum/go-ethereum => v1.11.5',
      'google.golang.org/protobuf => v1.34.1',
      'google.golang.org/anotherpackage      =>  v1.34.1',
      'google.golang.org/anotherpackage       => v1.34.1        '
    ])

    // 4 since we added the same module twice
    expect(modules).toHaveLength(4)
  })

  it('parses a simple go.mod file', async () => {
    const modules = main.getAllModulesAndVersions('__tests__/fixtures/go.mod')

    // 4 modules in the fixtures/go.mod file
    expect(modules).toHaveLength(4)
  })

  it('parses a complex go.mod file with multiple require blocks', async () => {
    const modules = main.getAllModulesAndVersions(
      '__tests__/fixtures/complex.mod'
    )

    expect(modules).toHaveLength(8)
  })

  it('matches packages', async () => {
    const modules = main.getAllModulesAndVersions('__tests__/fixtures/go.mod')

    const modulesWanted = main.convertInputToModules([
      'github.com/stretchr/testify=>v1.9.0',
      'github.com/ethereum/go-ethereum => v1.11.5'
    ])

    main.verifyModule(modules, modulesWanted)
  })

  it('does not matches packages', async () => {
    const modules = main.getAllModulesAndVersions('__tests__/fixtures/go.mod')

    const modulesWanted = main.convertInputToModules([
      'github.com/stretchr/testify=>v1.9.1'
    ])

    const t = () => {
      main.verifyModule(modules, modulesWanted)
    }

    expect(t).toThrow(Error)
  })

  it('does not matches packages for multiple packages', async () => {
    const modules = main.getAllModulesAndVersions('__tests__/fixtures/go.mod')

    const modulesWanted = main.convertInputToModules([
      'github.com/stretchr/testify=>v1.9.2',
      'github.com/ethereum/go-ethereum => v1.11.5'
    ])

    const t = () => {
      main.verifyModule(modules, modulesWanted)
    }

    expect(t).toThrow(Error)
  })
})
