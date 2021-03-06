var fs   = require('fs')
var path = require('path')

exports.content = require('./config.json').content

fs.readdirSync(path.resolve(__dirname, 'build')).forEach(function(filename) {
  exports[path.basename(filename, '.html')] = fs.readFileSync(path.resolve(__dirname, 'build', filename), { encoding: 'utf8' })
})