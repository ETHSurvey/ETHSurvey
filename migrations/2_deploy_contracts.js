var Survey = artifacts.require('./Survey.sol')

module.exports = function (deployer) {
  deployer.deploy(Survey)
}
