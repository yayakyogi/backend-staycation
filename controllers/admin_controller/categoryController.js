const Category = require("../../models/Category");

module.exports = {
  // Category
  viewCategory: async (req, res) => {
    const category = await Category.find();

    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };

    res.render("admin/category/view_category", {
      title: "Staycation | Halaman Category",
      layout: "layouts/main-layouts",
      category,
      alert,
      user: req.session.user,
    });
  },

  // View Add Category
  viewAddCategory: (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };

    res.render("admin/category/add_category", {
      title: "Staycation | Tambah Category",
      layout: "layouts/main-layouts",
      alert,
      user: req.session.user,
    });
  },

  // Add Category
  addCategory: async (req, res) => {
    const name = req.body;
    try {
      await Category.insertMany([name]);
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Sukses menambah Category");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect(`/admin/category/add`);
    }
  },

  // View Edit Category
  viewEditCategory: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };

    const category = await Category.findOne({
      _id: req.params._id,
    });

    res.render("admin/category/edit_category", {
      title: "Staycation | Edit Category",
      layout: "layouts/main-layouts",
      category,
      alert,
      user: req.session.user,
    });
  },

  // Update Category
  updateCategory: async (req, res) => {
    const { _id } = req.body;
    try {
      await Category.updateOne(
        {
          _id: _id,
        },
        {
          $set: {
            name: req.body.name,
          },
        }
      );
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Sukses mengubah Category");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect(`/admin/category/edit/${_id}`);
    }
  },

  // Delete Category
  deleteCategory: async (req, res) => {
    const { _id } = req.body;
    try {
      await Category.deleteOne({
        _id: _id,
      });
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Sukses menghapus Category");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/admin/category/");
    }
  },
};
