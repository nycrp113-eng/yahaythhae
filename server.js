const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

let activeUsers = [];
const HEARTBEAT_TIMEOUT = 30 * 1000;

app.post("/register", (req, res) => {
  const { userId, displayName } = req.body;

  if (!userId || !displayName) {
    return res.status(400).json({ error: "Missing userId or displayName" });
  }

  const timestamp = Date.now();
  const existingUser = activeUsers.find(u => u.userId === userId);

  if (existingUser) {
    existingUser.timestamp = timestamp;
  } else {
    activeUsers.push({ userId, displayName, timestamp });
  }

  activeUsers = activeUsers.filter(u => timestamp - u.timestamp <= HEARTBEAT_TIMEOUT);

  return res.json({ ok: true });
});

app.get("/list", (req, res) => {
  if (!activeUsers) activeUsers = [];
  res.json(activeUsers.map(u => ({
    userId: u.userId,
    displayName: u.displayName
  })));
});

app.get("/", (req, res) => {
  res.json({ message: "Roblox executor API is running!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
