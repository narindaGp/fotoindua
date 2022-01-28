'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Detail.belongsTo(models.Service)
      Detail.hasMany(models.Gallery)
    }
  }
  Detail.init({
    status: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg:`status is required`
        }
      }
    },
    requirement: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg:`requirement is required`
        }
      }
    },
    timeOfContract: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg:`Time of Contract is required`
        }
      }
    },
    ServiceId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Detail',
  });
  return Detail;
};