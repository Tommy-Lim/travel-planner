'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: 'Name must be between 1 and 99 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email address'
        }
      }
    },
    password: {
      type: DataTypes.TEXT,
      validate: {
        len: {
          args: [8, 99],
          msg: 'Password must be between 8 and 99 characters'
        }
      }
    },
    image: {
      type: DataTypes.TEXT,
      validate: {
      }
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: {
          msg: 'Invalid age'
        }
      }
    },
    citycode: {
      type: DataTypes.INTEGER,
      validate: {
      }
    },
    zip: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: {
          msg: 'Invaled age'
        },

      }
    },
  },{
    hooks:{
      beforeCreate: function(createdUser, options, callback){
        var hash = bcrypt.hashSync(createdUser.password, 10);
        createdUser.password = hash;
        callback(null, createdUser);
      }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.user.belongsToMany(models.city, {through: "users_cities"});
      }
    },
    instanceMethods: {
      validPassword: function(password){
        return bcrypt.compareSync(password, this.password);
      },
      toJSON: function(){
        var jsonUser = this.get();
        delete jsonUser.password;
        return jsonUser;
      }
    }
  });
  return user;
};
