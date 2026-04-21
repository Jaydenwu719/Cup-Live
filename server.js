const express = require("express");

const app = express();
app.use(express.json());

// 🏆 LIVE STATE
let state = {
  game: "",
  round: 1,
  scores: {},
  updatedAt: Date.now()
};

// ❌ DISABLE CACHE (IMPORTANT)
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// 🌐 serve overlay
app.use(express.static(__dirname));

// 📡 BOT → SERVER
app.post("/update", (req, res) => {
  state = {
    ...req.body,
    updatedAt: Date.now()
  };

  console.log("📡 UPDATE RECEIVED", state);
  res.sendStatus(200);
});

// 📊 WEBSITE → SERVER
app.get("/data", (req, res) => {
  res.json(state);
});

// 🧠 health
app.get("/", (req, res) => {
  res.send("🏆 CUP LIVE ONLINE");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🌐 Server running on", PORT);
});