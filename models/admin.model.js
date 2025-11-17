module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define("admin", {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
  return Admin;
};