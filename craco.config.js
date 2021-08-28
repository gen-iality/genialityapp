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
            modifyVars: { '@primary-color': '#333F44','@secondary-color':'#C44D17' },
            javascriptEnabled: true,
          },
        },
      },

    },{
      plugin: CracoLessPlugin, 
      eslint: {enable: false}
    }
  ],
  eslint: {
    enable: false
  },
};
