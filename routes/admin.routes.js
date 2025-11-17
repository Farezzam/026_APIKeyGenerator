const controller = require("../controllers/admin.controller");
const { verifyToken } = require("../middleware/auth.middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  // Rute Publik
  app.post("/api/admin/register", controller.register);
  app.post("/api/admin/login", controller.login);

  // Rute Terproteksi (butuh token)
  app.get("/api/admin/users", [verifyToken], controller.getListUsers);
  app.get("/api/admin/apikeys", [verifyToken], controller.getListApiKeys);
};