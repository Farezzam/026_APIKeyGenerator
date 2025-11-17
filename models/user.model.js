module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    firstname: {
      type: Sequelize.STRING
    },
    lastname: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    }
  });
  return User;
};