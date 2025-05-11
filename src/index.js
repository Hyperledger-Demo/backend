/* ------------------- IMPORTS ------------------- */
const bodyParser = require("body-parser");
const cors = require('cors');

/* ------------------- CONFIG ------------------- */
const app = require("express")();
const port = 3000;

/* ------------------- CORE ------------------- */
app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(cors())

app.get("/", (req, res) => {
    res.send("Sa va dau la muie!");
})

app.post("/register", (req, res) => {
    email = req.body.email;
    console.log(`The email received is ${email}`)
    res.status(200).send("Received the data")
})

app.listen(port, () => {
    console.log(`Demo for app with hyperledger fabric listening to port ${port}`)
})