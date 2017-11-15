App = {
    web3Provider: null,
    contractAddress: "0x...",
    contractABI: [{
        "constant": false,
        "inputs": [{"name": "_energyperm3", "type": "uint8"}, {"name": "_costperm3", "type": "uint8"}, {
            "name": "_tds",
            "type": "uint8"
        }, {"name": "_companyName", "type": "address"}, {"name": "_epoch", "type": "uint8"}],
        "name": "addData",
        "outputs": [{"name": "", "type": "uint256"}, {"name": "", "type": "string"}],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_buyer", "type": "address"}, {
            "name": "_companyName",
            "type": "address"
        }, {"name": "_value", "type": "uint8"}, {"name": "_epoch", "type": "uint8"}, {
            "name": "_isBuy",
            "type": "bool"
        }, {"name": "_quantity", "type": "uint8"}],
        "name": "addTransaction",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }],
    walletaddress: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",

    contracts: {},

    init: function () {
        
        return App.initWeb3();
    },
    getCookie: function (cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
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
            currentUnixTime = Math.round((new Date()).getTime() / 1000);
            return waterInstance.addData.call(App.getCookie('epm3'), App.getCookie('cpm3'), App.getCookie('tds'), App.getCookie('company_name'), currentUnixTime, Math.round(Math.random()*100000), {from: App.walletaddress});
        }).then(function (result) {
            document.cookie="newWFI="+result[0].c[0];
            document.cookie="bkcnUploadId="+result[1].c[0];
            $.ajax({
                type:'POST',
                url:'http://df482d16.ngrok.io/upload/',
                data: {
                    'company_id':App.getCookie('company_id'),
                    'wfi':result[0].c[0]
                },
                success: function(data){
                  if (!data.error){
                    $('#confirmed').html('Uploaded to Blockchain!');
                    setTimeout(function(){ window.location = '/companyLanding.html'; }, 1500);
                  }
              }
            })
            //return App.markAdopted();
        }).catch(function (err) {
            console.log(err.message);
        });
    },
    handleInvest: function () {
        var waterInstance;

        App.contracts.WaterFriendliness.deployed().then(function (instance) {
            waterInstance = instance;
            currentUnixTime = Math.round((new Date()).getTime() / 1000);
            return waterInstance.addTransaction.call(App.getCookie('user_id'), App.getCookie('company'), App.getCookie('val'), currentUnixTime, App.getCookie('type') == 'buy',
                App.getCookie('quantity'), Math.round(Math.random()*100000), {from: App.walletaddress});
        }).then(function (result) {
            console.log('buy/ sell');
            console.log(result);
            document.cookie = "transactionReply=" + result;
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

$(function(){
    $('#clickme').click(function(){
        $('#uploadme').click();
    });

    $('#uploadme').change(function(){
        $('#filename').val($(this).val());
    });
});
