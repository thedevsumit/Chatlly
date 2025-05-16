
const { createGroupUser, getGroupsByUser, addMemberGroup, removeMemberGroup, getAllMemmbersOfGroup, sendGroupMessage, getMessagesGroup,findingUser,deleteGroup } = require("../controllers/group.controller");
const protectRoute = require("../middlewares/auth.middleware");

const express = require("express");
const groupRoutes = express.Router()

groupRoutes.post("/create", protectRoute, createGroupUser)
groupRoutes.put("/delete", protectRoute, deleteGroup)
groupRoutes.get("/user-group", protectRoute, getGroupsByUser)
groupRoutes.put("/add-member", protectRoute, addMemberGroup)
groupRoutes.put("/remove-member", protectRoute, removeMemberGroup)
groupRoutes.get("/fetch-members", protectRoute, getAllMemmbersOfGroup)
groupRoutes.post("/message", protectRoute, sendGroupMessage)
groupRoutes.post("/messages", protectRoute, getMessagesGroup)

groupRoutes.get("/find-user",protectRoute,findingUser );



module.exports = { groupRoutes };