const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const app = require("../app");
const fs = require("fs");

chai.use(chaiHttp);

describe("API ENDPOINT TESTING", () => {
  it("GET Landing Page", (done) => {
    chai
      .request(app)
      .get("/api/v1/member/landing-page")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("hero");
        expect(res.body.hero).to.have.all.keys(
          "travelers",
          "treasures",
          "cities"
        );
        expect(res.body).to.have.property("mostPicked");
        expect(res.body.mostPicked).to.have.an("array");
        expect(res.body).to.have.property("category");
        expect(res.body.category).to.have.an("array");
        expect(res.body).to.have.property("testimonial");
        expect(res.body.testimonial).to.have.an("object");
        done();
      });
  });

  it("GET Detail Page", (done) => {
    chai
      .request(app)
      .get("/api/v1/member/detail-page/622f2b3d48b25a4824db24ff")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.an("object");
        expect(res.body).to.have.property("_id");
        expect(res.body).to.have.property("title");
        expect(res.body).to.have.property("price");
        expect(res.body).to.have.property("country");
        expect(res.body).to.have.property("city");
        expect(res.body).to.have.property("isPopular");
        expect(res.body).to.have.property("description");
        expect(res.body).to.have.property("unit");
        expect(res.body).to.have.property("sumBooking");
        expect(res.body).to.have.property("categoryId");
        expect(res.body).to.have.property("__v");
        expect(res.body).to.have.property("featureId");
        expect(res.body.featureId).to.have.an("array");
        expect(res.body).to.have.property("activityId");
        expect(res.body.activityId).to.have.an("array");
        expect(res.body).to.have.property("imageId");
        expect(res.body.imageId).to.have.an("array");
        expect(res.body).to.have.property("bank");
        expect(res.body.bank).to.have.an("array");
        expect(res.body).to.have.property("testimonial");
        expect(res.body.testimonial).to.have.an("object");
        done();
      });
  });

  it("POST Booking Page", (done) => {
    const image = __dirname + "/buktitf.jpg";
    const dataSample = {
      image,
      itemId: "62288f883714aaf4079daaf0",
      duration: 2,
      bookingDateStart: "2022-03-16",
      bookingDateEnd: "2022-03-18",
      firstName: "Yayak Yogi",
      lastName: "Ginantaka",
      email: "yayaktaka@gmail.com",
      phoneNumber: "0823344556678",
      accountHolder: "Ginantaka",
      bankFrom: "BCA",
    };
    chai
      .request(app)
      .post("/api/v1/member/booking-page")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .field("itemId", dataSample.itemId)
      .field("duration", dataSample.duration)
      .field("bookingDateStart", dataSample.bookingDateStart)
      .field("bookingDateEnd", dataSample.bookingDateEnd)
      .field("firstName", dataSample.firstName)
      .field("lastName", dataSample.lastName)
      .field("email", dataSample.email)
      .field("phoneNumber", dataSample.phoneNumber)
      .field("accountHolder", dataSample.accountHolder)
      .field("bankFrom", dataSample.bankFrom)
      .attach("image", fs.readFileSync(dataSample.image), "buktitf.jpg")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Success booking");
        expect(res.body).to.have.property("booking");
        expect(res.body.booking).to.have.all.keys(
          "bookingStartDate",
          "bookingEndDate",
          "invoice",
          "itemId",
          "total",
          "memberId",
          "payments",
          "__v",
          "_id"
        );
        expect(res.body.booking.itemId).to.have.all.keys(
          "_id",
          "title",
          "price",
          "duration"
        );
        expect(res.body.booking.payments).to.have.all.keys(
          "proofPayment",
          "bankFrom",
          "accountHolder",
          "status"
        );
        done();
      });
  });
});
