const db = require("../models");
const User = db.user;
const ApiKey = db.apiKey;
const { v4: uuidv4 } = require('uuid'); 

// Fungsi "Save" (saveUser) dan (getUserDetails) tidak perlu diubah.
// getUserDetails sekarang akan otomatis mengembalikan array 'apiKeys'
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

exports.getUserDetails = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Sequelize otomatis akan include 'apiKeys' (plural) sebagai array
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


// === FUNGSI GENERATE API KEY (LOGIKA BARU) ===
exports.generateApiKey = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // 1. Nonaktifkan (set outofdate = true) semua key lama user ini
    await ApiKey.update(
      { outofdate: true },
      { where: { userId: userId } }
    );

    // 2. Buat key baru yang aktif
    const newKeyString = uuidv4();
    const newApiKey = await ApiKey.create({
      key: newKeyString,
      outofdate: false, // Key baru ini aktif
      userId: userId   // Link ke user
    });

    res.status(201).send({ message: "New API Key generated. Old keys deactivated.", apiKey: newApiKey });
    
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};