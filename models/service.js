'use strict';
const {
  Model
} = require('sequelize');
const { Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    formatPrice(){
      const format = this.price.toString().split('').reverse().join('');
      const convert = format.match(/\d{1,3}/g);
      const rupiah = 'Rp. ' + convert.join('.').split('').reverse().join('') + ',00'
      return rupiah
    }

    static search(search){
      let where = {}
      if (search){
        where ={
          name: {
            [Op.iLike] : `%${search}%`
          }
        }
      }
      return new Promise((resolve, reject)=>{
          Service.findAll({
          where,
          include: ['Category']
        })
          .then(services=>{
            resolve(services)
          })
          .catch(err=>{
            reject(err)
          })
      }) 
      
    }
    // static serviceDetail(id){
    //   return new Promise((resolve, reject)=>{
    //     Service.findByPk(+id, {
    //       include: ['Detail', 'Category']
    //     })
    //       .then(services=>{
    //         resolve(services)
    //       })
    //       .catch(err=>{
    //         reject(err)
    //       })
    //   }) 

      
    // }

    static associate(models) {
      // define association here
      Service.belongsTo(models.User)
      Service.hasOne(models.Detail)
      Service.belongsTo(models.Category)
    }
  }
  Service.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg:`name is required`
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg:`description is required`
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg:`price is required`
        },
        isAvailable(value) {
          if (value) {
            if (value < 10000) {
              throw new Error('minimum price is 10000')
            }
          }
        }
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg:`image is required`
        }
      }
    },
    UserId: DataTypes.INTEGER,
    CategoryId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notNull: {
          msg:`category is required`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Service',
  });
  return Service;
};