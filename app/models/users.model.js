module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    user_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING
    },

    number: {
      type: Sequelize.STRING
    },

    otp: {
      type: Sequelize.STRING
    },

  }, {
    timestamps: true
  });

  return User;
};
