const path = require('path');

module.exports = {
    mode: "production",
    entry: path.join(__dirname, 'view', 'src', 'index.tsx'),
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.svg']
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: "view/tsconfig.json"
                    }
                }],
                exclude: '/node_modules/',
            },
            {
                test: /\.s?[ac]ss$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
            }
        ],
    },
    output: {
        filename: 'view.js',
        path: path.resolve(__dirname, 'out', 'view-scripts')
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'view', 'public'),
        },
        compress: true,
        port: 9000,
    },
};