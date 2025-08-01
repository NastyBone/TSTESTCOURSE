import type { Config } from '@jest/types';

// const baseDir = '<rootDir>/src/app/password_checker'
// const baseTestDir = '<rootDir>/src/test/password_checker'
const baseDir = '<rootDir>/src/app/server-app'
const baseTestDir = '<rootDir>/src/test/server-app'


const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [
        // '<rootDir>/src/app/**/*.ts'
        `${baseDir}/**/*.ts`
    ],
    testMatch: [
        `${baseTestDir}/**/*.ts`
    ]
}

export default config;