var WaterFriendliness  = artifacts.require("WaterFriendliness");

module.exports = function(deployer) {
    deployer.deploy(WaterFriendliness);
};