import type { Config } from 'jest';
import { config as baseConfig } from './base';

export const config = {
  ...baseConfig,
  rootDir: '.',
  testRegex: '.*\\.(e2e-)?spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
} as const satisfies Config;
