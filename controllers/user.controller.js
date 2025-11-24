const db = require("../models");
const User = db.user;
const ApiKey = db.apiKey;
const { v4: uuidv4 } = require('uuid');

// ===============================
// SAVE USER TANPA KEY (ASLI)
// ===============================
exports.saveUser = async (req, res) => {
  const { email, firstname, lastname } = req.body;

  if (!email) {
    return res.status(400).send({ message: "Email is required." });
  }

  try {
    let user = await User.findOne({ where: { email: email } });

    if (user) {
      user.firstname = firstname;
      user.lastname = lastname;
      await user.save();
      res.status(200).send({ message: "User updated successfully.", user });
    } else {
      user = await User.create({ email, firstname, lastname });
      res.status(201).send({ message: "User created successfully.", user });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// ===============================
// GET USER + API KEYS
// ===============================
exports.getUserDetails = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId, {
      include: [db.apiKey]
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// ===============================
// GENERATE API KEY (ASLI)
// ===============================
exports.generateApiKey = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Nonaktifkan semua key lama
    await ApiKey.update(
      { outofdate: true },
      { where: { userId: userId } }
    );

    // Buat key baru
    const newKeyString = uuidv4();
    const newApiKey = await ApiKey.create({
      key: newKeyString,
      outofdate: false,
      userId: userId
    });

    res.status(201).send({
      message: "New API Key generated. Old keys deactivated.",
      apiKey: newApiKey
    });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// ======================================================
// === GENERATE TEMPORARY KEY (digunakan sebelum SAVE) ===
// ======================================================
exports.generateTempKey = async (req, res) => {
  try {
    const key = uuidv4();
    res.status(200).json({ key });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==================================================================
// === SAVE USER + API KEY (flow: generate dulu → baru save user) ===
// ==================================================================
exports.saveUserWithKey = async (req, res) => {
  const { email, firstname, lastname, key } = req.body;

  if (!key) return res.status(400).json({ message: "Temp API key is required" });
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    let user = await User.findOne({ where: { email } });

    // Jika user belum ada → buat baru
    if (!user) {
      user = await User.create({ email, firstname, lastname });
    } else {
      // Perbarui user lama
      user.firstname = firstname;
      user.lastname = lastname;
      await user.save();
    }

    // Nonaktifkan semua key lama
    await ApiKey.update(
      { outofdate: true },
      { where: { userId: user.id } }
    );

    // Simpan key baru
    const newApiKey = await ApiKey.create({
      key: key,
      outofdate: false,
      userId: user.id
    });

    res.status(200).json({
      message: "User saved with API Key",
      user,
      apiKey: newApiKey
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
