module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    textColor: {
      primary1: '#e2ba76',
      secondary: '#ffed4a',
      danger: '#e3342f',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  corePlugins: {
    preflight: false,
  },
};
