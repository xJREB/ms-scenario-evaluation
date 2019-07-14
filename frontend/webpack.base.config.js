// External
const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    context: path.resolve(__dirname, "src"),
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html"),
            inject: "head"
        })
    ],

    resolve: {
        extensions: [".js", ".ts", ".json", "vue"],
        alias: {
            vue$: "vue/dist/vue.esm.js"
        }
    },

    module: {
        rules: [
            {
                test: /(\.ts|\.js)$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: {
                        ts: "ts-loader!tslint-loader"
                    },
                    esModule: true
                }
            },
            {
                test: /\.html$/,
                loader: "html-loader",
                options: {
                    name: "[name].[ext]"
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ["vue-style-loader", "css-loader"]
            },
            {
                test: /(\.png|\.ico|\.jpg|\.svg)$/,
                loader: "file-loader",
                options: {
                    name: "imgs/**/[name].[ext]"
                }
            }
        ]
    }
};
