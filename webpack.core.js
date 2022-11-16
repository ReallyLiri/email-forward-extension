const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        'injected': path.resolve(__dirname, 'src', 'injected.ts'),
        'content': path.resolve(__dirname, 'src', 'content.ts'),
        'background': path.resolve(__dirname, 'src', 'background.ts'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules',
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
            }
        ],
    },
    optimization: {
        minimize: false
    },
    cache: {
        type: 'filesystem',
    },
    output: {
        path: path.resolve(__dirname, 'out')
    }
};
