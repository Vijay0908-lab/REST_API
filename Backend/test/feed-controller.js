require("dotenv").config();
const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../model/user");
const FeedController = require("../controllers/feed");

describe("Feed Controller", function () {
  this.timeout(10000);
  before(async function () {
    try {
      mongoose.connect(process.env.MONGO_URL_TEST);
      await User.deleteMany({});

      const user = new User({
        email: "test@test.com",
        password: "tester",
        name: "Test",
        posts: [],
        _id: "5c0f66b979af55031b34728a",
      });
      await user.save();
    } catch (err) {
      console.log("Before Hook Error: Check your MongoDB URL");
      throw err;
    }
  });

  afterEach(function () {
    sinon.restore();
  });

  it("should add a created post to the posts of the creator", async function () {
    sinon.stub(User, "findOne").throws();

    const req = {
      body: {
        title: "Test Post",
        content: "A Test Post",
      },
      file: {
        path: "abc",
      },
      userId: "5c0f66b979af55031b34728a",
    };
    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    FeedController.createPost(req, res, () => {}).then((savedUser) => {
      expect(savedUser).to.have.property("posts");
      expect(savedUser.posts).to.have.length(1);
      done();
    });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
