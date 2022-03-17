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

const indexController = require("./controllers/indexController");
const auth = require("./middlewares/auth");
const { uploadSingle, uploadMultiple } = require("./middlewares/multer");
const categoryController = require("./controllers/admin_controller/categoryController");
const bankController = require("./controllers/admin_controller/bankController");
const itemController = require("./controllers/admin_controller/itemController");
const featureController = require("./controllers/admin_controller/featureController");
const activityController = require("./controllers/admin_controller/activityController");
const bookingController = require("./controllers/admin_controller/bookingController");

app.get("/", indexController.viewSignIn);
app.post("/signin", indexController.signInAction);
app.use(auth);
app.get("/signout", indexController.signOutAction);
app.get("/dashboard", indexController.viewDashboard);
// end point category
app.get("/category", categoryController.viewCategory);
app.get("/category/add", categoryController.viewAddCategory);
app.get("/category/edit/:_id", categoryController.viewEditCategory);
app.post("/category", categoryController.addCategory);
app.put("/category", categoryController.updateCategory);
app.delete("/category", categoryController.deleteCategory);

// end point bank
app.get("/bank", bankController.viewBank);
app.get("/bank/add", bankController.viewAddBank);
app.post("/bank", uploadSingle, bankController.addBank);
app.get("/bank/edit/:_id", bankController.viewEditBank);
app.put("/bank", uploadSingle, bankController.updateBank);
app.delete("/bank", bankController.deleteBank);

// end point item
app.get("/item", itemController.viewItem);
app.get("/item/add", itemController.viewAddItem);
app.post("/item", uploadMultiple, itemController.addItem);
app.get("/item/show-image/:_id", itemController.viewImageItem);
app.get("/item/edit-item/:_id", itemController.viewEditItem);
app.put("/item", uploadMultiple, itemController.updateItem);
app.delete("/item", itemController.deleteItem);

// end point detail item (feature)
app.get("/item/feature/:itemId", featureController.viewFeature);
app.post("/item/feature/add", uploadSingle, featureController.addFeature);
app.get("/item/feature/edit/:featureId", featureController.viewEditFeature);
app.put("/item/feature/update", uploadSingle, featureController.updateFeature);
app.delete("/item/feature/delete", featureController.deleteFeature);

// end point detail item (activity)
app.get("/item/activity/:itemId", activityController.viewActivity);
app.post("/item/activity/add", uploadSingle, activityController.addActivity);
app.get("/item/activity/edit/:activityId", activityController.viewEditActivity);
app.put(
  "/item/activity/update",
  uploadSingle,
  activityController.updateActivity
);
app.delete("/item/activity/delete", activityController.deleteActivity);

// end point booking controller
app.get("/booking", bookingController.viewBooking);
app.get("/booking/:id", bookingController.detailBooking);
app.get("/booking/accept/:id", bookingController.acceptBooking);
app.get("/booking/reject/:id", bookingController.rejectBooking);

// handle page not foun
app.get("*", (req, res) => {
  res.status(404);
  res.render("404", {
    title: "Halaman tidak ditemukan",
    layout: "404",
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening on port 3000`);
});
