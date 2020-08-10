// const CracoAntDesignPlugin = require("craco-antd");

// module.exports = {
//   plugins: [{ plugin: CracoAntDesignPlugin, options : {
// 	javascriptEnabled: true,
// 	customizeTheme: {
// 		"@primary-color": "#5da97f",
// 		"@link-color": "#1DA57A"
// 	  }
//   } }]
// };
const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#333F44' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};