'use strict';
module.exports = function(sequelize, DataTypes) {
  var country = sequelize.define('country', {
    name: DataTypes.STRING,
    code: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return country;
};