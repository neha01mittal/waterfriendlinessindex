$(function() {
  $(window).load(function() {
$.get('http://pollithy.com:8000/companydata/', function(data) {
      htmlContent = '';
      for (i = 0; i < data.length; i ++) {
        wfi=[];
        val=[];
        for (j=0; j<data[i].data.length; j++){
          wfi.push(data[i].data[j].wfi);
          val.push(data[i].data[j].val);
        }
        htmlContent+= '<div class="row"><div class="col-sm-2"><img src="'+data[i].logo+'" width="32px" height="32px"></div><div class="col-sm-2">'+data[i].name+'</div><div class="col-sm-3"><div id="wfiSparkline-'+i;
        htmlContent+='"></div></div><div class="col-sm-3"><div id="valSparkline-'+i;
        htmlContent += '"></div></div><div class="col-sm-2"><button class="btn btn-success" onclick="document.cookie=\'type=buy\'; document.cookie=\'company='+data[i].name+'\'; document.cookie=\'val='+val[val.length-1]+'\';document.cookie=\'company_id='+data[i].id+'\';window.location=\'/transact.html\';">Buy</button>&nbsp;&nbsp;&nbsp;&nbsp;<button class="btn btn-danger" onclick="document.cookie=\'type=sell\'; document.cookie=\'company_id='+data[i].id+'\';document.cookie=\'company='+data[i].name+'\'; document.cookie=\'val='+val[val.length-1]+'\';window.location=\'/transact.html\';">Sell</button></div></div><br/>';
      }
      document.getElementById('index').innerHTML = htmlContent;

      for (i = 0; i < data.length; i ++) {
      wfi=[];
        val=[];
        for (j=0; j<data[i].data.length; j++){
          wfi.push(data[i].data[j].wfi);
          val.push(data[i].data[j].val);
        }
        Highcharts.chart('valSparkline-'+i, {
    chart: {
        type: 'area',
     backgroundColor: null,
                borderWidth: 0,
                type: 'area',
                margin: [2, 0, 2, 0],
                width: 120,
                height: 20,
                style: {
                    overflow: 'visible'
                },

                // small optimalization, saves 1-2 ms each sparkline
                skipClone: true
            },
            colors:['#FFFFFF'],
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            legend:{
              enabled:false
            },
            xAxis: {
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                }
    },
    yAxis: {
        title: {
            text: ''
        },
        labels:
        {
          style:{
            color:'#FFFFFF'
          }
        }
    },
    plotOptions: {
        area: {
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2
            }
        }
    },
    series: [{name:'val', data:val}]
})


        Highcharts.chart('wfiSparkline-'+i, {
    chart: {
        type: 'area',
     backgroundColor: null,
                borderWidth: 0,
                type: 'area',
                margin: [2, 0, 2, 0],
                width: 120,
                height: 20,
                style: {
                    overflow: 'visible'
                },

                // small optimalization, saves 1-2 ms each sparkline
                skipClone: true
            },
            title: {
                text: ''
            },
            colors:['#FFFFFF'],
            credits: {
                enabled: false
            },
            legend:{
              enabled:false
            },
            xAxis: {
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                }
    },
    yAxis: {
        title: {
            text: ''
        },
        labels:
        {
          style:{
            color:'#FFFFFF'
          }
        }
    },
    plotOptions: {
        area: {
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2
            }
        }
    },
    series: [{name:'wfi', data:wfi}]
});
        
      }

 
      // doChunk(); 
      });
});
});