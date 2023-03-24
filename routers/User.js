const express = require("express")
const bodyparser = require("body-parser")
const User = require("../module/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const { body, validationResult } = require("express-validator")



const route = express.Router()


route.get("/", async (req, res) => {
    try {
        let user = await User.find();
        res.status(200).json({
            user
        })
    } catch (e) {
        res.status(500).json({
            status: "failed",
            message: e.message
        })
    }


})

// route.post("/signup",
//     body('email').isEmail(),
//     body('password').isLength({ min: 8, max: 16 }),
//     body('Confirmpassword').isLength({ min: 8, max: 16 })
//     , async (req, res) => {
//         let { email, password, Confirmpassword } = req.body;
//         try {
//             if (password !== Confirmpassword) {
//                 console.log(password,Confirmpassword)
//                 return res.json({ err: "password and confirmpassword does not match" })
//             }


//             let errors = validationResult(req)
//             if (!errors.isEmpty()) {
//                 return res.status(400).json({ err: "minimum length of password should be 8" });
//             }

//             let user = await User.findOne({ email })
//             if (user) {
//                 res.json({ message: "user is already exits" })
//             } else {
//                 bcrypt.hash(password, 10, async function (err, hash) {
//                     if (err) {
//                         res.status(500).json({
//                             status: "failed",
//                             message: err.message
//                         })
//                     }
//                     user = await User.create({
//                         email: email,
//                         password: hash
//                     })
//                     res.status(200).json({
//                         user, message: "Account is created"
//                     })
//                 })
//             }
//         } catch (e) {
//             res.status(500).json({
//                 status: "failed",
//                 message: e.message
//             })
//         }
//     })
route.post("/SIGNUP",
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
    body("Confirmpassword").isLength({ min: 8 }),
    async (req, res) => {
        try {
            let { email, password, Confirmpassword } = req.body;

            if (password !== Confirmpassword) {
                return res.json({ err: "password and confirmpassword does not match" })
            }


            let errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ err: "minimum length of password should be 8" });
            }

            let user = await User.findOne({ email })
            if (user) {
                return res.status(400).json({ message: "user is already exist" })
            }

            bcrypt.hash(password, 10, async function (err, hash) {
                if (err) {
                    return res.status(400).json({
                        status: "failed",
                        message: err, message
                    })
                }
                user = await User.create({
                    email: email,
                    password: hash
                })
                res.status(200).json({ user, message: "Account is created" })
            })



        } catch (e) {
            res.status(500).json({
                status: "failed",
                messahe: e.message
            })
        }
    })
route.post("/SIGNIN", body("email").isEmail(), async (req, res) => {

    let { email, password } = req.body


    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ err: "invalid email" })
    }
    let user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({ err: "user does not exits" })
    }

    bcrypt.compare(password, user.password, async function (err, result) {
        if (err) {
            return res.status(400).json({
                message: e.message
            })
        }

        if (result) {
            let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
            res.json({ user, token, message: "loggen in sucessfully" })
        }else{
            if(password!==user.password){
                return res.json({err:"incorrect password"})
            }
        }

    })


})


route.post("/signin",
    body("email").isEmail()
    , async (req, res) => {


        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            // console.log("sign up error called",errors,req.body.confirmpassword)
            return res.status(400).json({ err: "email is not valid" });
        }

        let { email, password } = req.body;
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ err: "user not found" })
        }

        bcrypt.compare(password, user.password, async function (err, resu) {
            if (err) {
                return res.status(400).json({ message: err.mesage })
            }
            if (resu) {
                let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
                res.status(200).json({ user, token, message: "logged in ucessfully" })
            } else {
                if (password != user.password) {
                    return res.json({ err: "password does not match" })
                }
            }



        })

    })


module.exports = route