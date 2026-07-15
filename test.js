const session = require("express-session");
const MongoStore = require("connect-mongo");

const store = MongoStore.create({
  mongoUrl: "mongodb://127.0.0.1:27017/testdb"
});

console.log("Store created:", store);
