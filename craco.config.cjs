const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const cssnano = require('cssnano');

module.exports = {
  style: {
    postcss: {
      mode: 'extends',
      plugins: [
        postcssFlexbugsFixes,
        cssnano({
          preset: [
            'default',
            {
              calc: false // ✅ disable calc minification
            }
          ]
        })
      ]
    }
  }
};
