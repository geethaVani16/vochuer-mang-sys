'use strict'

module.exports = (sequelize, DataTypes) => {
  const Voucher = sequelize.define('voucherlists', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    voucher_name: {
      type: DataTypes.STRING,
      required: true
    },
    assigned_email: {
      type: DataTypes.STRING
    },
    voucher_pin: {
      type: DataTypes.STRING
    },
    limit:{
      type: DataTypes.INTEGER,
      defaultValue:5
    },
    voucher_applied_time:{
      type: DataTypes.TEXT
    },
    status:{
      type: DataTypes.STRING
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: DataTypes.DATE,
  }, {
    // paranoid: true,
    // underscored: true
  });
  return Voucher;
};