App = {
    web3Provider: null,
    contractAddress: "0x...",
    contractABI: [{"constant":false,"inputs":[{"name":"_energyperm3","type":"uint8"},{"name":"_costperm3","type":"uint8"},{"name":"_tds","type":"uint8"},{"name":"_companyName","type":"address"},{"name":"_epoch","type":"uint8"}],"name":"addData","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_buyer","type":"address"},{"name":"_companyName","type":"address"},{"name":"_value","type":"uint8"},{"name":"_epoch","type":"uint8"},{"name":"_isBuy","type":"bool"},{"name":"_quantity","type":"uint8"}],"name":"addTransaction","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"}],
    walletaddress: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",

    contracts: {},

    init: function () {
        // Load pets.
        $.getJSON('../pets.json', function (data) {
            var petsRow = $('#petsRow');
            var petTemplate = $('#petTemplate');

            for (i = 0; i < data.length; i++) {
                petTemplate.find('.panel-title').text(data[i].name);
                petTemplate.find('img').attr('src', data[i].picture);
                petTemplate.find('.pet-breed').text(data[i].breed);
                petTemplate.find('.pet-age').text(data[i].age);
                petTemplate.find('.pet-location').text(data[i].location);
                petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

                petsRow.append(petTemplate.html());
            }
        });

        return App.initWeb3();
    },

    initWeb3: function () {
        // Is there is an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fallback to the TestRPC
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function () {
        $.getJSON('WaterFriendliness.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var WaterArtifact = data;
            App.contracts.WaterFriendliness = TruffleContract(WaterArtifact);
            // Set the provider for our contract
            App.contracts.WaterFriendliness.setProvider(App.web3Provider);

        });

        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '.btn-invest', App.handleInvest);
        $(document).on('click', '.btn-transaction', App.handleTransactionAudit);
        $(document).on('click', '.btn-data', App.handleDataAudit);
        $(document).on('click', '.btn-upload', App.handleUpload);
    },

    handleUpload: function () {
        var waterInstance;

        App.contracts.WaterFriendliness.deployed().then(function (instance) {
            waterInstance = instance;
            return waterInstance.addData.call(3, 50, 20000, 'Appl', 2, {from: App.walletaddress});
        }).then(function (result) {
            console.log('RESULT');
            console.log(result);
            //return App.markAdopted();
        }).catch(function (err) {
            console.log(err.message);
        });
    },
    handleInvest: function () {
        var waterInstance;

        App.contracts.WaterFriendliness.deployed().then(function (instance) {
            waterInstance = instance;
            return waterInstance.addTransaction.call( 'Neha',  'Aapl', 23, 2, true,
                2, {from: App.walletaddress});
        }).then(function (result) {
            console.log('buy/ sell');
            console.log(result);
        }).catch(function (err) {
            console.log(err.message);
        });
    },
    handleTransactionAudit: function () {
        var waterInstance;

        App.contracts.WaterFriendliness.deployed().then(function (instance) {
            waterInstance = instance;
            return waterInstance.transaction_audit.call(1, {from: App.walletaddress});
        }).then(function (result) {
            console.log('transaction audit');
            console.log(result);
        }).catch(function (err) {
            console.log(err.message);
        });
    },
    handleDataAudit: function () {
        var waterInstance;

        App.contracts.WaterFriendliness.deployed().then(function (instance) {
            waterInstance = instance;
            return waterInstance.data_audit.call(1, {from: App.walletaddress});
        }).then(function (result) {
            console.log('Data Audit');
            console.log(result)
        }).catch(function (err) {
            console.log(err.message);
        });
    }

};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
