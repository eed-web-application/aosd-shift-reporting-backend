const { server } = require("../src/index"); // Adjust the path as necessary
const request = require("supertest");

describe("index.js", function () {
  after(function () {
    server.close(); // Close the server after tests
  });

  it("Test echo root path", function (done) {
    request(server).get("/").expect(200, done);
  });
});
