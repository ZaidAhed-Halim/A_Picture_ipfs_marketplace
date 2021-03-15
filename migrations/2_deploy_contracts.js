const Picture = artifacts.require("Picture");

module.exports = function(deployer) {
  deployer.deploy(Picture);
};
