const express = require("express");
const expressLayout = require("express-ejs-layouts");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const cors = require("cors");
const app = express();

app.use(cors());

// koneksi database
require("./utils/db");

// konfigurasi ejs
app.set("view engine", "ejs");
app.use(expressLayout);
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// konfigurasi http method
app.use(methodOverride("_method"));
// konfigurasi flash
app.use(cookieParser());
app.use(
  session({
    cookie: { maxAge: 1 * 60 * 60 * 1000 },
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// require route
const indexRouter = require("./router/index");
const adminRouter = require("./router/admin");
const superadminRouter = require("./router/superadmin");
const apiRouter = require("./router/api");

// routing
app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/superadmin", superadminRouter);
app.use("/api/v1/member", apiRouter);

// handle page not foun
app.get("*", (req, res) => {
  res.status(404);
  res.render("404", {
    title: "Halaman tidak ditemukan",
    layout: "404",
  });
});

// handle error
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening on port 3000`);
});
