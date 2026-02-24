const path = require('path')
const rewireAliases = require('react-app-rewire-aliases')

module.exports = function override(config, env) {

  config = rewireAliases.aliasesOptions({
    '@views': path.resolve(__dirname, 'src/views'),
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@redux': path.resolve(__dirname, 'src/redux'),
    '@shared': path.resolve(__dirname, 'src/shared'),
    '@services': path.resolve(__dirname, 'src/services'),
    '@components': path.resolve(__dirname, 'src/components')
  })(config, env)

  return config
}
