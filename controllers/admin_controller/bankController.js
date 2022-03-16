const Bank = require("../../models/Bank");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  // Bank
  viewBank: async (req, res) => {
    const bank = await Bank.find();
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    res.render("admin/bank/view_bank", {
      title: "Halaman bank",
      layout: "layouts/main-layouts",
      bank,
      alert,
      user: req.session.user,
    });
  },

  // View Add Bank
  viewAddBank: (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    res.render("admin/bank/add_bank", {
      title: "Halaman tambah bank",
      layout: "layouts/main-layouts",
      alert,
      user: req.session.user,
    });
  },

  // Add Bank
  addBank: async (req, res) => {
    try {
      await Bank.insertMany([
        {
          name: req.body.name.toUpperCase(),
          nameBank: req.body.nameBank.toUpperCase(),
          nomorRekening: req.body.nomorRekening,
          imageUrl: `images/${req.file.filename}`,
        },
      ]);
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Sukses menambah Bank");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/admin/bank/add");
    }
  },

  // View Edit Bank
  viewEditBank: async (req, res) => {
    const { _id } = req.params;
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    const bank = await Bank.findOne({
      _id: _id,
    });
    res.render("admin/bank/edit_bank", {
      title: "Halaman edit bank",
      layout: "layouts/main-layouts",
      bank,
      alert,
      user: req.session.user,
    });
  },

  // Update Bank
  updateBank: async (req, res) => {
    const { _id } = req.body;
    try {
      if (req.file == undefined) {
        await Bank.updateOne(
          {
            _id: _id,
          },
          {
            $set: {
              name: req.body.name.toUpperCase(),
              nameBank: req.body.nameBank.toUpperCase(),
              nomorRekening: req.body.nomorRekening,
            },
          }
        );
        req.flash("alertStatus", "success");
        req.flash("alertMessage", "Sukses mengubah Bank");
        res.redirect("/admin/bank");
      } else {
        const bank = await Bank.findOne({ _id: _id });
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        await Bank.updateOne(
          {
            _id: _id,
          },
          {
            $set: {
              name: req.body.name.toUpperCase(),
              nameBank: req.body.nameBank.toUpperCase(),
              nomorRekening: req.body.nomorRekening,
              imageUrl: `images/${req.file.filename}`,
            },
          }
        );
        req.flash("alertStatus", "success");
        req.flash("alertMessage", "Sukses mengubah Bank");
        res.redirect("/admin/bank");
      }
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect(`/admin/bank/edit/${_id}`);
    }
  },

  // Delete Bank
  deleteBank: async (req, res) => {
    const { _id } = req.body;
    try {
      const bank = await Bank.findOne({
        _id: _id,
      });
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.remove();
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Sukses menghapus bank");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect(`/admin/bank/edit/${_id}`);
    }
  },
};
