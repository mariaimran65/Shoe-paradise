const express = require("express");
const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const User = require("./db/users");
const Order = require("./db/orders");
const { graphqlHTTP } = require("express-graphql");

const app = express();
app.use(express.json());
app.use(express.static("build"));
mongoose
  .connect(
    "mongodb+srv://mariaimran787898:Maria123@cluster0.3ztda6b.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("error occurred:", err);
  });

app.delete("/delete-user/:id", async (req, res) => {
  console.log(req.params.id, " yh user ki id hy");
  try {
    let orders = await Order.findByIdAndDelete(req.params.id);
    console.log(req.query.userKiId);
    res.json({
      success: true,
      data: orders,
    });
  } catch (e) {
    // console.log(e.message);
  }
});

app.get("/orders-lao", async (req, res) => {
  let orders = await Order.find();
  res.json(orders);
});
// API ROUTES
app.post("/cart", async (req, res) => {
  let asd = await Order.insertMany(req.body);
  console.log(asd);
  res.json({ success: true });
});

app.post("/create-user", async (req, res) => {
  let data = new User(req.body);
  await data.save();
  res.json({
    success: true,
  });
});

app.get("/users-lao", async (req, res) => {
  let users = await User.find();
  res.json(users);
});

app.delete("/delete-user/:id", async (req, res) => {
  // console.log(req.params.id, " yh user ki id hy");
  try {
    let users = await User.findByIdAndDelete(req.params.id);
    // console.log(req.query.userKiId);
    res.json({
      success: true,
      data: users,
    });
  } catch (e) {
    // console.log(e.message);
  }
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  let userMilgya = await User.findOne({ email: req.body.email });
  if (userMilgya) {
    jsonwebtoken.sign(
      { email: userMilgya.email },
      "cat says meows",
      { expiresIn: "2d" },
      function (err, token) {
        res.json({
          myToken: token,
          userMilgya,
        });
      }
    );
  } else {
    res.json({ success: false });
  }
});
app.post("/check-token", (req, res) => {
  jsonwebtoken.verify(
    req.body.token,
    "cat says meows",
    function (err, decoded) {
      if (err) {
        // Handle verification error
        return res.status(401).json({ message: "Invalid token" });
      }

      User.findOne({ email: decoded.email })
        .then((user) => {
          if (!user) {
            // User not found
            return res.status(404).json({ message: "User not found" });
          }

          // User found, send it as response
          res.json(user);
        })
        .catch((error) => {
          // Handle database error
          console.error("Error finding user:", error);
          res.status(500).json({ message: "Internal server error" });
        });
    }
  );
});
app.listen(6070, function () {
  console.log("code is chaling now");
});
