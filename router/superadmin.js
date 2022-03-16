const router = require("express").Router();
const adminController = require("../controllers/superadmin_controller/adminController");

// end point admin
router.get("/admin", adminController.viewAdmin);
router.get("/admin/add", adminController.viewAddAdmin);
router.post("/admin", adminController.addAdmin);
router.get("/admin/edit/:_id", adminController.viewEditAdmin);
router.put("/admin", adminController.updateAdmin);
router.delete("/admin", adminController.deleteAdmin);
router.get("/admin/edit-password/:_id", adminController.viewEditPassword);
router.put("/edit-password", adminController.updatePassword);
module.exports = router;
