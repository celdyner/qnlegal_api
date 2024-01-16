require("dotenv").config();
const cors = require("cors");
const express = require("express");
const paginate = require("express-paginate");
const passport = require("passport");
const bodyParser = require("body-parser");
const { connect } = require("mongoose");

const app = express();

// Enable CORS before other middleware
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://qnlegal.org');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true'); // Corrected header name
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
require("./middleware/passport-middleware.js")(passport);
app.use(bodyParser.json());

app.use(paginate.middleware(process.env.LIMIT, process.env.MAX_LIMIT));

const router = require("./routes/index");
app.use(router);

// Add a route handler for the root path ("/")
app.get("/", (req, res) => {
  res.send("Hello, this is your API root!");
});

const runApp = async () => {
  try {
    await connect(process.env.MONGO_DB, {});
    console.log(`Database connection was successful! ${process.env.MONGO_DB}`);
    app.listen(process.env.PORT, () => {
      console.log(`Server started successfully on PORT ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
    runApp();
  }
};

runApp();
