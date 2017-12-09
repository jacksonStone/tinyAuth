const http = require('http')
const args = process.argv.slice(2)
const router = require('dryrouter');

let isTesting = false
if (args.indexOf('testing') !== -1) {
  isTesting = true
}

http.createServer((req, res) => {
  return router(req, res, isTesting)
}).listen(process.env.PORT || 5002)
