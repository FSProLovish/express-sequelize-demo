const express = require("express");
require("dotenv").config();
const { connectDB, sequelize } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const routes = require("./routes");

app.use("/api", routes);

const server = http.createServer(app);
initializeSocket(server);

const startServer = async () => {
  try {
    await connectDB();

    // await sequelize.sync({ force: process.env.NODE_ENV === "development" });
    console.log("✅ Database synchronized successfully");

    server.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.log("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
