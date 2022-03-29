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
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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
  const date = new Date();
  if (!req.session.isValid) {
    return res.render("login");
  }
  console.log("TRANSACTION", req.body);
  console.log("TRANSACTION", req.body.name);
  const transaction = {
    id: transactions.length + 1,
    name: req.body.name,
    href: req.body.href ?? "#",
    amount: req.body.amount,
    currency: req.body.currency ?? "USD",
    status: req.body.status ?? "success",
    date: date.toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    datetime: new Date().toLocaleDateString("se-SV"),
    type: req.body.type ?? "withdrawal",
  };
  transactions.push(transaction);
  db.write();
  // res.sendStatus(200);
  res.render("index");
});

app.post("/login", function (req, res) {
  req.session.isValid = true;
  req.session.username = "Johan Lindgren";
  req.session.email = "johan@lindgr3n.com";

  res.redirect("/");
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

app.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("login");
});

// error handler
app.use(function (err, req, res, next) {
  if (err.code !== "EBADCSRFTOKEN") return next(err);

  // handle CSRF token errors here
  res.status(403);
  res.render("csrf_error");
});

app.listen(port, () =>
  console.log(`The server is listening at http://localhost:${port}`)
);
