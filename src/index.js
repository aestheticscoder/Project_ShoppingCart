const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { PORT, MONGO_URL } = require("../config");
const router = require("./routes/route");
const multer = require("multer");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().any());

mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB is Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Express is running`);
});
