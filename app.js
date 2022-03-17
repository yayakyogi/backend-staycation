const express = require("express");
const expressLayout = require("express-ejs-layouts");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const app = express();
const port = 3000;

// require route
const indexRouter = require("./router/index");
const adminRouter = require("./router/admin");
const superadminRouter = require("./router/superadmin");
const apiRouter = require("./router/api");

// koneksi database
// require("./utils/db");

// konfigurasi ejs
// app.set("view engine", "ejs");
// app.use(expressLayout);
// app.use(express.static(__dirname + "/public"));
// app.use(express.urlencoded({ extended: true }));

// konfigurasi http method
// app.use(methodOverride("_method"));
// konfigurasi flash
// app.use(cookieParser());
// app.use(
//   session({
//     cookie: { maxAge: 1 * 60 * 60 * 1000 },
//     secret: "secret",
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// app.use(flash());

// routing
// app.use("/", indexRouter);
// app.use("/admin", adminRouter);
// app.use("/superadmin", superadminRouter);
// app.use("/api/v1/member", apiRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

// handle page not found
// app.get("*", (req, res) => {
//   res.status(404);
//   res.render("404", {
//     title: "Halaman tidak ditemukan",
//     layout: "404",
//   });
// });

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`);
});
