if (process.env.NODE_ENV === "development") require("dotenv").config();
require("dotenv").config();
require("./mongooseClient");
require("./config/passportConfig");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");

const userRoutes = require("./routes/users");
const personEntityRoutes = require("./routes/personEntity");
const placeEntityRoutes = require("./routes/placeEntity");
var app = express();

//middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use("/api/users", userRoutes);
//insert actual path after root URL for entity routes
app.use("/test/personEntity", personEntityRoutes);
app.use("/test/placeEntity", placeEntityRoutes);

//error handeling
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    var valErrors = [];
    Object.keys(err.errors).forEach(key =>
      valErrors.push(err.errors[key].message)
    );
    res.status(422).send(valErrors);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
