// require('dotenv').config()

const cors = require("cors")
const express = require("express");

const mongoose = require('mongoose')

const router = require("./routers/router")
const dotenv = require("dotenv");
dotenv.config()
const app = express()

const db = process.env.DATABASE

app.use(cors())
app.use(express.json());

app.get('/', (req, res)=>{
    res.status(200).send("My exquisite  clinic Api is connected successfully")
})



app.use('/api',router)

mongoose.set('strictQuery', true)
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("MongooseDATABASE connected")
}).then(()=>{
  app.listen(process.env.PORT || 5555, ()=>{
    console.log("Server is listening to PORT: 5555")
})
})
