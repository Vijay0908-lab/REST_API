const expect = require("chai").expect;
const sinon = require("sinon");

const User = require("../model/user");

const AuthController = require("../controllers/auth");

describe("Auth Controller -login", function (done) {
  it("Should throw an error with code 500 if accessing the database fails", function () {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "tester",
      },
    };
    // req -> passing for login method
    // {} -> passing for reponse
    // ()=>{} -> passing for next method
    AuthController.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("err");
      expect(result).to.have.property("statusCode", 500);
      done();
    });

    User.findOne.restore();
  });
});
