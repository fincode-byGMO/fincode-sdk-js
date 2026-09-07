/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  // このSDKはブラウザで動くため、既定をjsdomにする。
  // documentやwindowが無い環境の挙動を確かめるテストは、
  // ファイル先頭の @jest-environment node で切り替える。
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
};
