/* ------------------- IMPORTS ------------------- */
// core
const bodyParser = require("body-parser");
const cors = require("cors");

// routes
const didRouter = require("./routes/did");
/* ------------------- CONFIG ------------------- */
const app = require("express")();
const port = 3000;

/* ------------------- CORE ------------------- */
// register plugins
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(cors());

app.get("/", (req, res) => {
  res.send("Sa va dau la muie!");
});

// register routes
app.use("/did", didRouter);

// start server
app.listen(port, () => {
  console.log(`Demo for app with hyperledger fabric listening to port ${port}`);
});
