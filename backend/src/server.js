
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const chatRoutes = require("./routes/chat");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Kiểm tra server
app.get("/", (req, res) => {
    res.json({
        message: "UDA Smart Assistant AI API is running!",
        status: "success",
        model: process.env.GEMINI_MODEL || "gemini-3.8-flash"
    });
});

// Chat API
app.use("/api/chat", chatRoutes);

// Xử lý route không tồn tại
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint không tồn tại."
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("-----------------------------------");
    console.log("UDA SMART ASSISTANT - AI SERVER");
    console.log("-----------------------------------");
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`Chat API: http://localhost:${PORT}/api/chat`);
    console.log(`Model: ${process.env.GEMINI_MODEL || "gemini-3.8-flash"}`);
    console.log("-----------------------------------");
});
