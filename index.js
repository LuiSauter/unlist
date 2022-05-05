import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const PORT = 3000
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())

app.use('/src', express.static(__dirname + '/src'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
