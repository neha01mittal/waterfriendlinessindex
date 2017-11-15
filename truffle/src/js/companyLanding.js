$(function() {
  $(window).load(function() {
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

var fileData = '';
$('#csvfile').on('change', function(data){
	var file = document.getElementById('csvfile').files[0];
	var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
    	fileData= evt.target.result;
    	reportData= fileData.split('\n')[1].split(',');
    document.cookie="epm3="+reportData[0];
    document.cookie="cpm3="+reportData[1];
    document.cookie="tds="+reportData[2];
    };
});
Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
console.log(getCookie('company_id'));
	$.get('http://df482d16.ngrok.io/companydata/'+getCookie('company_id'), function(data) {
    	  $('#company-name').html(data.name);
    	  wfi=[];
    	  val=[];
    	  for(var i=0; i<data.length; i++){
    	  	for(var j=0; j<data[i].data.length; j++){
    	  	var someDate = new Date(data[i].data[j].time);
		    var theUnixTime = someDate.getUnixTime();
    	  	wfi.push([theUnixTime,data[i].data[j].wfi]);
    	  	val.push([theUnixTime, data[i].data[j].val]);
    	  	}
    	  }
    	  Highcharts.chart('wfiChart', {
    chart: {
        type: 'area'
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        allowDecimals: false,
        type:'datetime'
    },
    yAxis: {
        title: {
            text: ''
        },
        labels: {
            formatter: function () {
                return this.value / 1000 + 'k';
            }
        }
    },
    tooltip: {
        pointFormat: '{series.name} <b>{point.y:,.0f}</b><br/>{point.x}'
    },
    plotOptions: {
        area: {
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        }
    },
    series: [{name:'val', data:val}, {name:'wfi', data:wfi}]
})

    	});
   });
});