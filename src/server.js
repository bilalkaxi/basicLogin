const express = require('express');
const dotenv = require('dotenv');
const { verifyToken } = require('./middleware/authMiddleware.js')
dotenv.config();

const app = express();
app.use(express.json());

const authRoutes = require('./routes/authRoutes.js');

app.use('/api/auth', authRoutes);

app.get('/',(req,res) => {
    res.json({message: "JWT authentication API"});
});

app.get('/api/protected',verifyToken, (req,res) => {
    res.json({ 
        success : true,
        message : 'This is a protected route.',
        user: req.user
        })
});
//profile
app.get('/api/profile',verifyToken, (req,res) => {
    res.json({
        success : true,
        message : 'User Profile',
        data : {
            user : req.user
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log(`Server listening on http://localhost:${PORT}`)
});
