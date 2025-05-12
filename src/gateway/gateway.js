/**
 * This modele is used to create a gateway to the fabric network.
 * This module was mostly taken from the hyperledger gabric gateway example in the fabric-samples/asset-transfer-basic/javascript
 * reportory.
 */

/* ------------------ IMPORTS ------------------*/
// core
const crypto = require("crypto"); // Crypto is used to generate cryptographic keys
const path = require("path"); // Path is used to resolve the path to the organization's connection profile
const fs = require("fs/promises"); // File system is used to read the connection profile
const { TextDecoder } = require("util"); // TextDecoder is used to decode the byte array from the blockchain => we get bytes from the blockchain
const { v4: uuidv4 } = require("uuid");

// external
const grpc = require("@grpc/grpc-js"); // gRPC is used for communication between the gateway and the fabric network
const { connect, hash, signers } = require("@hyperledger/fabric-gateway"); // Fabric Gateway SDK is used to interact with the fabric network

// utility
const {
  envOrDefault,
  keyDirectoryPath,
  certDirectoryPath,
  tlsCertPath,
} = require("../utility/gatewayUtilities");

/* ------------------ CONFIG ------------------*/
const channelName = envOrDefault("CHANNEL_NAME", "mychannel"); // The channel name is used to connect to the fabric network
const chaincodeName = envOrDefault("CHAINCODE_NAME", "basic"); // The chaincode name is used to interact with the fabric network
const mspId = envOrDefault("MSP_ID", "Org1MSP");

// Gateway peer endpoint.
const peerEndpoint = envOrDefault("PEER_ENDPOINT", "localhost:7051");

// Gateway peer SSL host name override.
const peerHostAlias = envOrDefault("PEER_HOST_ALIAS", "peer0.org1.example.com");

const utf8Decoder = new TextDecoder();
let gateway = null;
let network = null;
let contract = null;

/* --------------------------------------- GATEWAY  ---------------------------------------*/
// Initialize the gateway that will be used to connect to the fabric network
async function startGateway() {
  const client = await newGRPCConnection(); // Create a new gRPC connection

  gateway = connect({
    client,
    identity: await newIdentity(), // Create a new identity
    signer: await newSigner(), // Create a new signer
    hash: hash.sha256,
    // Default timeouts for different gRPC calls
    evaluateOptions: () => {
      return { deadline: Date.now() + 5000 }; // 5 seconds
    },
    endorseOptions: () => {
      return { deadline: Date.now() + 15000 }; // 15 seconds
    },
    submitOptions: () => {
      return { deadline: Date.now() + 5000 }; // 5 seconds
    },
    commitStatusOptions: () => {
      return { deadline: Date.now() + 60000 }; // 1 minute
    },
  });

  //! TESTING PURPOSES
  try {
    // Create the network
    network = gateway.getNetwork(channelName); // Get the network from the gateway

    // Retrieve the contract from the network
    contract = network.getContract(chaincodeName); // Get the contract from the network

    // Create the DID on the blockchain
    // const rawBytes = await storeDID(contract);
    // console.log(JSON.parse(JSON.parse(utf8Decoder.decode(rawBytes)))); // Log the transaction

    // Retrieve the DID from the blockchain
    // await getDID(contract, DID);
  } catch (error) {
    console.error("Error starting gateway:", error); // Log the error
  }
}

// Initialize the client
async function newGRPCConnection() {
  const tlsRootCert = await fs.readFile(tlsCertPath); // Read the TLS certificate
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert); // Create the TLS credentials

  return new grpc.Client(peerEndpoint, tlsCredentials, {
    "grpc.ssl_target_name_override": peerHostAlias,
  });
}

// Create a new identity
async function newIdentity() {
  const certPath = await getFirstDirFileName(certDirectoryPath);
  const credentials = await fs.readFile(certPath);
  return { mspId, credentials };
}

// Read the first file in the directory
async function getFirstDirFileName(dirPath) {
  const files = await fs.readdir(dirPath);
  const file = files[0];
  if (!file) {
    throw new Error(`No files in directory: ${dirPath}`);
  }
  return path.join(dirPath, file);
}

// Create a new signer
async function newSigner() {
  const keyPath = await getFirstDirFileName(keyDirectoryPath);
  const privateKeyPem = await fs.readFile(keyPath);
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  return signers.newPrivateKeySigner(privateKey);
}

/* --------------------------------------- INVOKE CONTRACTS  ---------------------------------------*/
// Create a new DID
async function storeDID(contract) {
  // Create the DID
  const DIDProps = {
    org: "org1",
    methodID: uuidv4(),
  };

  const DID = `did:hlf:${DIDProps.org}_${DIDProps.methodID}`;

  const res = await contract.submitTransaction(
    "storeDID",
    DID,
    JSON.stringify(DIDProps)
  ); // Submit the transaction to the contract

  return res;
}

// Retrieve a document by DID
async function getDID(contract) {
  // Get the byte stream from the blockchain
  const resultBytes = await contract.evaluateTransaction("getDIDDocument", DID); // Evaluate the transaction to get the DID document

  const resultJSON = utf8Decoder.decode(resultBytes); // Decode the byte stream to a string
  const result = JSON.parse(resultJSON); // Parse the string to a JSON object
  console.log(`DID ${DID} retrieved successfully! - the document is ${result}`); // Log the transaction
}

/* --------------------------------------- TESTING METHODS  ---------------------------------------*/
//! Only for testing purposes
function printConfig() {
  console.log("keyDirectoryPath:", keyDirectoryPath);
  console.log("certDirectoryPath:", certDirectoryPath);
  console.log("tlsCertPath:", tlsCertPath);
  console.log("channelName:", channelName);
  console.log("chaincodeName:", chaincodeName);
  console.log("mspId:", mspId);
  console.log("peerEndpoint:", peerEndpoint);
  console.log("peerHostAlias:", peerHostAlias);
}

function getGateway() {
  return gateway;
}

function getContract() {
  return contract;
}

module.exports = {
  printConfig,
  startGateway,
  getGateway,
  storeDID,
  getContract,
};
