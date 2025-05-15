const Message = require("../models/message.model")
const v2 = require("../lib/cloudinary");
const User = require("../models/user.model");
const { getReceiverSocketId,io } = require("../lib/socket");
const getUsersForSidebar = async (req, res) => {
    try {
        
        const loggedInUserId = req.user._id;
       
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        res.status(200).json(filteredUsers)
    } catch (error) {
        res.status(500).json({
            msg: "Internal server error Hello"
        })
    }
}
const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id

        const messages = await Message.find({
            $or: [
                {
                    senderId: myId, receiverId: userToChatId
                },
                {
                    receiverId: myId, senderId: userToChatId
                },

            ]
        })
        res.status(200).json(messages)

    } catch (error) {
        res.status(500).json({
            msg: "Internal server error"
        })
    }

}
const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params
        const senderId = req.user._id
        let imageUrl;
        if (image) {
            const uploadResp = await v2.uploader.upload(image)
            imageUrl = uploadResp.secure_url;
        }
        const newMessage = new Message({
            senderId, receiverId, text, image: imageUrl
        })
         const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        await newMessage.save()
       
        res.status(201).json(newMessage)
    } catch (error) {
        res.status(500).json({
            msg: "Internal server error"
        })
    }
}

module.exports = { getMessages, getUsersForSidebar, sendMessage }
