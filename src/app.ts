import 'reflect-metadata'
import cors from 'cors'
import express from 'express'

import './database/connect'
import { routes } from './app/routes'

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))

app.use(routes)

export { app }
