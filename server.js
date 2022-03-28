import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import db from "./db.js";

const port = 3000;
const app = express();

let reviews = [];

app.set("views", "./templates");
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(
  session({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
    },
  })
);
app.use(bodyParser.json());

app.get("/", function (req, res) {
  if (req.session.isValid) {
    res.render("index", {
      isValidSession: req.session.isValid,
      username: req.session.username,
      reviews,
    });
  } else {
    res.redirect("login");
  }
});

app.get("/login", function (req, res) {
  res.render("login", {
    isValidSession: req.session.isValid,
    username: req.session.username,
    reviews,
  });
});

app.get("/transactions", function (req, res) {
  const { transactions } = db.data;
  res.json(transactions);
});

app.post("/transactions", function (req, res) {
  const { transactions } = db.data;
  console.log("POSTING", req.body);
  const transaction = {
    id: transactions.length + 1,
    name: req.body.name,
    href: req.body.href,
    amount: req.body.amount,
    currency: req.body.currency,
    status: req.body.status,
    date: req.body.date,
    datetime: req.body.datetime,
    type: req.body.type ?? "withdrawal",
  };
  transactions.push(transaction);
  db.write();
  res.sendStatus(200);
});

app.post("/login", function (req, res) {
  req.session.isValid = true;
  req.session.username = "Johan Lindgren";
  req.session.email = "johan@lindgr3n.com";

  res.redirect("/");
  // res.render("index", {
  //   isValidSession: req.session.isValid,
  //   username: req.session.username,
  // });
  // return res.json({
  //   username: req.session.username,
  //   email: req.session.email,
  // });
});

app.get("/user", function (req, res) {
  if (req.session.isValid) {
    res.json({
      username: req.session.username,
      email: req.session.email,
    });
  } else {
    res.json({});
  }
});

// app.post("/user", function (req, res) {
//   if (req.session.isValid) {
//     req.session.username = req.body.username;
//     req.session.email = req.body.email;
//     res.redirect("/user");
//   } else {
//     res.redirect("/");
//   }
// });

app.listen(port, () =>
  console.log(`The server is listening at http://localhost:${port}`)
);
