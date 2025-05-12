/* ------------------ IMPORTS ------------------*/
// core
const express = require("express");
const { v4: uuidv4 } = require("uuid");

// gateway
const { printConfig, startGateway } = require("../gateway/gateway");
/* ------------------ CONFIG ------------------*/
const router = express.Router();

router.post("/create", (req, res, next) => {
  // Create the DID
  const DIDProps = {
    org: "org1",
    methodID: uuidv4(),
  };

  // printConfig(); //! Only for testing purposes
  const DID = `did:hlf:${DIDProps.org}_${DIDIDPropsD.methodID}`;

  // Store the newly created DID on the blockchain
  // Blockchain will contain: key-value pair of DID and DID document
  startGateway(DID, {});

  // Send the newly created DID to the client
  res.status(200).send(DID);
  next();
});

module.exports = router;
