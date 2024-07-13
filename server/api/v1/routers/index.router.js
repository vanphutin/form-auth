const registerRouter = require("./auth.router");

module.exports = (app) => {
  const version = "/api/v1";
  app.use(version + "/auth", registerRouter);
};
