const TerserJsPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
    const devMode = argv.mode === "development";
    const prefixFiles = devMode ? "" : ".min";

    return {
        target: "es5",
        entry: {
            jalalidatepicker: ["./src/index.js", "./src/styles/index.scss"]
        },
        output: {
            filename: `[name]${prefixFiles}.js`
        },
        optimization: {
            minimize: !devMode,
            minimizer: [new TerserJsPlugin({}), new OptimizeCssAssetsPlugin({})]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: `[name]${prefixFiles}.css`,
                chunkFilename: `[id]${prefixFiles}.css`
            })
        ],
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components|dist)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"]
                        }
                    }
                },
                {
                    test: /\.scss$/,
                    use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: ""
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2
                        }
                    },
                    "sass-loader"]
                }
            ]
        }
    };
};
