const {defaults: tsjPreset} = require('ts-jest/presets')

module.exports = {
    preset: '@shelf/jest-mongodb',
    transform: tsjPreset.transform,
    coverageDirectory: './coverage',
    testMatch:[
        '**/?(*.)+(spec).ts'
    ],
    collectCoverageFrom:[
        'src/**/*.ts'
    ],
    collectCoverage: true,
    resetMocks: true,
    clearMocks: true,
    globals: {
        'ts-jest': {
            isolatedModules: true
        }
    },
    verbose: true,
    setupFiles: ["dotenv/config"],
    setupFilesAfterEnv: ['./jest.setup.js']
}