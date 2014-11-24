var dest = "./build";
var src = './src';

module.exports = {
  build: {
    // TODO add a separate build folder for 
    // app stuff
    views: {
      src: src + '/partials/*.html',
      dest: dest + '/partials/'
    },
    libs: {
      src: src + '/libs/*.js',
      dest: dest + '/libs/'
    }
  },
  browserSync: {
    server: {
      // We're serving the src folder as well
      // for sass sourcemap linking
      baseDir: [dest, src]
    },
    files: [
      dest + "/**",
      // Exclude Map files
      "!" + dest + "/**.map"
    ]
  },
  less: {
    src: src + "/styles/*.less",
    dest: dest + "/styles"
  },
  images: {
    src: src + "/img/**",
    dest: dest + "/img"
  },
  fonts: {
    src: src + "/fonts/**",
    dest: dest + "/fonts"
  },
  markup: {
    //src: src + "/htdocs/**",
    src: src + "/*.html",
    dest: dest
  },
  browserify: {
    // Enable source maps
    debug: true,
    // Additional file extentions to make optional
    extensions: ['.js'],
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [
        {
          entries: './src/scripts/app.js',
          dest: dest + '/scripts/',
          outputName: 'app.min.js'
        },
        {
          entries: './src/scripts/infscr.js',
          dest: dest + '/scripts/',
          outputName: 'infscr.min.js'
        }
    ]
  }
};
