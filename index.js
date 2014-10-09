var fs   = require('fs')
var path = require('path')

fs.readdirSync('build').forEach(function(filename) {
  exports[path.basename(filename, '.html')] = fs.readFileSync(path.resolve('build', filename), { encoding: 'utf8' })
})