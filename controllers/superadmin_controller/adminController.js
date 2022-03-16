const bcrypt = require("bcryptjs");
const User = require("../../models/User");

module.exports = {
  // View Admin
  viewAdmin: async (req, res) => {
    const admin = await User.find();
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    res.render("superadmin/admin/view_admin", {
      title: "Staycation | Halaman Admin",
      layout: "layouts/main-layouts",
      alert,
      admin,
      user: req.session.user,
    });
  },

  // View Add Admin
  viewAddAdmin: (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("superadmin/admin/add_admin", {
        title: "Staycation | Add Admin",
        layout: "layouts/main-layouts",
        alert,
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alsertMessage", `${error}`);
      res.redirect("/superadmin/admin");
    }
  },

  // Add Admin
  addAdmin: async (req, res) => {
    // username admin password admin1234 - superadmin
    // username admintaka password admin1234 - admin
    try {
      // encrypt password
      const salt = bcrypt.genSaltSync(8);
      const pass = bcrypt.hashSync(req.body.password, salt);
      const admin = {
        name: req.body.name,
        nomorHandphone: req.body.nomorHandphone,
        email: req.body.email,
        username: req.body.username,
        password: pass,
        role: req.body.role,
      };
      await User.insertMany([admin]);
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Sukses menambahkan user");
      res.redirect("/superadmin/admin");
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alsertMessage", `${error}`);
      res.redirect("/superadmin/admin");
    }
  },

  // View Edit Admin
  viewEditAdmin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const admin = await User.findOne({
        _id: req.params._id,
      });

      res.render("superadmin/admin/edit_admin", {
        title: "Staycation | Edit Admin",
        layout: "layouts/main-layouts",
        alert,
        admin,
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/superadmin/admin");
    }
  },

  // Update Admin
  updateAdmin: async (req, res) => {
    try {
      const { _id, name, username, nomorHandphone, email, role } = req.body;
      await User.updateOne(
        {
          _id: _id,
        },
        {
          $set: {
            name,
            username,
            nomorHandphone,
            email,
            role,
          },
        }
      );
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Sukses mengubah data admin");
      res.redirect("/superadmin/admin");
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/superadmin/admin");
    }
  },

  // Delete Admin
  deleteAdmin: async (req, res) => {
    const { _id } = req.body;
    try {
      await User.deleteOne({ _id: _id });
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Sukses menghapus admin");
      res.redirect("/superadmin/admin");
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/superadmin/admin");
    }
  },

  // View Edit Admin
  viewEditPassword: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const admin = await User.findOne({
        _id: req.params._id,
      });

      res.render("superadmin/admin/edit_password", {
        title: "Staycation | Edit Admin",
        layout: "layouts/main-layouts",
        alert,
        admin,
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/superadmin/admin");
    }
  },

  // Update Password
  updatePassword: async (req, res) => {
    const { _id, oldPassword, newPassword, confirmPassword } = req.body;
    try {
      // ambil data user berdasarkan _id
      const user = await User.findOne({ _id: _id });
      // cek apakah oldPassword === user.password
      const isPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isPassword) {
        req.flash("alertStatus", "error");
        req.flash("alertMessage", "Password lama tidak valid");
        res.redirect("/superadmin/admin");
        return false;
      }
      // cek apakah newPassword === confirmPassword
      if (newPassword !== confirmPassword) {
        req.flash("alertStatus", "error");
        req.flash("alertMessage", "Password konfirmasi salah");
        res.redirect("/superadmin/admin");
        return false;
      }
      // hashing new password
      const salt = bcrypt.genSaltSync(8);
      const pass = bcrypt.hashSync(newPassword, salt);
      // simpan ke database
      user.password = pass;
      await user.save();
      // redirect ke index
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Sukses mengubah password");
      res.redirect("/superadmin/admin");
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/superadmin/admin");
    }
  },
};
