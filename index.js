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
function publicToAddress(pubKey) {
  pubKey = safeBufferize(pubKey)

  if (pubKey.length !== 64) {
    throw new Error("Public key length should be 64 bytes");
  }
  // Lower 20 bytes of the hash
  var keccakHash = new keccak(256);
  keccakHash.update(pubKey);
  return keccakHash.digest('hex').slice(-40);
}

function privateToPublic(privateKey) {
  /* Remove 0x prefix if possible */
  if (privateKey[1] == 'x') {
    privateKey = privateKey.substr(2);
  }

  privateKey = safeBufferize(privateKey);

  if (privateKey.length !== 32) {
    throw new Error("Private key length should be 32 bytes");
  }

  var ec = new EC('secp256k1');
  var key = ec.keyFromPrivate(privateKey, 'hex');
  return key.getPublic().encode('hex').substr(2);
}


/* Exports */
/* No support for ICAP Direct yet */
module.exports.getnewaddress = function () {
  var privateKey = crypto.randomBytes(32);
  var publicKey = privateToPublic(privateKey);
  var address = publicToAddress(publicKey);
  return {
    'privateKey': privateKey,
    'publicKey': publicKey,
    'address': address
  }
}

module.exports.privateToPublic = privateToPublic;

module.exports.publicToAddress = publicToAddress;

module.exports.getFields = function () {
  return [ 'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'data', 'v', 'r', 's' ];
}

/* txParamChainId can get overriden if v value of the txParams is set, read EIP 155 */
module.exports.createrawtransaction = function (txParams, txParamChainId) {
  raw = [];
  for (var i = 0; i < txFields.length; i++) {
    var key = txFields[i].name;
    if (txParams[key] === undefined) {
      raw.push(txFields[i].default);
    } else {
      raw.push(safeBufferize(txParams[key].substr(2)));
    }
  }

  var sigV = parseInt('0x' + raw[V_INDEX].toString('hex'), 'hex')
  var _chainId = Math.floor((sigV - 35) / 2);

  if (_chainId < 0) {
    if (txParamChainId !== undefined) {
      _chainId = txParamChainId;
    } else {
      _chainId = 0;
    }
  }
  var chainId = _chainId || txParams.chainId;

  return {
    'rawtransaction': serialize(raw),
    'chainId': chainId
  };

}

module.exports.decoderawtransaction = function (tx) {
  var raw = rlp.decode(safeBufferize(tx));
  var txParams = {};
  for (var i = 0; i < txFields.length; i++) {
    txParams[txFields[i].name] = raw[i].toString('hex');
  }
  return txParams;
}

