  // server.js
const express = require("express");
const app = express();
app.use(express.json());

// In-memory storage for active users
const activeUsers = [];

// Register a user
app.post("/register", (req, res) => {
  const { userId, displayName } = req.body;
  if (!userId || !displayName) return res.status(400).json({ error: "Missing userId or displayName" });

  // Remove duplicates if already registered
  const idx = activeUsers.findIndex(u => u.userId === userId);
  if (idx !== -1) activeUsers.splice(idx, 1);

  // Add to the front of the list
  activeUsers.unshift({ userId, displayName, timestamp: Date.now() });

  // Optional: limit list size
  if (activeUsers.length > 200) activeUsers.length = 200;

  res.json({ ok: true });
});

// Fetch the list of active users
app.get("/list", (req, res) => {
  res.json(activeUsers.map(u => ({ userId: u.userId, displayName: u.displayName })));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
