import express from 'express'
import cors from 'cors'

import './database/connect'

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))

export { app }
