const express = require("express");
const app = express();
const port = 8081;
const database = require("./config/database.config");
const apiRouterV1 = require("./api/v1/routers/index.router");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const cookieParser = require("cookie-parser");

//cookie parser
app.use(cookieParser());

//cors
app.use(cors());

//parse application
app.use(bodyParser.json());

// SET STORAGE
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now());
//   },
// });

// var upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("hello world 🍀");
});

//router
apiRouterV1(app);

database.getConnection((error, connection) => {
  if (error) {
    console.error("Error connecting to database:", error);
    return;
  }
  console.log("Connected to MySQL database");
  connection.release();
  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
});
