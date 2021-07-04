import http, { Server } from 'http'
import { promises as fsp } from 'fs'
import path from 'path'

enum Methods {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

const server: Server = http.createServer((req, res) => {

  const filePath: string = path.join(__dirname, 'public', req.url || '')

  switch (req.method) {

    case Methods.GET:
      try {
        fsp.readFile(filePath, 'utf-8')
          .then(data => res.end(data))
      } catch (error) {
        console.error(error.message)
      }
      break

    case Methods.POST:
      let data: string = ''
      req.on('data', chunk => data += chunk)
      req.on('end', () => {
        try {
          fsp.writeFile(filePath, data)
            .then(() => res.end('File succesfully changed'))
        } catch (error) {
          console.error(error.message);
        }
      })
      break

    case Methods.PATCH:
      let body: string = ''
      req.on('data', chunk => body += chunk)
      req.on('end', () => {
        fsp.readFile(filePath, 'utf-8')
          .then(data => {
            const oldData = JSON.parse(data)
            const newData = JSON.parse(body)
            for (let key in newData) {
              oldData[key] = newData[key]
            }
            fsp.writeFile(filePath, JSON.stringify(oldData, null, 2))
              .then(() => res.end('File succesfully updated'))
          })
      })
      break

    case Methods.DELETE:
      fsp.unlink(filePath)
        .then(() => res.end('File succesfully deleted'))
      break

    default:
      res.end()
  }

})

server.listen(3000, () => {
  console.log('Server has been started at port 3000')
})