module.exports = {
  devServer: {
    proxy: {
      '/dmp-sw-query-service': {
        target: 'http://all-in-one-dev.dmptesting.xyz:9000',
      },
      '/graphql': {
        target: 'http://172.16.100.80:12800',
        // target: 'http://35.203.129.14:12800',
        changeOrigin: true,
        // pathRewrite:  (path) => {
        //   return "/graphql"
        // }
      },
    },
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: '[name]',
      });
  },
};
