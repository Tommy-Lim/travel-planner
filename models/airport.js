'use strict';
module.exports = function(sequelize, DataTypes) {
  var airport = sequelize.define('airport', {
    name: DataTypes.STRING,
    lettercode: DataTypes.STRING,
    numbercode: DataTypes.INTEGER,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return airport;
};
