const Feature = require("../../models/Feature");
const Item = require("../../models/Item");
const Activity = require("../../models/Activity");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  // View Detail Item(Activity)
  viewActivity: async (req, res) => {
    const { itemId } = req.params;
    try {
      const item = await Item.findOne({ _id: itemId });
      const features = await Feature.find({ itemId: itemId });
      const activities = await Activity.find({ itemId: itemId });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/detail_item/view_activity", {
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
      res.redirect(`/admin/item/detail-item/${itemId}`);
    }
  },

  // Add Activity
  addActivity: async (req, res) => {
    const { name, type, itemId } = req.body;
    try {
      // simpan data feature
      const activity = await Activity.create({
        name,
        type,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });
      // ambil data item berdasarkan itemId
      const item = await Item.findOne({ _id: itemId });
      // push data ke activityId di collections item
      item.activityId.push({ _id: activity._id });
      // simpan dan update ke database
      await item.save();
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Sukses menambah activity");
      res.redirect(`/admin/item/activity/${itemId}`);
    } catch (error) {
      req.flash("alertStatus", "error");
      if (req.file == undefined) {
        req.flash("alertMessage", "Image tidak bolehh kosong");
      } else {
        req.flash("alertMessage", `${error.message}`);
      }
      res.redirect(`/admin/item/activity/${itemId}`);
    }
  },

  // View Edit Activity
  viewEditActivity: async (req, res) => {
    const { activityId } = req.params;
    const activity = await Activity.findOne({ _id: activityId });
    res.render("admin/item/detail_item/edit_activity", {
      title: "Staycation | Edit Item",
      layout: "layouts/main-layouts",
      activity,
      user: req.session.user,
    });
  },

  // Update Activity
  updateActivity: async (req, res) => {
    const { _id, itemId, name, type } = req.body;
    try {
      const activity = await Activity.findOne({ _id: _id });
      if (req.file == undefined) {
        activity.name = name;
        activity.type = type;
        await activity.save();
        req.flash("alertStatus", "success");
        req.flash("alertMessage", "Sukses mengubah activity");
        res.redirect(`/admin/item/activity/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${activity.imageUrl}`));
        activity.name = name;
        activity.type = type;
        activity.imageUrl = `images/${req.file.filename}`;
        await activity.save();
        req.flash("alertStatus", "success");
        req.flash("alertMessage", "Sukses mengubah activity");
        res.redirect(`/admin/item/activity/${itemId}`);
      }
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect(`/admin/item/activity/${itemId}`);
    }
  },

  // Delete Activity
  deleteActivity: async (req, res) => {
    // destructuring data _id dan itemId
    const { _id, itemId } = req.body;
    try {
      // ambil data activity berdasarkan _id
      const activity = await Activity.findOne({ _id: _id });
      // tampilkan activityId di collections item
      const item = await Item.findOne({ _id: itemId }).populate("activityId");
      for (let i = 0; i < item.activityId.length; i++) {
        // jika activityId === _id pada collections activity
        if (item.activityId[i]._id.toString() === activity._id.toString()) {
          // hapus data tersebut dari list activityId
          item.activityId.pull({ _id: activity._id });
          // update collections item
          await item.save();
        }
      }
      // hapus file di foldernya
      await fs.unlink(path.join(`public/${activity.imageUrl}`));
      // hapus data activity dari database
      await activity.remove();
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Sukses menghapus activity");
      res.redirect(`/admin/item/activity/${itemId}`);
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect(`/admin/item/activity/${itemId}`);
    }
  },
};
