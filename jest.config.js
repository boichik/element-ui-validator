module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	moduleDirectories: ['node_modules'],
	testPathIgnorePatterns: ['./test/data/'],
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
	coverageDirectory: '<rootDir>/output/.tests-output',
};
