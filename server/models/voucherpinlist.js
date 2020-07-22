'use strict'

module.exports = (sequelize, DataTypes) => {
  const VoucherPin = sequelize.define('voucher_pin_lists', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    voucher_pin: {
      type: DataTypes.STRING,
      required: true
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
  return VoucherPin;
};