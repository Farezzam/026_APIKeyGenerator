const controller = require("../controllers/user.controller");

module.exports = function(app) {
  // Rute untuk save (create/update) user.
  // Kita gunakan POST untuk create/update berdasarkan email di body
  app.post("/api/user/save", controller.saveUser);

  // Rute untuk mendapatkan detail user (termasuk apikey-nya)
  app.get("/api/user/:userId", controller.getUserDetails);

  // Rute untuk generate API Key untuk user tertentu
  app.post("/api/user/:userId/generate-key", controller.generateApiKey);
};