const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../model/user");
const AuthController = require("../controllers/auth");

describe("Auth Controller", function () {
  // 10 second ka timeout taaki DB connect hone ka time mile
  this.timeout(10000);

  // 1. Setup: Connection and Data Creation
  before(async function () {
    try {
      await mongoose.connect(process.env.MONGO_URL_TEST);

      // Cleanup existing test users
      await User.deleteMany({});

      const user = new User({
        email: "test@test.com",
        password: "tester",
        name: "Test",
        status: "I am new!", // Yeh zaroori hai getUserStatus test ke liye
        _id: new mongoose.Types.ObjectId("5c0f66b979af55031b34728a"),
      });
      await user.save();
    } catch (err) {
      console.log("Before Hook Error: Check your MongoDB URL");
      throw err;
    }
  });

  // 2. Cleanup Stubs after each test
  afterEach(function () {
    sinon.restore(); // Saare stubs ko ek saath reset karta hai
  });

  // 3. Test: Database Failure (500 Error)
  it("should throw an error with code 500 if accessing the database fails", async function () {
    // Database call ko fake error throw karwaya
    sinon.stub(User, "findOne").throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "tester",
      },
    };

    // Controller call
    const result = await AuthController.login(req, {}, () => {});

    expect(result).to.be.an("error");
    expect(result).to.have.property("statusCode", 500);
  });

  // 4. Test: Get User Status
  it("should send a response with a valid user status for an existing user", async function () {
    const req = { userId: "5c0f66b979af55031b34728a" };

    // Response object ko mock kiya
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };

    await AuthController.getUserStatus(req, res, () => {});

    expect(res.statusCode).to.be.equal(200);
    expect(res.userStatus).to.be.equal("I am new!");
  });

  // 5. Final Cleanup
  after(async function () {
    await User.deleteMany({});
    await mongoose.disconnect();
  });
});
