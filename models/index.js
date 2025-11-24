const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

// Membuat koneksi Sequelize
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT, 
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

// Membuat object db
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import semua model
db.admin = require("./admin.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.apiKey = require("./apikey.model.js")(sequelize, Sequelize);

// ============================
//         DEFINISI RELASI
// ============================

// 1 User bisa punya banyak API Key
db.user.hasMany(db.apiKey, { 
    foreignKey: "userId",
    as: "apikeys",          // <--- alias wajib
    onDelete: "CASCADE"
});

// API Key dimiliki oleh User
db.apiKey.belongsTo(db.user, { 
    foreignKey: "userId",
    as: "user"              // <--- alias agar bisa include
});

// Export
module.exports = db;
