const express = require("express")
const { default: mongoose } = require("mongoose")
const app = express();

app.use(express.json())

const port = process.env.port || 2000

if(process.env.NODE_ENV !=="production"){
    require("dotenv").config({path:"config.env"})
}

mongoose.connect("mongodb+srv://vpdangi:vpdangi@cluster0.h49ogrq.mongodb.net/?retryWrites=true&w=majority").then(()=>console.log("connected to db"))


const User = require("./routers/User")
app.use(User)

app.listen(port,console.log(`server is on ${port}`))