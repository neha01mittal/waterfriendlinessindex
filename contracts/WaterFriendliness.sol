pragma solidity ^0.4.4;

contract WaterFriendliness {

    struct Data {
        uint energyperm3;
        uint costperm3;
        uint tds;
        string companyName;
        uint epoch;
        uint id;
        address sender;
    }
    struct Transaction {
        string buyer;
        string companyName;
        uint value;
        uint epoch;
        bool isBuy;
        uint quantity;
        uint id;
        address sender;
    }

    Data[] data_list;
    Transaction[] transaction_list;

    function addTransaction(string _buyer, string _companyName, uint _value, uint _epoch, bool _isBuy,
        uint _quantity, uint _id) public returns (uint) {
        transaction_list.push(Transaction({
            buyer: _buyer,
            companyName: _companyName,
            value: _value,
            epoch: _epoch,
            isBuy: _isBuy,
            quantity: _quantity,
            id: _id,
            sender: msg.sender
        }));

        return _id;
    }

    function addData(uint _energyperm3, uint _costperm3, uint _tds, string _companyName, uint _epoch, uint _id)
public returns (uint){
        data_list.push(Data({
            energyperm3: _energyperm3,
            costperm3: _costperm3,

            tds: _tds,
            companyName: _companyName,
            epoch: _epoch,
            id: _id,
            sender: msg.sender
        }));


        uint index = (3.0*1000000- ((_energyperm3*1000000/12.0) + (_costperm3*1000000/100.0) + (_tds*1000000/30000.0)))*100.0/(1000000*3.0);
        return index;
    }
}