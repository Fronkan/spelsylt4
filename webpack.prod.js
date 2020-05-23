const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: "production",
    module:{
        rules: [
            {
                exclude: [
                    path.resolve(__dirname, "src/enemyeditor.ts"),
                    path.resolve(__dirname, "src/editorscene.ts")
                ]
            }
        ]
    }
})
