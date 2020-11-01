const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

// Este array no contiene el index
let pages = fs.readdirSync(path.join('src', 'pages'))
const entries = {
    index: './src/scripts/index.js'
}
pages = pages
    .filter(name => name !== 'index.html' && name.endsWith('html'))
    .map((pageName) => {
        const [name] = pageName.split('.')
        // Miramos si existe el script para incluirlo en las entries
        if (fs.existsSync(path.join('src', 'scripts', `${name}.js`))) {
            entries[name] = `./src/scripts/${name}.js`
        }
        // Creamos instancia de HtmlWebpackPlugin
        return new HtmlWebpackPlugin({
            filename: `./${name}/index.html`,
            template: path.resolve(__dirname, 'src', 'pages', pageName),
            // Si no existe el script, carga el de index
            chunks: [name]
        })
})

module.exports = {
    entry: entries,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        },
                    },
                    { loader: 'css-loader', options: { url: false } },
                    { loader: 'postcss-loader' },
                    { loader: 'sass-loader', options: { sourceMap: true } }
                ]
            },
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { 
                    from: path.resolve(__dirname, 'src', 'assets'),
                    to: path.resolve(__dirname, 'dist', 'assets') },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: `[name].css`
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'src', 'pages', 'index.html'),
            chunks: ['index']
        }),
        ...pages,
    ],
    devServer: {
        port: 3000,
        contentBase: path.join(__dirname, './dist')
    }
}