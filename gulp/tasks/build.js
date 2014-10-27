var gulp = require('gulp');
var config = require('../config').build;

var paths = [config.views, config.libs];

gulp.task('build', ['browserify', 'less', 'images', 'markup']);
