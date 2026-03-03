import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import { Server } from "socket.io";
import { EventEmitter } from "events";

// raise default listener count to avoid repeated Bus warnings
EventEmitter.defaultMaxListeners = 20;


import { connectDB, sequelize } from "./config/database.js";
import connectCloudinary from "./config/cloudinary.js";

// Admin routes
import adminRoutes from "./routes/admin/adminRoutes.js";
import adminAddTenantRoutes from "./routes/admin/adminAddTenantRoutes.js";
import adminMaintenanceRoutes from "./routes/admin/adminMaintenanceRoutes.js";
import adminContractRoutes from "./routes/admin/adminContractRoutes.js";



// Caretaker routes
import caretakerRoutes from "./routes/caretaker/caretakerRoute.js";
import caretakerMaintenanceRoutes from "./routes/caretaker/caretakerMaintenanceRoutes.js";

// User routes
import userRoutes from "./routes/userRoutes.js";
import userMaintenanceRoutes from "./routes/userMaintenanceRoutes.js";
import userContractRoutes from "./routes/userContractRoutes.js";


//utils
import runSeeders from "./utils/runSeeders.js";
import startcontractCron from "./utils/contractCron.js";




// ===================== APP & SERVER =====================
const app = express();
const httpServer = createServer(app);


// ===================== SOCKET.IO SETUP =====================
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"], // adjust later
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ["websocket", "polling"],
});

// Make io accessible inside controllers
app.set("io", io);

// ===================== MIDDLEWARES =====================
connectCloudinary();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ===================== SOCKET EVENTS =====================
io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on("disconnect", (reason) => {
    console.log(`🔴 Client disconnected: ${socket.id}, reason: ${reason}`);
  });

  socket.on("connect_error", (error) => {
    console.log(`❌ Socket error: ${error.message}`);
  });

  // optional heartbeat
  socket.on("ping", () => {
    socket.emit("pong");
  });
});

// ===================== Admin ROUTES =====================
app.use("/api/admin", adminRoutes);
app.use("/api/admin/maintenance", adminMaintenanceRoutes);
app.use("/api/admin/tenants", adminAddTenantRoutes);
app.use("/api/admin/contracts", adminContractRoutes);



// ===================== Caretaker ROUTES =====================
app.use("/api/caretaker", caretakerRoutes);
app.use("/api/caretaker/maintenance", caretakerMaintenanceRoutes);


// ===================== User ROUTES =====================
app.use("/api/users", userRoutes);
app.use("/api/users/maintenance", userMaintenanceRoutes);
app.use("/api/users/contracts", userContractRoutes);

// Root check
app.get("/", (req, res) => {
  res.send("✅ API is working!");
});

// ===================== SERVER STARTUP =====================
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, async () => {
  try {
    await connectDB();

    // Sync models
    await sequelize.sync();

    // Run seeders safely
    await runSeeders();

    startcontractCron(); // start contract monitoring cron job

    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔌 WebSocket server ready for real-time updates`);
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
});

// Optional export if needed elsewhere
export { io };
