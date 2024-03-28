// export default {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},

//   },
// }
// postcss.config.js

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Add PurgeCSS plugin only in production
    ...(process.env.NODE_ENV === 'production'
      ? {
          '@fullhuman/postcss-purgecss': {
            content: ['./src/**/*.html', './src/**/*.js', './src/**/*.ts', './src/**/*.tsx'],
            defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
          },
        }
      : {}),
  },
};

