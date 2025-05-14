const { getMessages, getUsersForSidebar, sendMessage } = require("../controllers/message.controller");
const protectRoute = require("../middlewares/auth.middleware");

const express = require("express");
const messageRoutes = express.Router()

messageRoutes.get("/users", protectRoute, getUsersForSidebar)
messageRoutes.get("/:id", protectRoute, getMessages)
messageRoutes.post("/send/:id", protectRoute, sendMessage)

module.exports = {messageRoutes};