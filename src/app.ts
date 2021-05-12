import 'reflect-metadata'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

import { routes } from './app/routes'

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(routes)

export { app }
