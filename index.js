const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieparser = require("cookie-parser");
require("dotenv").config({ path: "./.env" });

const app = express();
app.use(express.json());
app.use(cookieparser())
app.use(express.static(path.join(__dirname, "dist")))
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));

app.use((req, res) => {
  res.status(404).json({ message: "Resource Not Found" });
});

app.use((err, req, res, next) => {
    console.log(err);

    res.status(500).json({ message: err.message || "Something Went Wrong" });
});

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
    console.log("MONGO CONNECTED");
    app.listen(process.env.PORT, () => {
        console.log(`SERVER RUNNING 🏃‍♀️ on port ${process.env.PORT}`);
    });
});

mongoose.connection.on("error", (err) => {
    console.error("MONGO CONNECTION ERROR:", err);
});
