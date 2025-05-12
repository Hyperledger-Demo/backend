/* ------------------ IMPORTS ------------------*/
// core
const crypto = require("crypto"); // Crypto is used to generate cryptographic keys
const path = require("path"); // Path is used to resolve the path to the organization's connection profile
const fs = require("fs/promises"); // File system is used to read the connection profile
const { TextDecoder } = require("util"); // TextDecoder is used to decode the byte array from the blockchain => we get bytes from the blockchain

// external
const grpc = require("@grpc/grpc-js"); // gRPC is used for communication between the gateway and the fabric network
const { connect, hash, signers } = require("@hyperledger/fabric-gateway"); // Fabric Gateway SDK is used to interact with the fabric network

// utility
const {
  envOrDefault,
  keyDirectoryPath,
  certDirectoryPath,
} = require("../utility/gatewayUtilities");

/* ------------------ CONFIG ------------------*/
const channelName = envOrDefault("CHANNEL_NAME", "mychannel"); // The channel name is used to connect to the fabric network
const chaincodeName = envOrDefault("CHAINCODE_NAME", "DID"); // The chaincode name is used to interact with the fabric network
const mspId = envOrDefault("MSP_ID", "Org1MSP");

const gateway = null;

async function startGateway() {
  // Initialize the gatway
}
