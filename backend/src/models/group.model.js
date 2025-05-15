const mongoose = require("mongoose")
const groupSchema = new mongoose.Schema({

    members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },

    groupAvatar: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    description: {
        type: String,
        default: "",
    }



}, { timestamps: true })
const Group = mongoose.model("group", groupSchema)
module.exports = Group