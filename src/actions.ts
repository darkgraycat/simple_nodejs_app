import { IncomingMessage, ServerResponse } from 'http'
import { promises as fs } from 'fs'
import path from 'path'

const parsePath = (req: IncomingMessage): string => path.join(__dirname, '../public', req.url || '')

async function read(req: IncomingMessage): Promise<string> {
  try {
    return await fs.readFile(parsePath(req), 'utf-8')
  } catch (err) {
    return console.error(err.message), err.message
  }
}

async function write(req: IncomingMessage): Promise<void> {
  try {
    let data: string = ''
    req.on('data', chunk => data += chunk)
    req.on('end', async () => {
      await fs.writeFile(parsePath(req), data)
    })
  } catch (err) {
    console.error(err.message)
  }
}

async function append(req: IncomingMessage): Promise<void> {
  try {
    let data: string = ''
    req.on('data', chunk => data += chunk)
    req.on('end', async () => {
      const filePath: string = parsePath(req)
      const file: string = await fs.readFile(filePath, 'utf-8')
      const total: Object = { ...JSON.parse(file), ...JSON.parse(data) }
      fs.writeFile(filePath, JSON.stringify(total, null, 2))
    })
  } catch (err) {
    console.error(err.message)
  }
}

async function remove(req: IncomingMessage): Promise<void> {
  try {
    fs.unlink(parsePath(req))
  } catch (err) {
    console.error(err.message)
  }
}

export {
  read,
  write,
  append,
  remove
}