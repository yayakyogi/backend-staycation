const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = {
  // Sign In
  viewSignIn: (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user == null || req.session.user == undefined) {
        res.render("index", {
          title: "Staycation | Sign In",
          layout: "index",
          alert,
        });
      } else {
        res.redirect("/admin/dashboard");
      }
    } catch (error) {
      res.redirect("/admin/signin");
    }
  },

  // Sign In  Action
  signInAction: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username: username });
      // jika user tidak ada redirect ke halaman login
      if (!user) {
        req.flash("alertMessage", "User yang anda masukan tidak ada!!");
        req.flash("alertStatus", "error");
        res.redirect("/admin/signin");
        return false;
      }
      // validasi password
      const isPassword = await bcrypt.compare(password, user.password);
      // jika password tidak sama redirect ke halaman login
      if (!isPassword) {
        req.flash("alertMessage", "Password tidak valid!!");
        req.flash("alertStatus", "error");
        res.redirect("/admin/signin");
        return false;
      }
      // jika semua validasi diatas sukses buat session
      req.session.user = {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      };

      res.redirect("/admin/dashboard");
    } catch (error) {
      res.redirect("/admin/signin");
    }
  },

  // Logout
  signOutAction: (req, res) => {
    req.session.destroy();
    res.redirect("/admin/signin");
  },

  // Dashboard
  viewDashboard: (req, res) => {
    res.render("admin/dashboard/view_dashboard", {
      title: "Halaman index",
      layout: "layouts/main-layouts",
      user: req.session.user,
    });
  },

  // Booking
  viewBooking: (req, res) => {
    res.render("admin/booking/view_booking", {
      title: "Halaman booking",
      layout: "layouts/main-layouts",
      user: req.session.user,
    });
  },
};
