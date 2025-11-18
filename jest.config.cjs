module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.cjs'],
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { configFile: './babel.config.cjs' }]
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)']
}
