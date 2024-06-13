# Create a GitHub Action Using TypeScript

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)


## Enforce gomod version

This action makes sure to verify the modules you have in your `go.mod` file. Most
times, people run `go mod tidy` locally which bumps up some versions up. But in
some instances, even a minor upgrade can be fatal and requires lot of testing
and we don't want those to skip through at all.

This action will parse the given `go.mod` and throw an error if the version does
not match the expected one.

## Usage

```yaml
      - name: Test Local Action
        id: test-action
        uses: adelowo/enforce-gomod-version@v0.1.0
        with:
          ## defaults to go.mod, 
          ## use this option if your modfile is not go.mod or in some other directory
          modfile: '__tests__/fixtures/go.mod'
          ## we want to make sure ethereum/go-ethereum is always at v1.11.5
          modules: |
            github.com/stretchr/testify=>v1.9.0
            github.com/ethereum/go-ethereum => v1.11.5
```
