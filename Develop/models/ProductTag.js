const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    // define columns
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      // This is a reference to another model
      model: 'product',
      // This is the column name of the referenced model
      key: 'id',
      }
  },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        // This is a reference to another model
        model: 'tag',
        // This is the column name of the referenced model
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'producttag',
  }
);

module.exports = ProductTag;
