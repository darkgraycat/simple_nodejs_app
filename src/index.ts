import http, { Server } from 'http'
import { read, write, append, remove } from './actions'

enum Methods {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

const server: Server = http.createServer((req, res) => {

  switch (req.method) {

    case Methods.GET: read(req, res)
      break

    case Methods.POST: write(req, res)
      break

    case Methods.PATCH: append(req, res)
      break

    case Methods.DELETE: remove(req, res)
      break

    default:
      res.statusCode = 200
      res.end()
  }

})

server.listen(3000, () => {
  console.log('Server has been started at port 3000')
})