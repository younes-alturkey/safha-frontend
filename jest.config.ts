import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './src'
})

const config: Config = {
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>setup.jest.ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^jose': require.resolve('jose'),
    '^@panva/hkdf': require.resolve('@panva/hkdf'),
    '^preact-render-to-string': require.resolve('preact-render-to-string'),
    '^preact': require.resolve('preact'),
    '^uuid': require.resolve('uuid')
  },
  modulePathIgnorePatterns: ['<rootDir>/.next/']
}

export default createJestConfig(config)
