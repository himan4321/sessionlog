const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");

const app = express();

mongoose.connect("mongodb+srv://catci142:catci142@cluster0.oyfmupl.mongodb.net/sessionlog?retryWrites=true&w=majority&appName=Cluster0")
  .then(console.log("MongoDB connected"));

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Specify your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://catci142:catci142@cluster0.oyfmupl.mongodb.net/sessionlog?retryWrites=true&w=majority&appName=Cluster0",
      ttl: 24 * 60 * 60, // 1 day
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const userExists = await User.findOne({ username });
  if (userExists) return res.status(400).json({ message: "User exists" });

  const newUser = new User({ username, password });
  await newUser.save();
  res.json({ message: "Signup successful" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || user.password !== password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  req.session.user = user;
  const sessionId = req.sessionID; // Retrieve session ID

  // Savening the session here and sending session ID back to the frontend
  req.session.save(() => {
    console.log("Session after login:", req.session);  // Debugging session
    res.json({ message: "Login successful", sessionId }); // Send sessionId to frontend
  });
});


app.get("/profile", async (req, res) => {

  console.log("Session before profile: ", req.session);

  if (!req.session.user) return res.status(401).json({ message: "Not logged in" });

  console.log("Session ID: ", req.sessionID); //session id check
  res.json({ user: req.session.user });
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
});

app.listen(5000, () => console.log("Server running on port 5000"));
