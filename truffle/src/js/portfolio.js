Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
if(!Date.now) Date.now = function() { return new Date(); }
Date.time = function() { return Date.now().getUnixTime(); }

$.get('http://pollithy.com:8000/portfolio/'+getCookie('user_id'), function(data){
	chartData = [];
	for( var i=0; i<data.transactions.length; i++){
		var someDate = new Date(data.transactions[i].time);
		var theUnixTime = someDate.getUnixTime();
		chartData.push([
			theUnixTime, 
			data.transactions[i].accumulation]); 
	}
	htmlContent= '';
	for(var i =0; i<data.assets.length; i++){
		htmlContent+= '<div class="row" style="color:#0087ff"><div class="panel panel-info"><div class="panel-heading">'+data.assets[i].name
		+'</div><div class="panel-body"><div class="row"><div class="col-sm-4">Valuation</div><div class="col-sm-4">WFI</div><div class="col-sm-4">Quantity</div></div><b><div class="row"><div class="col-sm-4">'
		+Number((data.assets[i].latest_valuation).toFixed(1))+'</div><div class="col-sm-4">'+Number((data.assets[i].value).toFixed(1))+'</div><div class="col-sm-4">'+
		data.assets[i].quantity+'</div></div></b></div></div></div>';
	}
	$('#portfolio').html(htmlContent);

chartData.sort(sortFunction);
function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

	Highcharts.chart('wfiChart', {
    chart: {
        type: 'spline',
        height: 200
    },
     credits: {
                enabled: false
            },
            legend:{
              enabled:false
            },
    title: {
        text: 'Cumulative WFI'
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
            month: '%e. %b',
            year: '%b'
        },
        title: {
            text: 'Date'
        }
    },
    yAxis: {
        title: {
            text: 'Cumulative WFI'
        },
        min: 0
    },
    tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: '{point.x:%e. %b}: {point.y:.2f} '
    },

    plotOptions: {
        spline: {
            marker: {
                enabled: true
            }
        }
    },

    series: [{
        name: 'Your Water Friendliness',
        // Define the data points. All series have a dummy year
        // of 1970/71 in order to be compared on the same x axis. Note
        // that in JavaScript, months start at 0 for January, 1 for February etc.
        data: chartData
}]
});
});

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}