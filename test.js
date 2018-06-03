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

console.log("Running the tests..");
console.log();
console.log();

testprivateToPublic();
testpublicToAddress();
testgetFields();
