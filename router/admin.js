const router = require("express").Router();
const indexController = require("../controllers/indexController");
const auth = require("../middlewares/auth");
const { uploadSingle, uploadMultiple } = require("../middlewares/multer");
const categoryController = require("../controllers/admin_controller/categoryController");
const bankController = require("../controllers/admin_controller/bankController");
const itemController = require("../controllers/admin_controller/itemController");
const featureController = require("../controllers/admin_controller/featureController");
const activityController = require("../controllers/admin_controller/activityController");
const bookingController = require("../controllers/admin_controller/bookingController");

router.get("/signin", indexController.viewSignIn);
router.post("/signin", indexController.signInAction);
router.use(auth);
router.get("/signout", indexController.signOutAction);
router.get("/dashboard", indexController.viewDashboard);
// end point category
router.get("/category", categoryController.viewCategory);
router.get("/category/add", categoryController.viewAddCategory);
router.get("/category/edit/:_id", categoryController.viewEditCategory);
router.post("/category", categoryController.addCategory);
router.put("/category", categoryController.updateCategory);
router.delete("/category", categoryController.deleteCategory);

// end point bank
router.get("/bank", bankController.viewBank);
router.get("/bank/add", bankController.viewAddBank);
router.post("/bank", uploadSingle, bankController.addBank);
router.get("/bank/edit/:_id", bankController.viewEditBank);
router.put("/bank", uploadSingle, bankController.updateBank);
router.delete("/bank", bankController.deleteBank);

// end point item
router.get("/item", itemController.viewItem);
router.get("/item/add", itemController.viewAddItem);
router.post("/item", uploadMultiple, itemController.addItem);
router.get("/item/show-image/:_id", itemController.viewImageItem);
router.get("/item/edit-item/:_id", itemController.viewEditItem);
router.put("/item", uploadMultiple, itemController.updateItem);
router.delete("/item", itemController.deleteItem);

// end point detail item (feature)
router.get("/item/feature/:itemId", featureController.viewFeature);
router.post("/item/feature/add", uploadSingle, featureController.addFeature);
router.get("/item/feature/edit/:featureId", featureController.viewEditFeature);
router.put(
  "/item/feature/update",
  uploadSingle,
  featureController.updateFeature
);
router.delete("/item/feature/delete", featureController.deleteFeature);

// end point detail item (activity)
router.get("/item/activity/:itemId", activityController.viewActivity);
router.post("/item/activity/add", uploadSingle, activityController.addActivity);
router.get(
  "/item/activity/edit/:activityId",
  activityController.viewEditActivity
);
router.put(
  "/item/activity/update",
  uploadSingle,
  activityController.updateActivity
);
router.delete("/item/activity/delete", activityController.deleteActivity);

// end point booking controller
router.get("/booking", bookingController.viewBooking);
router.get("/booking/:id", bookingController.detailBooking);
router.get("/booking/accept/:id", bookingController.acceptBooking);
router.get("/booking/reject/:id", bookingController.rejectBooking);

module.exports = router;
