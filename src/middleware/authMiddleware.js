const jwt = require('jsonwebtoken');
//in-memory user store 
const users = [
     {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'abc123' // password: 'password123'
  }
];
//middleware to verify jwt token
const verifyToken = (req,res,next)=> {
    //getting token from user
    try {

    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({
            success : false,
            message : 'Access denied. No token provided'
        });
    }

    const token = authHeader.startWith('Bearer ') ? authHeader.substring(7) : authHeader;

    if(!token) {
        return res.status(401).json({
            succes : false,
            message : "Access denied."
        });
    }
    //try block
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      });
    }
        if( error.name === 'JsonWenTokenError') {
            return res.status(401).json({
                success: false,
                message: "invalid"
            });
        }
            return res.status(500).json({
                success : false,
                message: 'Server error during token verification.'
            });    
    }
};

//generate Token
const generateToken = (user) => {
    return jwt.sign(
        {
            id : user.id,
            username : user.username,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '3h' }
    );
};

module.exports = { verifyToken, generateToken, users};