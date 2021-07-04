import http, { Server } from 'http'
import fs, { fdatasync } from 'fs'
import path from 'path'

enum Methods {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

const readFile = () => { }
const replaceFile = () => { }
const updateFile = () => { }
const deleteFile = () => { }

const server: Server = http.createServer((req, res) => {

  const filePath: string = path.join(__dirname, 'public', req.url || '')

  switch (req.method) {
    case Methods.GET:
      readFile()
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) throw err
        console.log('Get file')
        res.end(data)
      })
      break
    case Methods.POST:
      replaceFile()
      let data: string = ''
      req.on('data', chunk => data += chunk)
      req.on('end', () => {
        fs.writeFile(filePath, data, (err) => {
          if (err) throw err
          console.log('Write file')
          res.end('File succesfully changed')
        })
      })
      break
    case Methods.PATCH:
      updateFile()
      let body: string = ''
      req.on('data', chunk => body += chunk)
      req.on('end', () => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
          if (err) throw err
          const old = JSON.parse(data)
          const ccc = JSON.parse(body)
          for (let k in ccc) {
            old[k] = ccc[k]
          }
          fs.writeFile(filePath, JSON.stringify(old), (err) => {
            if (err) throw err
            res.end('File succesfully updated')
          })
        })
      })
      break
    case Methods.DELETE:
      deleteFile()
      fs.unlink(filePath, (err) => {
        if (err) throw err
        res.end('File succesfully deleted')
      })
      break
    default:
      res.end()
  }

})


server.listen(3000, () => {
  console.log('Server has been started at port 3000')
})