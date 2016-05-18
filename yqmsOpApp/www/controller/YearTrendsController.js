//연간추이 Ctrl (그래프 Data set)
app.controller('yearTrendsCtrl', ['$scope', '$http', '$state', '$rootScope', '$filter',
    function($scope, $http, $state, $rootScope, $filter){        
        var dbData = $state.params.obj,
            scom_cd = dbData.scom_cd,
            scom1_nm = dbData.scom1_nm;
        
        $rootScope.headTitle = scom1_nm+" 연간 실적 추이";
        $rootScope.backBtnHide = false;       
        $rootScope.backLocation = "/direct";
        
        
        var paramDate = $filter('date')($scope.selectDate, 'yyyy-MM'),
            paramYear = paramDate.split("-")[0],
            imp_rate_arr = [],
            ppm_arr = [],
            ppm_goal_arr = [];
        
        var httpPromise = $http.jsonp(url+"/yqms/getYearTrends.do?callback=JSON_CALLBACK",
                {params : 
                    {
                        year: paramYear,                        
                        scom_cd: scom_cd                                                
                    }
                }                                      
        );
            
        httpPromise
            .success(function(data){
                $scope.tableData = data;
                console.log($scope.tableData)
                angular.forEach(data, function(value, key){
                //수식계산
                    //imp_rate(개선율 = 개선완료(imp_cnt) / 불량건(bad_cnt) * 100)
                    var temp_imp_rate = 0;
                    if(typeof value.imp_cnt !== 'undefined' && typeof value.bad_cnt !== 'undefined'){
                        temp_imp_rate = (value.imp_cnt / value.bad_cnt) * 100;                        
                        temp_imp_rate = parseFloat(temp_imp_rate).toFixed(1);                                                
                    }
                    //ppm( 품질실적 = (불량건수 / 검사(comp_cnt))* 100만 )
                    var temp_ppm = null;
                    if(typeof value.bad_cnt !== 'undefined' && typeof value.comp_cnt !== 'undefined' && value.comp_cnt != 0){
//                        console.log(value)
                        
                        temp_ppm = (value.bad_cnt / value.comp_cnt * 1000000);
                        temp_ppm = parseFloat(temp_ppm).toFixed(1);                                                
                    }else{
//                        console.log(value)
                    }
                    
                    imp_rate_arr.push([Number(value.month), temp_imp_rate]);    //개선율(bar)
                    ppm_arr.push([Number(value.month), temp_ppm]);              //품질수치(line1)
                    ppm_goal_arr.push([Number(value.month), value.ppm_goal]);   //품질목표(line2)
                    
                });                
                
            //그래프 좌우 공백 쓰레기 값
                    var bar_start = [0,0],
                        bar_end = [13, 0],
                        line_start = [0, null],
                        line_end = [13, null];
             //그래프 start/end에 쓰레기 값 넣어서 여백 만들어주기
                imp_rate_arr.splice(12,0,bar_end);
                imp_rate_arr.splice(0,0,bar_start);
                ppm_arr.splice(12,0,line_end);
                ppm_arr.splice(0,0,line_start);
                ppm_goal_arr.splice(12,0,line_end);
                ppm_goal_arr.splice(0,0,line_start);
                    
                
                drawChart(imp_rate_arr, ppm_arr, ppm_goal_arr);
            })
            .error(function(data, status, header, config){
                console.log(status);
                console.log(config);
                console.log(header);
            }); // end $http()
        
        var drawChart = function(imp_rate_arr, ppm_arr, ppm_goal_arr){
        //get max_value
            var max_arr = [];
            for(var i=0; i<ppm_arr.length; i++){
                max_arr.push(ppm_arr[i][1]);
                max_arr.push(ppm_goal_arr[i][1]);
            }            
            Array.prototype.max = function() {
              return Math.max.apply(null, this);
            };
            //라인 차트에서 쓰일 최대값을 구했지만
            //y축의 tick interval을 고려해야한다.
            var line_max_value = max_arr.max();
            if(line_max_value !== null)
                line_max_value = (Math.floor(line_max_value/100) * 100 + 100)
            else
                line_max_value = 100;
//            console.log(line_max_value)
//            console.log(max_arr)
            
            $scope.data = [
                {
                    "key" : "개선율",
                    "bar": true,
                    "values" :  imp_rate_arr
                },
                {
                    "key" : "품질실적",
                    "values" : ppm_arr 
                },
                {
                    "key" : "품질목표" ,
                    "values" :  ppm_goal_arr
                },
                
            ]
                .map(function(series) {
                    series.values = series.values.map(function(d){                        
                            return {x: d[0], y: d[1] };                        
                    });
                    
                    return series;
                });        
        
        
        $scope.options = {
            chart: {
                type: 'linePlusBarChart',
                height: 250,
                margin: {
                    top: 30,
                    right: 40,
                    bottom: 50,
                    left: 40
                },
                showLegend:true,
                legendLeftAxisHint:"(%)",
                legendRightAxisHint:"",
                showValues: true,
                tooltip:{
                    tooltipContent: function(key, x, y, e, graph){
                        return '<h3>' + key + '</h3>' + '<p>' +  y + ' on ' + x + '</p>';
                    }
                },
                focusEnable: false,                                
                lines1: {
                    forceX: [0.5, 12.5]
                    
                },
                lines2: {
                    forceX: [0.5, 12.5]
                    
                },
                bars: {
                    forceX: [0.5, 12.5]
                    ,forceY: [0, 100]
                },
                yDomain: [0, line_max_value],
                
                color: ['#2ca02c', 'darkred', 'blue'],
                x: function(d,i) { return i },
                xAxis: {
                    axisLabel: false,
                    tickFormat: function(d) {
                        var dx = $scope.data[0].values[d] && $scope.data[0].values[d].x || 0;
                        if (dx > 0) {                            
                            return dx;
                        }
                        return null;
                    }
                    ,tickValues : function(d){
                        var xTick = [];
                        for(var i=1; i<13; i++)
                            xTick.push(i);
                        return xTick;
                    }
                    
                },
                y1Axis: {                    
                    tickFormat: function(d){                        
                        return d3.format(',.0f')(d)+'%';
                    },
                    axisLabelDistance: 20
                },
                y2Axis: {                    
                    tickFormat: function(d, i) {                        
                        return d3.format(',0f')(d);              
                    }
                    
                }
            }
        };  // end $scope.options            
    };  // end drawChart()       
}]);