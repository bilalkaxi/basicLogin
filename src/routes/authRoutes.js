const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { generateToken, users } = require('../middleware/authMiddleware.js');

//REGISTER A NEW USER

router.post('/register', async ( req,res) => {
    try {
        const { username, email, password } = req.body;
        if(!username || !email || !password){
            return res.status(400).json({
                success:false,
                message:'Please provide all fields'
            });
        }
        //Check if user already exists
        const existingUser = users.find(user=> user.email === email);
        if ( existingUser ) {
            return res.status(400).json({
                succes : false,
                message : "User Already Exists"
            });
        }
        //HASH password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //Create a user
        const newUser = {
            id : users.length + 1,
            username,
            email,
            password : hashedPassword
        }
        //save user to in memory array
        users.push(newUser);
        //Generate token
        const token = generateToken(newUser);
        //Remove password from response
        // const { password: _,...userWithoutPassword} = newUser;
        const userResponse = {
            id: newUser.id,
            username: newUser.username,
            email:newUser.email
        };
        res.status(201).json({
            success : true,
            message : 'User registered successfully',
            data: { 
                user : userResponse,
                token
            }
        });
    } catch (error ) {
        console.error('Registration error:',error);
        res.status(500).json({
            success : false,
            message: 'Error registering user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
})
// Login User

router.post('/login', async (req,res) => {
    try {
    const { email, passsword } = req.body;
    //Validation
     if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    //Find User

    const user = users.find(user => user.email === email);
    if(!user) {
        return res.status(400).json({
            succes : false,
            message : 'Invalid Credentials'
        });
    }
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        return res.status(401).json({
            success : false,
            message : 'invlaid credentials'
        });
    }

    // Generate Token
    const token = generateToken(user);
    // const { password:_, ...userWithoutPassword} = user;
    const userResponse = {
        id: user.id,
        username: user.username,
        email: user.email
    };
    res.json({
        success : true,
        message : 'Login Successful',
        data : {
            user : userResponse,
            token
        }
    });
    } catch (err) {
        res.status(500).json({
            success : false,
            messge : "Error loggin in...",
            error: err.message
        });
    }
});

//
router.get('/me', (req,res) => {
    res.json({
        success : true,
        message : 'This route requires authentication.'
    });
});

module.exports = router;