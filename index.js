require('dotenv').config()
const express = require("express")
const cors = require("cors")
const mongoose = require('mongoose')
const connectDB = require("./config/dbConn")
const mainRouter = require('./routes/index')
const app = express()
const PORT = process.env.PORT || 3500

app.use(cors({
    origin: ['http://localhost:5173', 'https://classroom-app-frontend-navy.vercel.app'],
    credentials: true
}))

app.use(express.json())

connectDB()

app.use('/api/v1',mainRouter)


app.get('/',(req,res)=>{
    res.json({"message":"bhai"})
})



mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
mongoose.connection.on('error', err => {
    console.log(err)
})

module.exports = app