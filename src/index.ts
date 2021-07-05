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

    case Methods.GET:
      read(req).then(data => res.end(data))
      break

    case Methods.POST:
      write(req).then(() => res.end('File succesfully changed'))
      break

    case Methods.PATCH:
      append(req).then(() => res.end('File succesfully updated'))
      break

    case Methods.DELETE:
      remove(req).then(() => res.end('File succesfully removed'))
      break

    default:
      res.end()
  }

})

server.listen(3000, () => {
  console.log('Server has been started at port 3000')
})