const Group = require("../models/group.model");
const mongoose = require("mongoose");
const Message = require("../models/message.model");
const { io, getReceiverSocketId } = require("../lib/socket");
const User = require("../models/user.model");
const createGroupUser = async (req, res) => {
    try {

        const adminId = req.user._id;
        const memberId = req.user._id;
        const { name, groupAvatar, description } = req.body;

        const groupInfo = {
            name, groupAvatar, description, admin: adminId, members: [memberId]
        }
        const groupSave = new Group(groupInfo)
        await groupSave.save()
        return res.status(201).json({

            description: groupSave.description,
            groupAvatar: groupSave.groupAvatar,
            name: groupSave.name,
            admin: groupSave.admin,
        })
    } catch (error) {
        res.status(500).json({
            msg: "Internal server error Hello"
        })
    }

}
const getGroupsByUser = async (req, res) => {

    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const groupsByUser = await Group.find({ members: userId });

        res.status(200).json(groupsByUser)
    } catch (error) {
        res.status(500).json({
            msg: error.message
        })
    }

}
const addMemberGroup = async (req, res) => {
    try {
        const { groupId, newMembers } = req.body
        const userId = req.user._id
        const userAdmin = await Group.findOne({ _id: groupId }, { admin: userId })
        if (!Array.isArray(newMembers) || newMembers.length === 0) {
            return res.status(400).json({ msg: "newMembers must be a non-empty array" });
        }
        if (!userAdmin) {
            res.status(400).json({
                msg: "Access denied must be admin"
            })
        }
        const groupUpdate = await Group.updateOne(
            { _id: groupId },
            { $addToSet: { members: { $each: newMembers } } }
        )
        res.status(200).json(groupUpdate)
    } catch (error) {
        res.status(500).json({
            msg: error.message
        })
    }
}
const removeMemberGroup = async (req, res) => {
    try {
        const { groupId, memberId } = req.body;
        const userId = req.user._id;


        const group = await Group.findOne({ _id: groupId, admin: userId });
        if (!group) {
            return res.status(403).json({ msg: "Access denied: must be admin" });
        }


        if (memberId === userId.toString()) {
            return res.status(400).json({ msg: "Admin cannot remove themselves" });
        }

        const memberObjId = new mongoose.Types.ObjectId(memberId);
        const updateResult = await Group.updateOne(
            { _id: groupId },
            { $pull: { members: memberObjId } }
        );


        res.status(200).json(updateResult);
    } catch (error) {
        res.status(500).json({
            msg: error.message
        })
    }
}
const getAllMemmbersOfGroup = async (req, res) => {
    try {
        const { groupId } = req.query;

        if (!groupId) {
            return res.status(400).json({ msg: "groupId is required" });
        }

        const group = await Group.findById(groupId).populate("members");

        if (!group) {
            return res.status(404).json({ msg: "Group not found" });
        }

        res.status(200).json(group.members); // Only return member data
    } catch (error) {
        console.error("Error fetching group members:", error);
        res.status(500).json({ msg: "Server error: " + error.message });
    }
};

const sendGroupMessage = async (req, res) => {
    try {
        const { groupId, text, image } = req.body;
        const senderId = req.user?._id;

        if (!senderId) {
            console.log("❌ senderId is missing", req.user);
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            console.log("❌ Group not found:", groupId);
            return res.status(404).json({ msg: "Group not found" });
        }

        if (!group.members.includes(senderId.toString())) {
            console.log("❌ User is not in group", senderId, group.members);
            return res.status(403).json({ msg: "You are not a member of this group" });
        }

        const newMessage = new Message({
            senderId,
            groupId,
            text,
            image,
        });

        await newMessage.save();


        group.members.forEach((memberId) => {
            const socketId = getReceiverSocketId(memberId.toString());
            if (socketId) {
                io.to(socketId).emit("newGroupMessage", newMessage);
            }
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(" Internal Server Error in sendGroupMessage:", error);
        res.status(500).json({ msg: error.message });
    }
};



const getMessagesGroup = async (req, res) => {
    try {
        const { groupId } = req.body


        const messages = await Message.find({ groupId })
        res.status(200).json(messages)

    } catch (error) {
        res.status(500).json({
            msg: "Internal server error"
        })
    }

}
const findingUser = async (req, res) => {
    const { query } = req.query;

    if (!query) return res.status(400).json({ msg: "Missing query" });

    const user = await User.findOne({
        $or: [{ email: query }, { username: query }],
    });

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ _id: user._id });
}
module.exports = { createGroupUser, getGroupsByUser, addMemberGroup, removeMemberGroup, getAllMemmbersOfGroup, sendGroupMessage, getMessagesGroup, findingUser }