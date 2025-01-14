import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import indexRouter from './routes/indexRouter'
import adminRoter from './routes/admin/adminRoutes'
import { errorHandler } from './middlewares/errorMiddleware'

dotenv.config()


const app = express()

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({  limit: '10mb',extended: false }));



app.use('/auth',indexRouter)
app.use('/admin',adminRoter)

// Error handler
app.use(errorHandler);

export default app