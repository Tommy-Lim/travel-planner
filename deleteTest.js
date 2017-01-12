var db = require("./models");

db.user.find({
  where: {email: "tlim24@gmail.com"},
  include: [db.city]
}).then(function(user) {
  db.city.find({where: {zip: 98105}}).then(function(city) {
    user.removeCity(city).then(function(user) {
      console.log("updated:", user.cities);
    });
  });
});
