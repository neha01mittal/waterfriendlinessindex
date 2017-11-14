pragma
solidity ^ 0.4.11;

import 'truffle/Assert.sol';
import 'truffle/DeployedAddresses.sol';
import '../contracts/WaterFriendliness.sol';

contract TestWater
{
    WaterFriendliness waterf = WaterFriendliness(DeployedAddresses.WaterFriendliness());

    function testAddData() {
        uint index = waterf.addData(3, 50, 20000, 'Appl', 2, 2);
        Assert.equal(uint(52), index, 'Data index and id should be returned');
    }

    function testAddTransaction() {
        uint id = waterf.addTransaction( 'Neha', 'Appl', 43, 3
            , true,
            2, 12);
        Assert.equal(12, id, 'Id should be returned');
    }
}