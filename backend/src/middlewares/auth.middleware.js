const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

const protectRoute = async (req, res, next) => {
    try {
        const cookie = req.cookies.jwt
        if (!cookie) {
            return res.status(400).json({
                msg: "Unauthorized -> No token found"
            })
        }
        const decoded = jwt.verify(cookie, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(400).json({
                msg: "Unauthorized -> Invalid token"
            })
        }
        const user = await User.findById(decoded.userId).select("-password")
        if (!user) {
            return res.status(400).json({
                msg: "User not found"
            })

        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Error", error)
        return res.status(500).json({
            msg: "Interal server error"
        })
    }
}
module.exports = protectRoute