const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@images': path.resolve(__dirname, 'src/images'),
    },
    configure: {
      resolve: {
        fallback: {
          buffer: require.resolve('buffer/'),
          crypto: require.resolve('crypto-browserify'),
          stream: require.resolve('stream-browserify'),
          process: require.resolve('process/browser'),
        },
      },
    },
  },
  style: {
    postcss: {
      plugins: [
        require('tailwindcss/nesting'),
        require('tailwindcss'), require('autoprefixer')],
    },
  },
};
