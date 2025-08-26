const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
// const postcssCalc = require('postcss-calc'); ❌ disable this

module.exports = {
  style: {
    postcss: {
      mode: 'extends',
      plugins: [
        postcssFlexbugsFixes
        // explicitly DO NOT include postcss-calc
        // Radix UI uses nested calc() that breaks old cssnano/postcss-calc
      ]
    }
  }
};
