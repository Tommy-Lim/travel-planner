'use strict';
module.exports = function(sequelize, DataTypes) {
  var city = sequelize.define('city', {
    name: DataTypes.STRING,
    country: DataTypes.STRING,
    cityname: DataTypes.STRING,
    zip: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.city.belongsToMany(models.user, {through: "users_cities"});
      }
    }
  });
  return city;
};
