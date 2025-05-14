const mongoose = require("mongoose")
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB);
        console.log("MONGO_DB connected : ", conn.connection.host)
    } catch (error) {
        console.log("Error Occured while connecting MONGO_DB", error)
    }
}
module.exports = connectDB