const ethtx = require('./index.js');
var assert = require('assert');

function testprivateToPublic() {
  const privKey1 = '0x17d08f5fe8c77af811caa0c9a187e668ce3b74a99acc3f6d976f075fa8e0be55';
  const privKey2 = '17d08f5fe8c77af811caa0c9a187e668ce3b74a99acc3f6d976f075fa8e0be55';
  const pubKey = '689268c0ff57a20cd299fa60d3fb374862aff565b20b5f1767906a99e6e09f3ff04ca2b2a5cd22f62941db103c0356df1a8ed20ce322cab2483db67685afd124';
  assert.equal(ethtx.privateToPublic(privKey1), pubKey, "testprivateToPublic failed!");
  assert.equal(ethtx.privateToPublic(privKey2), pubKey, "testprivateToPublic failed!");
  console.log("testprivateToPublic passed!");
}

function testpublicToAddress() {
  const pubKey = '689268c0ff57a20cd299fa60d3fb374862aff565b20b5f1767906a99e6e09f3ff04ca2b2a5cd22f62941db103c0356df1a8ed20ce322cab2483db67685afd124';
  const address = '26d1ec50b4e62c1d1a40d16e7cacc6a6580757d5';
  assert.equal(ethtx.publicToAddress(pubKey), address, "testpublicToAddress failed!");
  console.log("testpublicToAddress passed!");
}

function testgetFields() {
  const fields = [ 'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'data', 'v', 'r', 's' ];
  assert.equal(ethtx.getFields().toString(), fields.toString(), "testgetFields failed!");
  console.log("testgetFields passed!");
}

function testcreaterawtransaction() {
  const txParams = {
    nonce: '0x4',
    gasPrice: '0x4a817c800',
    gasLimit: '0xdbba0',
    to: '0xd6e4caea206c9e58187cf129eeaa61b600b483bc',
    value: '0x4000',
    data: '0x25d74b7f000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000620a4465706f736974656432149d8a62f656a8d1615c1294fd71e9cfb3e4855a4f200000000000000000000000000000000000000000000000000000000000000005200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000',
    // EIP 155 chainId - mainnet: 1, ropsten: 3
    chainId: 1
  };
  const tx = 'f8ec048504a817c800830dbba094d6e4caea206c9e58187cf129eeaa61b600b483bc824000b8c425d74b7f000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000620a4465706f736974656432149d8a62f656a8d1615c1294fd71e9cfb3e4855a4f2000000000000000000000000000000000000000000000000000000000000000052000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000001c8080';
  assert.equal(ethtx.createrawtransaction(txParams).rawtransaction, tx, "testcreaterawtransaction failed!");
  console.log("testcreaterawtransaction passed!");
}

function testdecoderawtransaction() {
  const txParams = {
    nonce: '0x4',
    gasPrice: '0x4a817c800',
    gasLimit: '0xdbba0',
    to: '0xd6e4caea206c9e58187cf129eeaa61b600b483bc',
    value: '0x4000',
    data: '0x25d74b7f000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000620a4465706f736974656432149d8a62f656a8d1615c1294fd71e9cfb3e4855a4f200000000000000000000000000000000000000000000000000000000000000005200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000',
    v: '0x1c',
    r: '',
    s: ''
  };
  const tx = 'f8ec048504a817c800830dbba094d6e4caea206c9e58187cf129eeaa61b600b483bc824000b8c425d74b7f000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000620a4465706f736974656432149d8a62f656a8d1615c1294fd71e9cfb3e4855a4f2000000000000000000000000000000000000000000000000000000000000000052000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000001c8080';
  const txFields = ethtx.getFields();
  var decodedtx = ethtx.decoderawtransaction(tx);
  for (var i = 0; i < txFields.length; i++) {
    var field1 = decodedtx[txFields[i]];
    var field2 = txParams[txFields[i]];
    if (field2[1] == 'x') {
      field2 = field2.substr(2);
    }
    if (field2.length % 2 == 1) {
      field2 = '0' + field2;
    }
    if(field1 != field2) {
      assert(false, "testdecoderawtransaction failed!");
    }
  }
  console.log("testdecoderawtransaction passed!");
}


console.log("Running the tests..");
console.log();
console.log();

testprivateToPublic();
testpublicToAddress();
testgetFields();
testcreaterawtransaction();
testdecoderawtransaction();
