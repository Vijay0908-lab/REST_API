const expect = require("chai").expect;
const authMiddleware = require("../middleware/is-auth");
const jwt = require("jsonwebtoken");
//never check for the function which is coming from the third party package

describe("Auth middleware", function () {
  it("should throw an error if no authorization header is present", function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not Authenticated.",
    );
  });

  it("should throw error if the authorizaton header has only one string", function () {
    const req = {
      get: function (headerName) {
        return "xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
  it("should throw an error if the token cannot be verified", function () {
    const req = {
      get: function (headerName) {
        return "Bearer xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should yield a userId after decoding the token", function () {
    const req = {
      get: function (headerName) {
        return "Bearer adegtehbfhnyr";
      },
    };
    jwt.verify = function () {
      return { userId: "abc" };
    };
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
  });
});
