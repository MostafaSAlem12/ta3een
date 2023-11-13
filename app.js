const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cors = require("cors");
const nocache = require("nocache");
const helmet = require("helmet");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { config } = require("dotenv");

const tb = require("./middlewares/tb");
const auth = require("./routes/auth");
const index = require("./routes/index");
const dry = require("./routes/dry");
const fresh = require("./routes/fresh");
const store = require("./routes/store");
const reports = require("./routes/reports");
const purchase = require("./routes/purchase");
const meal = require("./routes/meals");
const returned = require("./routes/returned");
const users = require("./routes/users");

const { isSignedIn, isNotSignedIn } = require("./middlewares/auth");
const clientIPAddress = require("./middlewares/client_ip_address");
const limiter = require("./middlewares/rate_limiter");

const app = express();
config();
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
};

const server = https.createServer(httpsOptions, app);
const dbUri = "mongodb://127.0.0.1:27017";
mongoose
  .connect(dbUri + "/" + process.env.DB_NAME)
  .then(() => {
    console.log("DB connected");
    const port = process.env.PORT || 6000;
    app.use(cors());
    app.use(nocache());
    app.use(helmet());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(methodOverride("_method"));
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));
    app.set("trust proxy", 1);
    app.use(
      session({
        cookie: {
          secure: true,
          // maxAge: 60000,
        },
        store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1/ta3een" }),
        secret: "geeksforgeeks",
        saveUninitialized: true,
        resave: false,
      })
    );
    app.use(clientIPAddress);
    app.use(limiter);
    app.use(flash());
    app.use("/public", express.static(path.join(__dirname, "/public")));
    //app.use(tb);
    app.use(isSignedIn);
    app.use("/", auth);
    app.use("/", index);
    app.use("/dry", dry);
    app.use("/fresh", fresh);
    app.use("/store", store);
    app.use("/reports", reports);
    app.use("/purchases", purchase);
    app.use("/meals", meal);
    app.use("/returned", returned);
    app.use("/users", users);
    app.use(function (req, res) {
      res.status(404).render("404");
    });
    server.listen(port, () => {
      console.log("Server running on port:", port);
    });
  })
  .catch((err) => {
    console.log("DB failed to connect", err);
  });
