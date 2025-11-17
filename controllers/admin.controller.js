const db = require("../models");
const Admin = db.admin;
const User = db.user;
const ApiKey = db.apiKey;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Admin Register
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "Email and password are required." });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const admin = await Admin.create({
      email: email,
      password: hashedPassword
    });

    res.status(201).send({ message: "Admin registered successfully!", adminId: admin.id });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error registering admin." });
  }
};

// Admin Login
exports.login = async (req, res) => {
  try {
    const admin = await Admin.findOne({ where: { email: req.body.email } });

    if (!admin) {
      return res.status(404).send({ message: "Admin Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, admin.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const token = jwt.sign({ id: admin.id }, JWT_SECRET, {
      expiresIn: 86400 // 24 jam
    });

    res.status(200).send({
      id: admin.id,
      email: admin.email,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// === Rute Terproteksi (Butuh Token) ===

// Admin melihat list user
exports.getListUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Admin melihat list ApiKey
exports.getListApiKeys = async (req, res) => {
  try {
    const keys = await ApiKey.findAll({
      include: [{ // Sekaligus mengambil data user pemilik key
        model: db.user,
        attributes: ['email', 'firstname'] // Hanya ambil email & nama
      }]
    });

    // Mengolah data sesuai permintaan: key, out of date, status inactive
    const processedKeys = keys.map(k => {
      return {
        key: k.key,
        out_of_date: k.outofdate,
        status_inactive: k.outofdate ? "Inactive" : "Active", // Status berdasarkan outofdate
        user_email: k.user ? k.user.email : "No User",
        user_name: k.user ? `${k.user.firstname} ${k.user.lastname}` : "No User"
      }
    });

    res.status(200).send(processedKeys);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};