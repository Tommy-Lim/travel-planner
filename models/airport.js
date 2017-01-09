'use strict';
module.exports = function(sequelize, DataTypes) {
  var airport = sequelize.define('airport', {
    name: DataTypes.STRING,
    lettercode: DataTypes.STRING,
    numbercode: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return airport;
};