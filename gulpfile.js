var path        = require('path')
var gulp        = require('gulp')
var config      = require('./config.json')
var del         = require('del')
var inline      = require('gulp-inline-source')
var htmlmin     = require('gulp-htmlmin')
var through     = require('through2')
var template    = require('lodash.template')
var statusCodes = require('http').STATUS_CODES

gulp.task('clean', function(cb) {
  del(['build'], cb)
})

gulp.task('default', ['clean'], function() {
  return gulp.src('template.html')
    .pipe(inline())
    .pipe((function() {
      return through.obj(function(file, enc, cb) {
        config.compile.forEach(function(code) {
          var data = {
            code: code,
            title: statusCodes[code],
            body: statusCodes[code]
          }

          if(config.content[code]) {
            data.title = config.content[code].title || statusCodes[code]
            data.body  = config.content[code].body  || statusCodes[code]
          }

          var clone      = file.clone()
          clone.path     = path.resolve(clone.path, '../' + code + '.html')
          clone.contents = new Buffer(template(clone.contents)(data))

          this.push(clone)
        }, this)

        this.push(file)

        return cb()
      })
    })())
    .pipe(htmlmin({
      collapseWhitespace: true,
      keepClosingSlash: true
    }))
    .pipe(gulp.dest('build'))
})