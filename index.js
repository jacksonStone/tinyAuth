const http = require('http')
const args = process.argv.slice(2)
const router = require('./server/routes');

let isTesting = false
if (args.indexOf('testing') !== -1) {
  isTesting = true
}

http.createServer((req, res) => {
  return router.root(req, res, isTesting)
}).listen(process.env.PORT || 5002)
