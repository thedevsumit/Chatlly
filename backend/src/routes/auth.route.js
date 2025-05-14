const express = require("express");
const { signup, login, logout,profile,checkAuth } = require("../controllers/auth.controller");
const protectRoute = require("../middlewares/auth.middleware");

const authRoutes = express.Router()


authRoutes.post("/signup", signup)
authRoutes.post("/login", login)
authRoutes.post("/logout", logout)
authRoutes.put("/profile",protectRoute,profile)
authRoutes.get("/check",protectRoute,checkAuth)



module.exports = { authRoutes }