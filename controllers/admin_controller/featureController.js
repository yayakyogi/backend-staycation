const Feature = require("../../models/Feature");
const Item = require("../../models/Item");
const Activity = require("../../models/Activity");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  // View Detail Item(Feature)
  viewFeature: async (req, res) => {
    const { itemId } = req.params;
    try {
      const item = await Item.findOne({ _id: itemId });
      const features = await Feature.find({ itemId: itemId });
      const activities = await Activity.find({ itemId: itemId });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/detail_item/view_feature", {
        title: "Staycation | Detail Item",
        layout: "layouts/main-layouts",
        features,
        activities,
        alert,
        itemId,
        item,
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect(`/admin/item/feature/${itemId}`);
    }
  },

  // Add Feature
  addFeature: async (req, res) => {
    const { name, qty, itemId } = req.body;
    try {
      // simpan data feature
      const feature = await Feature.create({
        name,
        qty,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });
      // ambil data item berdasarkan itemId
      const item = await Item.findOne({ _id: itemId });
      // push data ke featureId di collections item
      item.featureId.push({ _id: feature._id });
      // simpan dan update ke database
      await item.save();
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Sukses menambah feature");
      res.redirect(`/admin/item/feature/${itemId}`);
    } catch (error) {
      req.flash("alertStatus", "error");
      if (req.file == undefined) {
        req.flash("alertMessage", "Image tidak bolehh kosong");
      } else {
        req.flash("alertMessage", `${error.message}`);
      }
      res.redirect(`/admin/item/feature/${itemId}`);
    }
  },

  // View Edit Feature
  viewEditFeature: async (req, res) => {
    const { featureId } = req.params;
    try {
      const feature = await Feature.findOne({ _id: featureId });
      res.render("admin/item/detail_item/edit_feature", {
        title: "Staycation | Edit Item",
        layout: "layouts/main-layouts",
        feature,
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
    }
  },

  // Update feature
  updateFeature: async (req, res) => {
    const { _id, itemId, name, qty } = req.body;
    try {
      const feature = await Feature.findOne({ _id: _id });
      if (req.file == undefined) {
        feature.name = name;
        feature.qty = qty;
        await feature.save();
        req.flash("alertStatus", "success");
        req.flash("alertMessage", "Sukses mengubah feature");
        res.redirect(`/admin/item/feature/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        feature.name = name;
        feature.qty = qty;
        feature.imageUrl = `images/${req.file.filename}`;
        await feature.save();
        req.flash("alertStatus", "success");
        req.flash("alertMessage", "Sukses mengubah feature");
        res.redirect(`/admin/item/feature/${itemId}`);
      }
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect(`/admin/item/feature/${itemId}`);
    }
  },

  // Delete Feature
  deleteFeature: async (req, res) => {
    // destructuring data _id dan itemId
    const { _id, itemId } = req.body;
    try {
      // ambil data feature berdasarkan _id
      const feature = await Feature.findOne({ _id: _id });
      // tampilkan featureId di collections item
      const item = await Item.findOne({ _id: itemId }).populate("featureId");
      for (let i = 0; i < item.featureId.length; i++) {
        // jika featureId === _id pada collections feature
        if (item.featureId[i]._id.toString() === feature._id.toString()) {
          // hapus data tersebut dari list featureId
          item.featureId.pull({ _id: feature._id });
          // update collections item
          await item.save();
        }
      }
      // hapus file di foldernya
      await fs.unlink(path.join(`public/${feature.imageUrl}`));
      // hapus data feature dari database
      await feature.remove();
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Sukses menghapus feature");
      res.redirect(`/admin/item/feature/${itemId}`);
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect(`/admin/item/feature/${itemId}`);
    }
  },
};
