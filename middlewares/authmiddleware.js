const jwt = require('jsonwebtoken')


const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers['authorization'];

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({message:'Auth header invalid'});
    }

    const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({ message: 'Token is missing' });
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.userId = decoded.userId;
        req.role = decoded.role
        next();

    } catch (error) {
        res.status(403).json({
            message:error
        })
    }
}

module.exports = authMiddleware