/* Import libraries */
var EC = require('elliptic').ec;
const rlp = require('rlp');
const keccak = require('keccakjs')
var crypto = require('crypto');

/* Helpers */
const txFields = [{
  name: 'nonce',
  default: new Buffer([])
}, {
  name: 'gasPrice',
  default: new Buffer([])
}, {
  name: 'gasLimit',
  default: new Buffer([])
}, {
  name: 'to',
  default: new Buffer([])
}, {
  name: 'value',
  default: new Buffer([])
}, {
  name: 'data',
  default: new Buffer([])
}, {
  name: 'v',
  default: new Buffer([0x1c])
}, {
  name: 'r',
  default: new Buffer([])
}, {
  name: 's',
  length: 32,
  default: new Buffer([])
}]

const V_INDEX = 6;
const R_INDEX = 7;
const S_INDEX = 8;

function safeBufferize(param) {
  if (param.length % 2 == 1) {
    param = '0' + param;
  }
  return Buffer.from(param, 'hex');
}

function serialize(raw) {
  return rlp.encode(raw).toString('hex');
}
