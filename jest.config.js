const path = require('path');

module.exports = {
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'jsx'],
    testMatch: [
        path.join('<rootDir>', 'src', '**', '*.(spec|test).(js|jsx)'),
    ],
    moduleNameMapper: {
        '\\.(css|less|scss|sss|styl)$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },
};
