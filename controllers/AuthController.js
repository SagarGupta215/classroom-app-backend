const UserModel = require("../models/UserModel")
const jwt = require('jsonwebtoken')


const login = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await UserModel.findOne({ username: username, role: role });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isPasswordCorrect = password === user.password;
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({
            userId: user._id,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Adjust the expiration time as needed

        return res.json({
            token: token
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    login,
}