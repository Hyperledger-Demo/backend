/* ------------------ IMPORTS ------------------*/
// core
const express = require("express");
const { v4: uuidv4 } = require("uuid");

// gateway
const { printConfig } = require("../gateway/gateway");
/* ------------------ CONFIG ------------------*/
const router = express.Router();

router.post("/create", (req, res, next) => {
  // Create the DID
  const DID = {
    org: "org1",
    methodID: uuidv4(),
  };

  // printConfig(); //! Only for testing purposes

  // Store the newly created DID on the blockchain
  // Blockchain will contain: key-value pair of DID and DID document

  // Send the newly created DID to the client
  res.status(200).send(`did:hlf:${DID.org}_${DID.methodID}`);
  next();
});

module.exports = router;
