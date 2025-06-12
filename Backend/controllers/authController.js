import User from "../models/User.js";

import bcrypt from 'bcryptjs'

import jwt from "jsonwebtoken";

const SignIn=async(req,res)=>  
{
    try{
    const {email,password}=req.body;
    const validUser =await User.findOne({email});
    console.log(validUser);
    if(!validUser)
    {
           return  res.status(401).json({
                success:false,
                msg:"Please Enter valid Email"
        });
    }
    
    const validPassword= await bcrypt.compare(password,validUser.password);
    console.log(validPassword);
    if(!validPassword)
    {
           return res.status(401).json({
                success:false,
                msg:"Please Enter valid Password"
        });   
    }
    const token= jwt.sign({id:validUser._id,username: validUser.username,},process.env.JWT_SECRET_KEY
,{
        expiresIn:"20min"
    })
    console.log(token);
    res.cookie('token', token, {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'Lax',
    maxAge: 20 * 60 * 1000, // 20 minutes
});
   return res.status(200).json({
        success:true,
        msg:"User Successfully SingIn"
    })
   }catch(err)
   {
      console.log(err);
        return  res.status(401).json({
                success:false,
                msg:err
        });
   }

};
const SignUp=async(req,res)=>
{
     try{
        const {username,email,password} =req.body;

          if (!username || !email || !password) {
            return res.status(400).json({ // 400 Bad Request
                success: false,
                message: 'Please enter all required fields: username, email, and password.'
            });
        }
        const validUser= await User.findOne({email});
        if(validUser)
        {
            res.status(401).json({
                success:false,
                msg:"User already present"
        });
        }
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt); 
        const newUser=new User({
            username,email,password:hashedPassword
        })
        await newUser.save();
        res.status(200).json({
                success:true,
                msg:"User succesfully Registered"
        }); 
     }
     catch(err)
     {

        console.log(err);
         res.status(401).json({
                success:false,
                msg:err
        });
     }

}

const SignOut = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        msg: "Logged out successfully",
    });
};

const isAuthenticated = (req, res) => {
     const token = req.cookies?.token;
     console.log(token);
    if (!token) {
        return res.status(401).json({ authenticated: false, });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return res.status(200).json({ authenticated: true, userId: decoded.id,username: decoded.username  });
    } catch (err) {
        return res.status(401).json({ authenticated: false ,err});
    }

};


export {SignIn,SignUp,SignOut,isAuthenticated};