// server.js
const express = require("express");
const app = express();
app.use(express.json());

// In-memory storage for active users
const activeUsers = [];
const HEARTBEAT_TIMEOUT = 30 * 1000; // 30 seconds

// Register / heartbeat route
app.post("/register", (req, res) => {
  const { userId, displayName } = req.body;
  if (!userId || !displayName) return res.status(400).json({ error: "Missing userId or displayName" });

  const idx = activeUsers.findIndex(u => u.userId === userId);
  const timestamp = Date.now();

  if (idx !== -1) {
    activeUsers[idx].timestamp = timestamp; // update heartbeat
  } else {
    activeUsers.push({ userId, displayName, timestamp });
  }

  // Remove stale users
  const now = Date.now();
  for (let i = activeUsers.length - 1; i >= 0; i--) {
    if (now - activeUsers[i].timestamp > HEARTBEAT_TIMEOUT) {
      activeUsers.splice(i, 1);
    }
  }

  res.json({ ok: true });
});

// Fetch current user list
app.get("/list", (req, res) => {
  const list = activeUsers.map(u => ({ userId: u.userId, displayName: u.displayName }));
  res.json(list);
});

// Optional: simple root route for testing
app.get("/", (req, res) => {
  res.send("Roblox executor API is running!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
