const Item = require("../../models/Item");
const Category = require("../../models/Category");
const Image = require("../../models/Image");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  // Item
  viewItem: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };

    const items = await Item.find()
      .populate({ path: "imageId", select: "id imageUrl" })
      .populate({ path: "categoryId", select: "id name" });

    res.render("admin/item/view_item", {
      title: "Halaman item",
      layout: "layouts/main-layouts",
      items,
      alert,
      user: req.session.user,
    });
  },

  // View Add Item
  viewAddItem: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    const category = await Category.find();
    res.render("admin/item/add_item", {
      title: "Halaman tambah item",
      layout: "layouts/main-layouts",
      category,
      user: req.session.user,
      alert,
    });
  },

  // Add Item
  addItem: async (req, res) => {
    try {
      // destructuring data dari form
      const { title, price, city, categoryId, description } = req.body;
      // cek jumlah file gambar
      if (req.files.length > 0) {
        // panggil collections category berdasarkan categoryId
        const category = await Category.findOne({ _id: categoryId });
        // buat data item baru
        const newItem = {
          title,
          price,
          city,
          description,
          categoryId,
        };
        // simpan data item baru
        const item = await Item.create(newItem);
        // tambah itemId ke collections Category
        category.itemId.push({ _id: item._id });
        // simpan itemId di collections Category
        await category.save();
        // proses simpan image
        for (let i = 0; i < req.files.length; i++) {
          // simpan file gambar ke collections Image
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          // simpan _id gambar pada key imageId di collections Item
          item.imageId.push({ _id: imageSave._id });
          // update collections item
          await item.save();
        }
        req.flash("alertStatus", "success");
        req.flash("alertMessage", "Data item berhasil disimpan");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/admin/item");
    }
  },

  // Show Image Item
  viewImageItem: async (req, res) => {
    try {
      const item = await Item.findOne({
        _id: req.params._id,
      }).populate({ path: "imageId", select: "id imageUrl" });

      const imageItems = item.imageId;

      res.render("admin/item/show_image_item", {
        title: "Staycation | Show Image Item",
        layout: "layouts/main-layouts",
        imageItems,
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/admin/item");
    }
  },

  // View Edit Item
  viewEditItem: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      const item = await Item.findOne({
        _id: req.params._id,
      })
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });

      const categories = await Category.find();
      res.render("admin/item/edit_item", {
        title: "Staycation | Edit Item",
        layout: "layouts/main-layouts",
        item,
        categories,
        user: req.session.user,
        alert,
      });
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/admin/item");
    }
  },

  // Update Item
  updateItem: async (req, res) => {
    const { _id, title, price, city, categoryId, description } = req.body;

    try {
      const item = await Item.findOne({
        _id: _id,
      })
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });
      if (req.files.length > 0) {
        for (let i = 0; i < item.imageId.length; i++) {
          // cari _id image dari Collection Image berdasarkan imageId di Collections Item
          const updateImage = await Image.findOne({ _id: item.imageId[i]._id });
          // hapus gambar sebelumnya dari folder
          await fs.unlink(path.join(`public/${updateImage.imageUrl}`));
          // update data image baru
          updateImage.imageUrl = `images/${req.files[i].filename}`;
          // simpan ke database
          await updateImage.save();
        }
        await Item.updateOne(
          {
            _id: _id,
          },
          {
            $set: {
              title,
              price,
              city,
              categoryId,
              description,
            },
          }
        );
        req.flash("alertStatus", "success");
        req.flash("alertMessage", "Data item berhasil diupdate");
        res.redirect("/admin/item");
      } else {
        await Item.updateOne(
          {
            _id: _id,
          },
          {
            $set: {
              title,
              price,
              city,
              categoryId,
              description,
            },
          }
        );
        req.flash("alertStatus", "success");
        req.flash("alertMessage", "Data item berhasil diupdate");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/admin/item");
    }
  },

  // Delete Item
  deleteItem: async (req, res) => {
    try {
      // ambil data tem berdasarkan id
      const item = await Item.findOne({ _id: req.body._id });
      // hapus image
      for (let i = 0; i < item.imageId.length; i++) {
        // cari image di collectons image berdasarkan imageId
        Image.findOne({ _id: item.imageId[i]._id }).then((image) => {
          // hapus image dari folder public
          fs.unlink(path.join(`public/${image.imageUrl}`));
          // hapus data image dari collections Image
          image.remove();
        });
      }
      // hapus data item dari collections item
      await Item.deleteOne({ _id: req.body._id });
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Data item berhasil dihapus");
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("alertStatus", "error");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/admin/item");
    }
  },
};
