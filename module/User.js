const express = require("express")
const { default: mongoose } = require("mongoose")
const Schema =mongoose.Schema;

const USerSchema = new Schema({
    email:{type:String},
    password:{type:String}
})


const User = mongoose.model("User",USerSchema)

module.exports = User