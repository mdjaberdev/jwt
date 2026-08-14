const mongoose = require("mongoose");

const dbconnection = () => {
  return mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster1.gxwb1gq.mongodb.net/${process.env.DB_COLLECTION_NAME}?appName=Cluster1`,
    )
    .then(() => {
      console.log("Database Connected");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = dbconnection;
