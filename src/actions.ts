import { IncomingMessage, ServerResponse } from 'http'
import { promises as fs } from 'fs'
import path from 'path'

const parsePath = (req: IncomingMessage): string => path.join(__dirname, '../public', req.url || '')

async function read(req: IncomingMessage, res: ServerResponse): Promise<string> {
  try {
    const data = await fs.readFile(parsePath(req), 'utf-8')
    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    res.end(data)
    return data
  } catch (err) {
    console.error(err.message)
    res.statusCode = 404
    res.end()
    return ''
  }
}

async function write(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    let data: string = ''
    req.on('data', chunk => data += chunk)
    req.on('end', async () => {
      await fs.writeFile(parsePath(req), data)
      res.statusCode = 200
      res.end()
    })
  } catch (err) {
    console.error(err.message)
    res.statusCode = 404
    res.end()
  }
}

async function append(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    let data: string = ''
    req.on('data', chunk => data += chunk)
    req.on('end', async () => {
      const filePath: string = parsePath(req)
      const file: string = await fs.readFile(filePath, 'utf-8')
      const total: Object = { ...JSON.parse(file), ...JSON.parse(data) }
      await fs.writeFile(filePath, JSON.stringify(total, null, 2))
      res.statusCode = 200
      res.end()
    })
  } catch (err) {
    console.error(err.message)
    res.statusCode = 404
    res.end()
  }
}

async function remove(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    await fs.unlink(parsePath(req))
    res.statusCode = 200
    res.end()
  } catch (err) {
    console.error(err.message)
    res.statusCode = 404
    res.end()
  }
}

export {
  read,
  write,
  append,
  remove
}