import express from 'express'
import dotenv from 'dotenv'
import adminroute from './routes/adminroute.js'
import connectdb from './config/db.js'
import morgan from 'morgan'
import bookingroute from './routes/bookingroute.js'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

dotenv.config()
connectdb()

const app = express()
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/v1/auth', adminroute)
app.use('/api/v1/auth', bookingroute)
app.use('/api', (req, res) => res.sendStatus(404))

const buildDirectory = fileURLToPath(new URL('../build/', import.meta.url))
const indexFile = join(buildDirectory, 'index.html')
if (existsSync(indexFile)) {
    app.use(express.static(buildDirectory))
    app.get('*', (req, res) => res.sendFile(indexFile))
}

const port = process.env.PORT || 5000
app.listen(port, '0.0.0.0', () => {
    console.log('App listening on port ' + port)
})
