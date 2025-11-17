const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT, // <--- TAMBAHKAN INI UNTUK PORT 3307
  dialect: dbConfig.dialect,
  operatorsAliases: 0, 
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.admin = require("./admin.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.apiKey = require("./apikey.model.js")(sequelize, Sequelize);

// === DEFINISI RELASI (ONE-TO-MANY) ===
// Sesuai permintaan: Satu User bisa memiliki BANYAK ApiKey
db.user.hasMany(db.apiKey, { // <--- UBAH DARI hasOne MENJADI hasMany
    foreignKey: 'userId',
    onDelete: 'CASCADE' // Jika user dihapus, semua apikey-nya juga terhapus
});
db.apiKey.belongsTo(db.user, {
    foreignKey: 'userId'
});

module.exports = db;