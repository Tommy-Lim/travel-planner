'use strict';
module.exports = function(sequelize, DataTypes) {
  var users_cities = sequelize.define('users_cities', {
    userId: DataTypes.INTEGER,
    cityId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return users_cities;
};