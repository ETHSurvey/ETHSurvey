/*global contract, config, it, assert*/
const Survey = require('Embark/contracts/Survey');

config({
  contracts: {
    "Survey": {
      args: [100]
    }
  }
});

contract("Survey", function () {
  this.timeout(0);

  it("should set constructor value", async function () {
    let result = await Survey.methods.storedData().call();
    assert.strictEqual(parseInt(result, 10), 100);
  });

  it("set storage value", async function () {
    await Survey.methods.set(150).send();
    let result = await Survey.methods.get().call();
    assert.strictEqual(parseInt(result, 10), 150);
  });
});
