'use strict'

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('userlists', {
    userid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    username: {
      type: DataTypes.STRING,
      required: true
    },
    email:{
      type:DataTypes.TEXT,
      required: true
    },
    password:{
      type: DataTypes.STRING,
      required: true
    },
    tokens:{
      type:DataTypes.JSONB,
      defaultValue:[]
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at:  DataTypes.DATE,
  }, {
    paranoid: true,
    underscored: true
  });
  return User;
};