import express from 'express';
import User from '../mongodb/models/user.js';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();


const userRoute = express.Router();

userRoute.route('/signUp').post(async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(name,email,password);

        const new_user = new User({ name, email, password });
        await new_user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

userRoute.route('/login').post(async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email,password});

        if(user){
            const token = jwt.sign(
                { userId: user._id, email: email },
                process.env.SECRET_KEY,
                { expiresIn: '1h' }  // Use expiresIn instead of expiry
            );
            
            console.log(token);
            res.status(200).json({ token:token, name:user.name });

        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
});







export default userRoute;