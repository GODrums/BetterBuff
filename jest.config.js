module.exports = {
    transform: { '^.+\\.ts?$': ['ts-jest', { tsconfig: './tsconfig.jest.json' }] },
    testEnvironment: 'node',
    testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        "@/(.*)": "<rootDir>/src/$1"
    },
};
