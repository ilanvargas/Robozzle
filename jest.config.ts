import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

const presetConfig = createDefaultEsmPreset({});
const jestConfig = {
    ...presetConfig,
    testEnvironment: 'node',
    testMatch: [
        '**/test/**/*.test.ts'
    ],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    roots: [ "src", "test" ]
};

export default jestConfig;
