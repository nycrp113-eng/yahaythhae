
const express = require("express");
const app = express();
app.use(express.json());


const activeUsers = [];


app.post("/register", (req, res) => {
  const { userId, displayName } = req.body;
  if (!userId || !displayName) return res.status(400).json({ error: "Missing userId or displayName" });


  const idx = activeUsers.findIndex(u => u.userId === userId);
  if (idx !== -1) activeUsers.splice(idx, 1);


  activeUsers.unshift({ userId, displayName, timestamp: Date.now() });


  if (activeUsers.length > 200) activeUsers.length = 200;

  res.json({ ok: true });
});


app.get("/list", (req, res) => {
  res.json(activeUsers.map(u => ({ userId: u.userId, displayName: u.displayName })));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
