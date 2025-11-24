const controller = require("../controllers/user.controller");

module.exports = function(app) {

  // === ROUTE ASLI ===
  app.post("/api/user/save", controller.saveUser);
  app.get("/api/user/:userId", controller.getUserDetails);
  app.post("/api/user/:userId/generate-key", controller.generateApiKey);

  // === ROUTE TAMBAHAN UNTUK FLOW: Generate dulu → Save ===
  app.post("/api/generate-temp-key", controller.generateTempKey);
  app.post("/api/user/save-with-key", controller.saveUserWithKey);
};
