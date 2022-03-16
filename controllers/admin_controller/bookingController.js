const Booking = require("../../models/Booking");
const Member = require("../../models/Member");

module.exports = {
  // View Booking
  viewBooking: async (req, res) => {
    try {
      const alertStatus = req.flash("alertStatus");
      const alertMessage = req.flash("alertMessage");
      const alert = { status: alertStatus, message: alertMessage };
      const booking = await Booking.find().populate("memberId");

      res.render("admin/booking/view_booking", {
        title: "Staycation | Booking",
        user: req.session.user,
        layout: "layouts/main-layouts",
        booking,
        alert,
      });
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/admin/booking");
    }
  },

  // Detail Booking
  detailBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const alertStatus = req.flash("alertStatus");
      const alertMessage = req.flash("alertMessage");
      const alert = { status: alertStatus, message: alertMessage };
      const booking = await Booking.findOne({ _id: id }).populate("memberId");

      res.render("admin/booking/detail_booking", {
        title: "Staycation | Detail Booking",
        user: req.session.user,
        layout: "layouts/main-layouts",
        booking,
        alert,
      });
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/admin/booking");
    }
  },

  // Accept Booking
  acceptBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = "accepted";
      await booking.save();
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Booking Accepted!");
      res.redirect("/admin/booking");
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/admin/booking");
    }
  },

  // Rejected Booking
  rejectBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = "rejected";
      await booking.save();
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Booking rejected!");
      res.redirect("/admin/booking");
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/admin/booking");
    }
  },
};
