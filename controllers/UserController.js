const UserModel = require("../models/UserModel")


const createNewUser = async (req, res) => {
    const {name, username, password, role } = req.body

    // Confirm data
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await UserModel.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    const userObject = {
            name,
            username,
            password,
            role
        }

    // Create and store new user 
    const user = await UserModel.create(userObject)

    if (user) { //created 
        return res.status(200).json({ message: `New ${role} with username ${username} created` })
    }

    return res.status(400).json({ message: 'Invalid user data received' })
    
}
const getUsersOrUserDetail = async (req, res) => {
    try {
        const { role, userID } = req.query;

        if (userID) {
            // If userID is provided, get the details of a specific user
            const user = await UserModel.findById(userID);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({
                user: user
            });
        } else if (role) {
            // If role is provided, get the list of users by role
            const allUsers = await UserModel.find({ role });
            if (!allUsers || allUsers.length === 0) {
                return res.status(404).json({ message: `${role}s not found` });
            }
            return res.status(200).json({
                users: allUsers.map(user => ({
                    name: user.name,
                    userID: user._id,
                    username:user.username
                }))
            });
        } else {
            // If neither role nor userID is provided, return an error
            return res.status(400).json({ message: "Role or User ID is required as query param" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const deleteUser = async (req, res) => {
    try {
        const userID = req.params.userID;

        if (!userID) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await UserModel.findByIdAndDelete(userID);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    createNewUser,
    getUsersOrUserDetail,
    deleteUser
}