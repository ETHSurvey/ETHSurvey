var SurveyContract = artifacts.require("./SurveyContract.sol");

module.exports = function(deployer) {
  deployer.deploy(SurveyContract);
};
