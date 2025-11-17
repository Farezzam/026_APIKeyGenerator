const express = require("express");
const cors = require("cors");
const path = require("path");
require('dotenv').config();

const app = express();

app.use(cors()); // Mengizinkan CORS
app.use(express.json()); // Middleware untuk parsing JSON
app.use(express.urlencoded({ extended: true })); // Middleware untuk parsing form data

// === Sinkronisasi Database ===
const db = require("./models");
// db.sequelize.sync(); // Jalankan ini sekali untuk membuat tabel
// Gunakan { force: true } untuk testing (akan HAPUS & buat ulang tabel)
// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and re-sync db.');
// });

// === Rute API ===
require('./routes/admin.routes')(app);
require('./routes/user.routes')(app);

// === Menyajikan Tampilan Web (HTML Sederhana) ===
// Memberi tahu Express di mana file statis (HTML, CSS, JS) berada
app.use(express.static(path.join(__dirname, 'views')));

// Rute untuk menyajikan halaman web
app.get('/user-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'user.html'));
});

app.get('/admin-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Rute dasar
app.get("/", (req, res) => {
  res.json({ message: "Selamat datang di API service." });
});

// Set port dan jalankan server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}. http://localhost:${PORT}`);
});