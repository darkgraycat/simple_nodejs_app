import { IncomingMessage, ServerResponse } from 'http'
import { promises as fs } from 'fs'
import path from 'path'

const parsePath = (req: IncomingMessage): string => path.join(__dirname, '../public', req.url || '')

async function read(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const data = await fs.readFile(parsePath(req), 'utf-8')
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(data)
  } catch (err) {
    console.error(`Error: ${err.message}`)
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Error reading file')
  }
}

async function write(req: IncomingMessage, res: ServerResponse): Promise<void> {
  let data: string = ''
  req.on('data', chunk => data += chunk)
  req.on('end', async () => {
    try {
      await fs.writeFile(parsePath(req), data)
      res.writeHead(201, { 'Content-Type': 'text/plain' })
      res.end('File writted')
    } catch (err) {
      console.error(`Error: ${err.message}`)
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('Error writting file')
    }
  })
}

async function append(req: IncomingMessage, res: ServerResponse): Promise<void> {
  let data: string = ''
  req.on('data', chunk => data += chunk)
  req.on('end', async () => {
    try {
      const filePath: string = parsePath(req)
      const file: string = await fs.readFile(filePath, 'utf-8')
      const total: Object = { ...JSON.parse(file), ...JSON.parse(data) }
      await fs.writeFile(filePath, JSON.stringify(total, null, 2))
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('File updated')
    } catch (err) {
      console.error(`Error: ${err.message}`)
      res.writeHead(400, { 'Content-Type': 'text/plain' })
      res.end('Error updating file')
    }
  })
}

async function remove(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    await fs.unlink(parsePath(req))
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('File removed')
  } catch (err) {
    console.error(`Error: ${err.message}`)
    res.writeHead(400, { 'Content-Type': 'text/plain' })
    res.end('Error deleting file')
  }
}

export {
  read,
  write,
  append,
  remove
}