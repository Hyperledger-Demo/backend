/* ------------------ IMPORTS ------------------*/
// core
const express = require("express");

// gateway
const { printConfig, startGateway } = require("../gateway/gateway");
/* ------------------ CONFIG ------------------*/
const router = express.Router();

router.post("/create", async (req, res, next) => {
  // printConfig(); //! Only for testing purposes
  // Store the newly created DID on the blockchain
  // Blockchain will contain: key-value pair of DID and DID document
  try {
    await startGateway();
  } catch (error) {
    console.log(error);
  }

  // Send the newly created DID to the client
  res.status(200).send({ message: "did:hlf:smthsmth" });
  next();
});

module.exports = router;
