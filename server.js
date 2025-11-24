const express = require("express");
const cors = require("cors");
const path = require("path");
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Database ===
const db = require("./models");

// === Rute API ===
// Penting: LETAKKAN API ROUTES SEBELUM STATIC !!!
require('./routes/admin.routes')(app);
require('./routes/user.routes')(app);

// ====================================
// STATIC FILE JANGAN MENANGKAP /api/**
// ====================================

// Batasi supaya hanya file di /views saja yang diakses
app.use("/page", express.static(path.join(__dirname, "views")));

// Routing file HTML manual
app.get('/user-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'user.html'));
});

app.get('/admin-login-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin-login.html'));
});

app.get('/admin-register-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin-register.html'));
});

app.get('/admin-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Default route API
app.get("/", (req, res) => {
  res.json({ message: "Selamat datang di API service." });
});

// Jalankan server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}. http://localhost:${PORT}`);
});
