const mongoose = require("mongoose")
const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "group", default: null },
    text: String,
   
    image: String,
}, { timestamps: true });

const Message = mongoose.model("messages", messageSchema)
module.exports = Message