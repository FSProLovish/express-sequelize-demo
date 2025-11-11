const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(125),
      allowNull: false,
      validate: {
        isAlpha: true,
      },
      set(value) {
        this.setDataValue("firstName", value ? value.trim() : null);
      },
    },
    lastName: {
      type: DataTypes.STRING(65),
      validate: {
        isAlpha: true,
      },
      set(value) {
        this.setDataValue("lastName", value ? value.trim() : null);
      },
    },
    emailId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        emailValidator(value) {
          if (!validator.isEmail(value)) {
            throw new Error("Invalid Email Address: " + value);
          }
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        passwordValidator(value) {
          if (!validator.isStrongPassword(value)) {
            throw new Error("Enter a Strong Password: " + value);
          }
        },
      },
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        min: 18,
      },
    },
    gender: {
      type: DataTypes.STRING,
      validate: {
        validate(value) {
          if (["male", "female", "others"].includes(value)) {
            throw new Error("Gender data is not valid.");
          }
        },
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "created",
    },
    about: {
      type: DataTypes.STRING,
      defaultValue: "This is the default about of the user.",
    },
    skill: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    timestamps: true,
  }
);

User.findById = async function (id) {
  const user = await User.findByPk(id);
  return user ? user.toJSON() : null;
};

User.findByEmail = async function (emailId) {
  const user = await User.findOne({
    raw: true,
    where: { emailId },
  });
  return user;
};

User.updateById = async function (data, id) {
  await User.update(data, { where: { id } });
};

module.exports = User;
