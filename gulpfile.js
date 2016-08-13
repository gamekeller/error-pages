var path        = require('path')
var gulp        = require('gulp')
var config      = require('./config.json')
var del         = require('del')
var inline      = require('gulp-inline-source')
var htmlmin     = require('gulp-htmlmin')
var through     = require('through2')
var template    = require('lodash.template')
var statusCodes = require('http').STATUS_CODES

gulp.task('clean', function() {
  return del(['build'])
})

gulp.task('default', ['clean'], function() {
  return gulp.src('template.html')
    .pipe(inline())
    .pipe((function() {
      return through.obj(function(file, enc, cb) {
        config.compile.forEach(function(code) {
          var data = {
            code: code + ' ' + statusCodes[code],
            title: null,
            body: null,
            nonce: null
          }

          if(config.content[code]) {
            data.title = config.content[code].title
            data.body  = config.content[code].body
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