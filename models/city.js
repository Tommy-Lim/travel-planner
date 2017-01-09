'use strict';
module.exports = function(sequelize, DataTypes) {
  var city = sequelize.define('city', {
    name: DataTypes.STRING,
    country: DataTypes.STRING,
    code: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return city;
};