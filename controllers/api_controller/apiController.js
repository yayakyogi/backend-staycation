const Item = require("../../models/Item");
const Treasure = require("../../models/Activity");
const Traveler = require("../../models/Booking");
const Category = require("../../models/Category");
const Bank = require("../../models/Bank");
const Member = require("../../models/Member");
const Booking = require("../../models/Booking");
const createError = require("http-errors");
const mongoose = require("mongoose");
const formatDate = require("../../utils/formatDate");

module.exports = {
  // end point landing page
  landingPage: async (req, res) => {
    try {
      const [mostPicked, treasure, traveler, city, category] =
        await Promise.all([
          Item.find()
            .select("_id title country city price unit imageId")
            .limit(5)
            .populate({ path: "imageId", select: "_id imageUrl" }),
          Treasure.find(),
          Traveler.find(),
          Item.find(),
          Category.find()
            .select("_id name itemId")
            .populate({
              path: "itemId",
              select: "_id title imageId country city isPopular",
              perDocumentLimit: 4,
              option: { sort: { sumBooking: -1 } }, // sorting descending
              populate: {
                path: "imageId",
                select: "_id imageUrl",
                perDocumentLimit: 1,
              },
            }),
        ]);

      // ubah is popular jika data itemId ke 0 === itemId looping index ke 0
      // data Category.itemId di sorting dari yang terbesar
      for (let i = 0; i < category.length; i++) {
        for (let x = 0; x < category[i].itemId.length; x++) {
          const item = await Item.findOne({ _id: category[i].itemId[x]._id });
          item.isPopular = false;
          await item.save();
          if (category[i].itemId[0] === category[i].itemId[x]) {
            item.isPopular = true;
            await item.save();
          }
        }
      }

      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "images/img-testimonial-1.png",
        name: "Happy Family",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer",
      };

      res.status(200).json({
        hero: {
          travelers: traveler.length,
          treasures: treasure.length,
          cities: city.length,
        },
        mostPicked,
        category,
        testimonial,
      });
    } catch (error) {
      req.status(500).json({ message: `${error.message}` });
    }
  },

  // end point detail page
  detailPage: async (req, res, next) => {
    try {
      const { id } = req.params;
      const [item, bank] = await Promise.all([
        // Get data Item
        Item.findOne({ _id: id })
          .populate({ path: "featureId", select: "_id name qty imageUrl" })
          .populate({ path: "activityId", select: "_id name type imageUrl" })
          .populate({ path: "imageId", select: "_id imageUrl" }),
        // Get data Bank
        Bank.find(),
      ]);

      if (!item) {
        throw createError(404, "Item not found!");
      }

      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "images/img-testimonial-1.png",
        name: "Happy Family",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer",
      };

      res.status(200).json({
        ...item._doc,
        bank,
        testimonial,
      });
    } catch (error) {
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid Product id"));
        return;
      }
      next(error);
    }
  },

  // end point booking
  bookingPage: async (req, res, next) => {
    try {
      const {
        itemId,
        duration,
        bookingDateStart,
        bookingDateEnd,
        firstName,
        lastName,
        email,
        phoneNumber,
        accountHolder,
        bankFrom,
      } = req.body;

      if (!req.file) {
        throw createError(404, "Image not found!");
      }

      // ambil item berdasarkan itemId
      const item = await Item.findOne({ _id: itemId });

      if (!item) {
        throw createError(404, "Item not found!");
      }
      // update sumBooking
      item.sumBooking += 1;
      // update item sumBooking
      await item.save();
      // hitung total
      let total = item.price * duration;
      // hitung pajak 10%
      let tax = total * 0.1;
      // buat angka acak untuk invoice
      const invoice = Math.floor(1000000 + Math.random() * 9000000);

      // simpan data member baru
      const member = await Member.create({
        firstName,
        lastName,
        email,
        phoneNumber,
      });

      // variabel data booking baru
      const newBooking = {
        bookingStartDate: formatDate(bookingDateStart),
        bookingEndDate: formatDate(bookingDateEnd),
        invoice,
        itemId: {
          _id: item._id,
          title: item.title,
          price: item.price,
          duration,
        },
        total: (total += tax),
        memberId: member._id,
        payments: {
          proofPayment: `images/${req.file.filename}`,
          bankFrom,
          accountHolder,
        },
      };

      // simpan ke database
      const booking = await Booking.create(newBooking);

      res.status(200).json({ message: "Success booking", booking });
    } catch (error) {
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid Item id"));
        return;
      } else if (error.name === "ValidationError") {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },
};
