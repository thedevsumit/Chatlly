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

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);


server.listen(process.env.PORT, () => {
  console.log("Running on port number:", process.env.PORT);
  connectDB();
});
