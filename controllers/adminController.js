const admin = require("../models/adminModel")
const bcryptjs = require ('bcryptjs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SendEmail = require('../controllers/email')
const dotenv = require('dotenv')
dotenv.config()


exports.newAdmin= async (req, res)=>{
    
    const  {firstName,lastName,email,password} = req.body
    try{
const salt = bcryptjs.genSaltSync(10);
const hash = bcryptjs.hashSync(password, salt);

      const data ={
        firstName,
        lastName,
        email,
        password:hash,
      
        
      }
        const  newAdmin= new admin(data)
        const myToken = jwt.sign({
            id:newAdmin._id,
            password:newAdmin.password,
           

        }, process.env.JWTTOKEN, {expiresIn: "1d"})

        newAdmin.token = myToken;

        await newAdmin.save()

        const VerifyLink = `${req.protocol}://${req.get("host")}/api/adminVerify/${newAdmin._id}`
        const message = `Thank you for registering with us. Please click on this link ${VerifyLink} to verify`;
        SendEmail({
          email: newAdmin.email,
          subject: "Kindly verify",
          message, 
        });
        res.status(201).json({
            message: "Admin created",
            data:newAdmin,
        })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}

exports.adminVerify = async (req, res) => {
    try{    
        const id = req.params.id
        const verified = await admin.findById(id)
         console.log(verified)
        await admin.findByIdAndUpdate(
            verified._id,
            {
            adminVerify:true
            },
            {
                new : true
            }
        )

        res.status(200).json({
            message: "you have been verified"
        })

    }catch(err){
        res.status(400).json({
            message:err.message
        })
    }
}


exports.adminLogin = async (req, res) => {
    try {
        const {email} = req.body;
        const checkEmail = await admin.findOne({email: email});
        
        if (!checkEmail)
            return res.status(404).json({
                message: " Email not registered"
            })
        const isPassword = await bcrypt.compare(req.body.password, checkEmail.password)
        if (!isPassword) 
            return res.status(404).json({
                message: "Wrong Password"
            })

            const generateToken = jwt.sign({
                id: checkEmail._id,
                password: checkEmail.password
            }, process.env.JWTTOKEN, {
                expiresIn: "12h"
            })
            checkEmail.token = generateToken
            await checkEmail.save()
            const {password, ...others} = checkEmail._doc
            res.status(200).json({
                message: "Successfully Logged In",
                data: others
            })
    } catch( error) {
        res.status(400).json({
            message: error.message
        })
    }
}

exports.adminForgotPassword = async (req, res) => {
    try{
        const {email} = req.body
    
        const adminEmail = await admin.findOne({email})
        if(!adminEmail) return  res.status(404).json({ message: "Email not found" })
        const myToken = jwt.sign({
            id:adminEmail._id
        }, process.env.JWTTOKEN, {expiresIn: "1m"})

        const VerifyLink = `${req.protocol}://${req.get("host")}/api/adminchangepassword/${adminEmail._id}`
        const message = `Use this link ${VerifyLink} to change your password`;
       SendEmail({
          email: adminEmail.email,
          subject: "Reset Pasword",
          message,
        })
        
        res.status(202).json({
            message:"check your email to change your password"
        })

      
    }catch(err){
        res.status(400).json({
            message:err.message
        })
    }
}

exports.adminResetPassword = async (req, res) => {
    try {
        const {password} = req.body
        const id = req.params.id
        const passwordchange = await admin.findById(id)
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(password, salt);

        await admin.findByIdAndUpdate(passwordchange._id,{
            password: hash
        },{new: true})

        res.status(202).json({
            message:"password updated"
        })

    } catch (err) {
        res.status(400).json({
            message:err.message
        })
    }
}

exports.adminLogout=async(req,res)=>{
    try {
        const id=req.params.id;
        const {email,password} = req.body
        const token=jwt.sign({
            id,
            email,
            password,
        }, process.env.JWTDESTROY);
        admin.token=token 
        res.status(200).json(
            {message:"Sucessfully logged out"}
        )
    } catch (error) {
        res.status(400).json(
            {message:error.message}
        )
    }
}

// exports.allAdmins = async (req, res) => {
//     const getAllAdmins = await admin.find();
//     if (getAllAdmins) {
//         res.status(200).json({
//             totalAdmins: getAllAdmins.length,
//             message: "All Admins",
//             data: getAllAdmins
//         })
//     } else {
//         res.status(404).json({
//             message: "Can't find admin in the database"
//         })
//     }

// }

// exports.oneAdmin = async (req, res) => {
//     let id = req.params.id;
//     const anAdmin= await admin.findById(id);
//     if (anAdmin) {
//         res.status(200).json({
           
//             message: "Admin with ID:  " + id,
//             data: anAdmin
//         })
//     } else {
//         res.status(404).json({
//             message: "Unable to find admin with ID " + id
//         })
//     }

// }


// exports.deleteAdmin= async (req, res) => {
//     let id = req.params.id;
//     const deletedAdmin = await doc.findByIdAndDelete(id);
//     if (deletedAdmin) {
//         res.status(200).json({
//             message: "Sucessfully deleted admin with ID: " + id,
//             data: deletedAdmin
//         })
//     } else {
//         res.status(404).json({
//             message: "Unable to delete admin with ID: " + id,
//         })
//     }

// }


// exports.updateAdmin = async (req, res) => {
//     const  {firstName,lastName,email,password} = req.body
//     let id = req.params.id;
//     const data = {
//         firstName,
//         lastName,
        
//     }
//     const updatedAdmin= await doc.findByIdAndUpdate(id, data);
//     if (updatedAdmin) {
//         res.status(200).json({
//             message: "Successfully Updated admin with ID: " + id,
//             data: updatedAdmin
//         })
//     } else {
//         res.status(404).json({
//             message: "Unable to Update admin with ID: " + id,
//         })
//     }

// }