module.exports = (sequelize, Sequelize) => {
  const ApiKey = sequelize.define("apikey", {
    key: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    outofdate: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    // Kolom 'userId' akan ditambahkan secara otomatis oleh Sequelize
    // karena relasi yang kita definisikan di models/index.js
  });
  return ApiKey;
};