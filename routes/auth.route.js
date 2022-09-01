const express = require('express');
const router=express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {registerValidations, loginValidations}=require('../validations/user.validation');
const user = require('../model/user.model');
 
dotenv.config()

router.post('/register',async(req, res)=> {
    const{ error} =registerValidations(req.body);
    if(error)return res.send(error);

    const userAlreadyExists = await user.findOne({ email: req.body.email });
    if(userAlreadyExists)return res.status(400).send("Email already exists");

    const salt=await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);

const user1 =new user({
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email:req.body.email,
    password:hashPassword
});
try {
const user=await user1.save();
return res.json(user).setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
}catch(err) {
return res.status(401).send(err.message);
}
});


router.post('/login',async(req, res)=> {
    
    const{ error} =loginValidations(req.body);
    if(error)return res.send(error);

    const isEmailExists=await user.findOne({ email:req.body.email });
    if(!isEmailExists)return res.status(404).send("Email not exists");

    const isValidPassword=await bcrypt.compare(req.body.password,isEmailExists.password);
    if(!isValidPassword)return res.status(400).send("Invalid password");

    const token=jwt.sign({_id:user._id},process.env.TOKEN_SECRET,{expiresIn:"10min"});
    res.setHeader("auth-token", token);
          
    const savedUser=jwt.verify(token,process.env.TOKEN_SECRET);
    console.log(savedUser);
    return res.send({success:true,
                     message:"Users Login successfully", user:req.user,
                     user,
                     token
                    });
    });

module.exports =router;