const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const { authRoutes } = require("./routes/auth.route");
const { messageRoutes } = require("./routes/message.route");
const connectDB = require("./lib/db");
const { app, server } = require("./lib/socket");

dotenv.config();

// ❌ Remove this line, __dirname is already available in CommonJS
// const __dirname = path.resolve(); 

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

server.listen(process.env.PORT, () => {
    console.log("Running on port number:", process.env.PORT);
    connectDB();
});
